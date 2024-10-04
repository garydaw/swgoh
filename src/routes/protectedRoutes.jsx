import React, { Children } from 'react'
import Units, {unitLoader} from '../pages/Units';
import Ships from '../pages/Ships';
import ProtectedLayout from '../layouts/ProtectedLayout';

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