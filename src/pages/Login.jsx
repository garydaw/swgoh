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
      
      const check = await apiRequest('auth/check', 'GET');
      if(check.auth){
        await login( check);
        //navigate to characters, need to update this for deep linking
        navigate("/characters");
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
      const userData = await apiRequest('auth/login', 'POST', { username, password });
      await login( userData);
      navigate("/characters");
    } catch(error) {
      // Handle login failure
      setLoginError(error.message);
    }
  };


  function usernameChanged(e) {
    setUsername(e.target.value);
  }

  function passwordChanged(e) {
    setPassword(e.target.value);
  }

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
  
  return (
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              onChange={usernameChanged}/>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border text-gray-700 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              onChange={passwordChanged}/>
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="sumbit">
              Sign In
            </button>
          </div>
          <div className={loginError === "" ? "d-none" : "d-show pb-3 text-danger"}>
            {loginError}
          </div>
        </form>
      </div>
    
  )
}
