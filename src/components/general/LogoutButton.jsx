import React from 'react'
import { useAuth } from '../../store/useAuth';
import { apiRequest } from '../../helpers/ApiRequest';

export default function LogoutButton() {
  const {logout} = useAuth();

  //call logout api to invalidate cookie
  const handleLogout = async (e) => {
    try{
      await apiRequest('auth/logout', true, 'POST');
      await logout();
    } catch(error){
      //still call logout
      await logout();
    }
  }

  return (
    <div className="dropdown">
      <a className="btn dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
      <i className="bi bi-person-circle fs-3"/>
      </a>

      <ul className="dropdown-menu">
        <li><span className="dropdown-item" onClick={handleLogout}>Logout</span></li>
        <li><span className="dropdown-item">Change Password</span></li>
      </ul>
    </div>
  )
}
