import React from 'react'
import Characters, {characterLoader} from '../pages/Characters';
import Ships, {shipLoader} from '../pages/Ships';
import ProtectedLayout from '../layouts/ProtectedLayout';
import JourneyGuide from '../pages/JourneyGuide';
import GAC from '../pages/GAC';
import TW from '../pages/TW';
import RoTE from '../pages/RoTE';
import Tips from '../pages/Tips';
import Admin from '../pages/Admin';

//all the protected routes
export const protectedcRoutes = [
  {
    element:React.createElement(ProtectedLayout),
    children:[
          { 
            path:"/characters",
            element:React.createElement(Characters),
            loader:characterLoader
          },
          {
            path:"/ships",
            element:React.createElement(Ships),
            loader:shipLoader
          },
          {
            path:"/journey",
            element:React.createElement(JourneyGuide),
          },
          {
            path:"/gac",
            element:React.createElement(GAC),
          },
          {
            path:"/tw",
            element:React.createElement(TW),
          },
          {
            path:"/rote",
            element:React.createElement(RoTE),
          },
          {
            path:"/tips",
            element:React.createElement(Tips),
          },
          {
            path:"/admin",
            element:React.createElement(Admin),
          }
        ]
      }
];