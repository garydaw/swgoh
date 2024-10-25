import React from 'react'
import Units, {unitLoader} from '../pages/Units';
import ProtectedLayout from '../layouts/ProtectedLayout';
import JourneyGuide from '../pages/JourneyGuide';
import GAC from '../pages/GAC';
import TW from '../pages/TW';
import RoTE from '../pages/RoTE';
import Tips from '../pages/Tips';
import UserAdmin from '../pages/UserAdmin';

//all the protected routes
export const protectedcRoutes = [
  {
    element:React.createElement(ProtectedLayout),
    children:[
          { 
            path:"/characters",
            element:React.createElement(Units, { combat_type: "character" }),
            loader:unitLoader
          },
          {
            path:"/ships",
            element:React.createElement(Units, { combat_type: "ships" }),
            loader:unitLoader
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
            path:"/userAdmin",
            element:React.createElement(UserAdmin),
          }
        ]
      }
];