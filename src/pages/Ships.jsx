import React from 'react'
import { useLoaderData } from 'react-router'
import { apiRequest } from '../helpers/ApiRequest';

export function shipLoader({params, request}){
  
  //send ally_code if searched for
  //return apiRequest("ships?ally_code=34");
  return apiRequest("ships");
}

export default function Ships() {

  const loader = useLoaderData();

  return (
    <div>
      <div>
        <h2>Ships</h2>
      <ul>
        {loader.map((ship, index) => (
          <li key={"ship_"+index}>{ship.character_name}</li>
        ))}
 
      </ul>  
      </div>
    </div>
  )
}
