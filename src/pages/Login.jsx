import React, { useEffect, useState } from 'react'
import {  useNavigate } from 'react-router-dom'
import { useAuth } from '../store/useAuth';
import { apiRequest } from '../helpers/ApiRequest';

export default function Login() {

  const { login } = useAuth();
  const [loginError, setLoginError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  //see if user is logged in
  useEffect(() => {
    // Send a request to the backend to check if the user is logged in
    
    const checkLoginStatus = async () => {
      
      const check = await apiRequest('auth/check', false, 'GET');
      if(check.auth){
        await login( check);
        
        //navigate to deeplink or default to characters
        const path = localStorage.getItem("deepLink") ?? '/characters'
        localStorage.removeItem("deepLink")
        navigate(path);
      } else {
        localStorage.setItem('isLoggedIn', false);
      }
      
    };

    //check if use is still logged in
    checkLoginStatus();
  }, []);


  //call login
  const handleLogin = async (e) => {
    //prevent default and clear error message
    e.preventDefault();
    setLoginError("");

    
    try {
      const userData = await apiRequest('auth/login', false, 'POST', { username, password });
      await login( userData);
      navigate("/characters");
    } catch(error) {
      // Handle login failure
      setLoginError(error.message);
    }
  };

  return (
    <div className="row">
        <div className="col-4 offset-4 card d-show mt-5 pb-3">
          <h2 className="text-center mb-4">Login</h2>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" 
                        className="form-control"
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required></input>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required></input>
            </div>
            <div className={loginError === "" ? "d-none" : "d-show pb-3 text-danger"}>
              {loginError}
            </div>
            <button type="submit" onClick={handleLogin} className="btn btn-primary btn-block">Login</button>
        </div>
      </div>
  );
  
}
