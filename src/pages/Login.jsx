import React, { useEffect, useState } from 'react'
import {  useNavigate } from 'react-router-dom'
import { useAuth } from '../store/useAuth';

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
      const response = await fetch('http://localhost:5000/api/auth/check', {
        method: 'GET',
        credentials: 'include', 
      });

      if (response.ok) {
        //store user data
        const userData = await response.json();
        await login( userData);
        //navigate to units, need to update this for deep linking
        navigate("/units");
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

    //check user credentials
    const response = await fetch('http://localhost:5000/api' + '/auth/login', {
      method: 'POST',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });
  
    if (response.ok) {
      //if all good get user details and redirect to units
      const userData = await response.json();
      await login( userData);
      navigate("/units");
    } else {
      // Handle login failure
      const errorData = await response.json();
      setLoginError(errorData.message);
    }
  };


  function usernameChanged(e) {
    setUsername(e.target.value);
  }

  function passwordChanged(e) {
    setPassword(e.target.value);
  }

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
