import React from 'react'
import { useAuth } from '../../store/useAuth';
import { apiRequest } from '../../helpers/ApiRequest';

export default function LogoutButton() {
  const {logout} = useAuth();

  //call logout api to invalidate cookie
  const handleLogout = async (e) => {
    try{
      await apiRequest('auth/logout', 'POST');
      await logout();
    } catch(error){
      //still call logout
      await logout();
    }
  }

  return (
    <button onClick={handleLogout}>Logout</button>
  )
}
