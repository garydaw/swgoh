import React, { useEffect, useState, useContext } from 'react';
import css from './ProtectedLayout.module.css'
import { useAuth } from '../store/useAuth';
import { Outlet, useLocation, useNavigate } from 'react-router';
import Navigation from '../components/general/Navigation';
import LogoutButton from '../components/general/LogoutButton';
import SearchableList from '../components/general/SearchableList';
import { GlobalContext } from '../store/GlobalStore';
import {  useSearchParams } from 'react-router-dom';

export default function ProtectedLayout(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOverlay, setsidebarOverlay] = useState(false);
  const {isLoggedIn, username} = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('ally_code') || username);
  
  const data = useContext(GlobalContext);
  
  //if user is not logged in navigate back to login
  useEffect(() => {
    if(!isLoggedIn){
      const redirectPath = `/?redirect=${encodeURIComponent(location.pathname + location.search)}`;
      navigate(redirectPath);
    }
    
  })
  
  //show/hide the side bar
  function sidebarToggle(){
    setsidebarOverlay(!sidebarOverlay);
  }

  //update search params when ally is selected
  const searchAllyHandleItemClick = (item) => {

    setSearchTerm(item["ally_code"]);

    // Update the URL query parameter
    setSearchParams({ ally_code: item["ally_code"] });
  };

  //if not logged in return empty element
  if(!isLoggedIn)
    return <></>;

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column">

      {/* HEADER */}
      <div className={"row "+css.header}>
        <div className="col-10 d-flex align-items-center">
          <i role="btn" className='btn bi-list ms-2 d-block d-sm-none' onClick={sidebarToggle}></i>
          <h3 className='d-none d-sm-block'>Mos Eisley&apos;s Vip Club</h3>
          <div className="form-group row ps-5">
            <SearchableList
              items={data.allies}
              item_id="ally_code"
              item_name="ally_name"
              placeholder={data.getUserName(searchTerm)}
              clickHandler={searchAllyHandleItemClick}/>
          </div>
        </div>
        
        <div className="col-2 text-end">
          <LogoutButton/>
        </div>
      </div>

      <div className="row flex-grow-1">
        {/* SIDE NAVIGATION */}
        <div id="sidebar" className={sidebarOverlay ? css.sidebar+" col-3 sidebar-overlay": css.sidebar+" col-2 d-none d-sm-block"}>
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



