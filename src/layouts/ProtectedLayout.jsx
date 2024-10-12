import React, { useEffect, useState, useContext } from 'react';
import css from './ProtectedLayout.module.css'
import { useAuth } from '../store/useAuth';
import { Outlet, useNavigate } from 'react-router';
import Navigation from '../components/general/Navigation';
import LogoutButton from '../components/general/LogoutButton';
import SearchableList from '../components/general/SearchableList';
import { GlobalContext } from '../store/GlobalStore';
import { apiRequest } from '../helpers/ApiRequest';

export default function ProtectedLayout(props) {
  const navigate = useNavigate();
  const [sidebarOverlay, setsidebarOverlay] = useState(false);
  const {isLoggedIn} = useAuth();
  
  const data = useContext(GlobalContext);
  
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
        <div className="col-11 d-flex align-items-center">
          <i role="btn" className='btn bi-list ms-2 d-block d-sm-none' onClick={sidebarToggle}></i>
          <h3 className='d-none d-sm-block'>Mos Eisley&apos;s Vip Club</h3>
          <div className="form-group row ps-5">
            <SearchableList items={data.allies} item_id="ally_code" item_name="ally_name"/>
          </div>
        </div>
        
        <div className="col-1 text-end">
          <LogoutButton/>
        </div>
      </div>

      <div className="row flex-grow-1">
        {/* SIDE NAVIGATION */}
        <div id="sidebar" className={sidebarOverlay ? 'sidebar col-3 sidebar-overlay': css.sidebar+" col-2 d-none d-sm-block"}>
          <Navigation></Navigation>
        </div>
        
        {/* MAIN CONTENT */}
        <div id="content" className={"col " +css.content}>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}



