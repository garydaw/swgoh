import React, { useEffect, useState } from 'react';
import css from './ProtectedLayout.module.css'
import { useAuth } from '../store/useAuth';
import { Outlet, useNavigate } from 'react-router';
import Navigation from '../pages/Navigation';
import LogoutButton from '../components/general/LogoutButton';

export default function ProtectedLayout(props) {
  const navigate = useNavigate();
  const [sidebarOverlay, setsidebarOverlay] = useState(false);
  const {isLoggedIn} = useAuth();
  
  //if user is not logged in navigate back to login
  useEffect(() => {
    if(!isLoggedIn){
      navigate("/");
    } 
  })
  
  //show/hide the side bar
  function sidebarToggle(){
    setsidebarOverlay(!sidebarOverlay);
  }

  //if not logged in return empty element
  if(!isLoggedIn)
    return <></>

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column">

      {/* HEADER */}
      <div className="row">
        <div className="col-8 d-flex align-items-center">
          <h3>Mos Eisley&apos;s Vip Club</h3>
          <i role="btn" className={sidebarOverlay ? 'btn bi-list ms-2 d-block' : 'btn bi-list ms-2 d-block d-sm-none'} onClick={sidebarToggle}></i>
        </div>

        <div className="col-4 text-end">
          <LogoutButton/>
        </div>
      </div>

      <div className="row flex-grow-1">
        {/* SIDE NAVIGATION */}
        <div id="sidebar" className={sidebarOverlay ? 'sidebar col-3 sidebar-overlay': "col-2 d-none d-sm-block"}>
          <Navigation></Navigation>
        </div>
        
        {/* MAIN CONTENT */}
        <div id="content" className="col content">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}



