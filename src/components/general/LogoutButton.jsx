import React from 'react'
import { useAuth } from '../../store/useAuth';

export default function LogoutButton() {
  const {logout} = useAuth();

  //call logout api to invalidate cookie
  const handleLogout = async (e) => {
    const response = await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include', 
    });

    if (response.ok) {
      await response.json();
      await logout();
    }
  }

  return (
    <button onClick={handleLogout}>Logout</button>
  )
}
