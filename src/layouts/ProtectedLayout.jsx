import React, { useEffect, useState } from 'react';
import css from './ProtectedLayout.module.css'
import NavBar from '../components/general/NavBar';
import { useAuth } from '../store/useAuth';
import Header from '../pages/Header';
import { useNavigate } from 'react-router';

export default function ProtectedLayout(props) {
  const [isLoggedIn, setisLoggedIn] = useState(false)
  const navigate = useNavigate();
  const user = useAuth();
  
  useEffect(() => {
    if(user.token === null){
      navigate("/");
      setisLoggedIn(false);
    } else {
      setisLoggedIn(true);
    }
  })
  
  if(!isLoggedIn)
    return <></>

  return (
    <>
    <Header/>

    <div className={css.container}>
        <NavBar/>

        <main>
        {props.children}
        </main>
    </div>
    </>
  )
}
