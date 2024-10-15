import React from 'react'
import { useLoaderData } from 'react-router'
import { apiRequest } from '../helpers/ApiRequest';

export function shipLoader({params, request}){
  
  const url = new URL(request.url);
  const ally_code = url.searchParams.get('ally_code') || "";

  if(ally_code === "" ){
    return apiRequest("ships", true, "GET");
  } else {
    return apiRequest("ships?ally_code=" + ally_code, true, "GET");
  }

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
