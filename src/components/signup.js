import axios from 'axios'
import React, { useRef,useState } from 'react'
import Login from './login';
const signup = (props) => {
    const RefUsername = useRef(null);
    const RefEmail = useRef(null);
    const RefPassword = useRef(null);

    //   const [message, setMessage] = useState({
    //       username: " ",
    //       password: " ",
    //       email: " "
    //   })
    const handleSubmit = async () => {

        try {
            await axios.post(`${process.env.url}/user/register/`, {
                username: RefUsername.current.value,
                email: RefEmail.current.value,
                password: RefPassword.current.value
            })
            props.setUser(RefUsername.current.value);
            localStorage.setItem("username",RefUsername.current.value)
        } catch (e) {
            console.error(e);
        }
    }
     
    const handleLogin = ()=>{
      props.setLoginPage(true);
      props.setSigninPage(false);
    }
    return (
        <>
        {props.loginPage&&<Login/>}
        {props.signinPage&&<div className='formbox'>
            <div className="login-box">
                <h2>Sign up</h2>
                <form>
                    <div className="user-box">
                        <input type="text"  ref={RefUsername} name="" required="" />
                        <label>Username</label>
                    </div>
                    <div className="user-box">
                        <input type="email" ref={RefEmail} name="" required="" />
                        <label>Email</label>
                    </div>
                    <div className="user-box">
                        <input type="password" ref={RefPassword} name="" required="" />
                        <label>Password</label>
                    </div>
                    <a href="#" onClick={handleSubmit}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Submit
                    </a>
                </form>
                <button className='btnls' onClick={handleLogin}>Login</button>
            </div>
        </div>}
        </>
    )
}

export default signup
