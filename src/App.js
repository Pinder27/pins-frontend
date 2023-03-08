import React,{useState} from 'react';
import Themap from './components/themap'
import Login from './components/login';

//CORS_DOMAINS = http://localhost:3000, http://localhost:3001, https://example.com
function App() {
    const [user, setUser] = useState(null)
    console.log(localStorage.getItem('username'));
    if(!user)
    if(localStorage.getItem('username')){
      setUser(localStorage.getItem('username'));
    }
    
  return (
    <>
    
     {!user&&<Login setUser = {setUser}/>} 
     {user&&<Themap username={user} setUser = {setUser}/>}
    </>
  );
}

export default App;
