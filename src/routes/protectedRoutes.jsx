import React from 'react'
import Characters, {characterLoader} from '../pages/Characters';
import Ships, {shipLoader} from '../pages/Ships';
import ProtectedLayout from '../layouts/ProtectedLayout';

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
          }
        ]
      }
];