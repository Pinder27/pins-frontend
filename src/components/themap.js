import React, { useRef, useEffect, useState } from 'react';

import { getPins, addPin, removePin } from './util'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX


const themap = (props) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(12.554729);
  const [lat, setLat] = useState(55.70651);
  const [zoom, setZoom] = useState(9);
  const [pins, setPins] = useState([]);
  const [popupLngLat, setPopupLngLat] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [click, setClick] = useState(false)
  const popup_title = useRef('')
  const popup_desc = useRef('')
  const marker_latlng = useRef(null);
  const [geoOn, setGeoOn] = useState(false)

  
  useEffect(() => {

    (async () => {

      const res = await getPins(props.username);
      console.log(res);
      setPins(res);
      setUpdated(true);

    })();

  }, []);

  useEffect(() => {
    console.log('these are-' + pins);
    pins.map((pin) => {
      const innerHtmlContent = `<div>
    <h3 class='popup-heading'>${pin.title} </h3>
    <p class='popup-desc'>${pin.desc}</p>
     </div>`;

      const divElement = document.createElement('div');
      const assignBtn = document.createElement('div');
      assignBtn.innerHTML = `<button class="btn btn-success btn-simple text-white" >Remove Pin</button>`;
      divElement.innerHTML = innerHtmlContent;
      divElement.appendChild(assignBtn);
     
      assignBtn.addEventListener('click', (e) => {
        console.log(marker_latlng.current);
        const pin = {
            lng: marker_latlng.current.getLngLat().lng,
            lat: marker_latlng.current.getLngLat().lat
        }
        removePin(pin);
        marker_latlng.current.remove();
      });

      const popup = new mapboxgl.Popup({
        offset: 25
      })
      .setDOMContent(divElement);

      const marker1 = new mapboxgl.Marker()
        .setLngLat([pin.lng, pin.lat])
        .setPopup(popup)
        .addTo(map.current);

      marker1.getElement().addEventListener('click', () => {
        console.log(marker1.getLngLat());
        marker_latlng.current = marker1;
      });
    })
  }, [updated])

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
   
   const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true,
    showUserLocation:true
});

    map.current.addControl(geolocate);
   geolocate.on('geolocate', function(e) {
    var lon = e.coords.longitude;
    var lat = e.coords.latitude
    var position = [lon, lat];
    setPopupLngLat({
      lng:e.coords.longitude,
      lat:e.coords.latitude
    })
    console.log(position);
    setGeoOn(true);
});

// const geocoder = new MapboxGeocoder({
//   accessToken: mapboxgl.accessToken,
//   mapboxgl: mapboxgl
// });

  })


  useEffect(() => {
    if (!map.current) return; // wait for map to initialize

    map.current.on('move', () => {
      
      setZoom(map.current.getZoom().toFixed(2));
    });
    map.current.on('mousemove', (e) => {
      setLng(e.lngLat.lng.toFixed(4));
      setLat(e.lngLat.lat.toFixed(4));
    });

  });

  const handleSave = () => {

    const marker = new mapboxgl.Marker()
      .setLngLat([popupLngLat.lng, popupLngLat.lat])
      .addTo(map.current);

    const new_pin = {
      username: props.username,
      title: popup_title.current.value,
      desc: popup_desc.current.value,
      rating: 0,
      lat: popupLngLat.lat,
      lng: popupLngLat.lng
    }
    addPin(new_pin)

    const innerHtmlContent = `<div>
    <h3 class='popup-heading'>${popup_title.current.value} </h3>
    <p class='popup-desc'>${popup_desc.current.value}</p>
     </div>`;

      const divElement = document.createElement('div');
      const assignBtn = document.createElement('div');
      assignBtn.innerHTML = `<button class="btn btn-success btn-simple text-white" >Remove Pin</button>`;
      divElement.innerHTML = innerHtmlContent;
      divElement.appendChild(assignBtn);
    
      assignBtn.addEventListener('click', (e) => {
       
        const pin = {
            lng: marker.getLngLat().lng,
            lat: marker.getLngLat().lat
        }
        removePin(pin);
        marker.remove();
      });

      const popup = new mapboxgl.Popup({
        offset: 25
      })
      .setDOMContent(divElement);

    marker.setPopup(popup);

    setClick(false);

  }

  useEffect(() => {
    if (!map.current) return;
    map.current.on('dblclick', (e) => {
      console.log(`A click event has occurred at ${e.lngLat}`);

      setLat(e.lngLat.lat.toFixed(4));
      setLng(e.lngLat.lng.toFixed(4));
      setPopupLngLat({
        lng: e.lngLat.lng,
        lat: e.lngLat.lat
      })

      setClick(true);

    });
  })

  const handleLogout = () => {
    props.setUser(null);
    localStorage.removeItem('username');
  }

  const handleUserLocation = ()=>{
    
    setClick(true);
    
  }

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
      <button className='logoutbtn' onClick={handleLogout}>log out</button>
     {geoOn&& <button className='pinforuserlocation' onClick={handleUserLocation}>Add pin to current Location</button>}
      {click && <div className='popup-form'>
        <div className='formbox'>
          <div className="login-box">
            <h2>Pin Details</h2>
            <form>
              <div className="user-box">
                <input type="text" ref={popup_title} name="" required="" />
                <label>Title</label>
              </div>
              <div className="user-box popup-input">
                <textarea className='textarea-popup' type="text" ref={popup_desc} name="" required="" />
                <label>Description</label>
              </div>
              <a href="#" onClick={handleSave}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Save
              </a>

            </form>

          </div>
        </div>
      </div>}
    </div>
  );
}

export default themap;
