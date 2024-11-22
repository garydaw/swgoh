import React from 'react'
import Units, {unitLoader} from '../pages/Units';
import ProtectedLayout from '../layouts/ProtectedLayout';
import JourneyGuides, {journeyLoader} from '../pages/JourneyGuides';
import GAC, { gacLoader } from '../pages/GAC';
import TW, { twLoader } from '../pages/TW';
import RoTE from '../pages/RoTE';
import Tips from '../pages/Tips';
import Relics from '../pages/Relics';
import UserAdmin from '../pages/UserAdmin';
import TeamAdmin from '../pages/TeamAdmin';
import TWCounters, {twcountersLoader} from '../pages/TWCounters';

//all the protected routes
export const protectedcRoutes = [
  {
    element:React.createElement(ProtectedLayout),
    children:[
          { 
            path:"/characters",
            element:React.createElement(Units, { combat_type: "characters" }),
            loader:unitLoader
          },
          {
            path:"/ships",
            element:React.createElement(Units, { combat_type: "ships" }),
            loader:unitLoader
          },
          {
            path:"/journey",
            element:React.createElement(JourneyGuides),
            loader:journeyLoader
          },
          {
            path:"/gac",
            element:React.createElement(GAC),
            loader:gacLoader
          },
          {
            path:"/tw",
            element:React.createElement(TW),
            loader:twLoader
          },
          {
            path:"/twcounters",
            element:React.createElement(TWCounters),
            loader:twcountersLoader
          },
          {
            path:"/rote",
            element:React.createElement(RoTE),
          },
          {
            path:"/relics",
            element:React.createElement(Relics),
          },
          {
            path:"/userAdmin",
            element:React.createElement(UserAdmin),
          },
          {
            path:"/teamAdmin",
            element:React.createElement(TeamAdmin),
          }
        ]
      }
];