import React from 'react'
import Units, {unitLoader} from '../pages/Units';
import Ships from '../pages/Ships';
import ProtectedLayout from '../layouts/ProtectedLayout';

//all the protected routes
export const protectedcRoutes = [
  {
    element:React.createElement(ProtectedLayout),
    children:[
          { 
            path:"/units",
            element:React.createElement(Units),
            loader:unitLoader
          },
          {path:"/ships", element:React.createElement(Ships)}
        ]
      }
];