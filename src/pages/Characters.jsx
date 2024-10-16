import React from 'react'
import { useLoaderData } from 'react-router'
import { apiRequest } from '../helpers/ApiRequest';

export function characterLoader({params, request}){
 
  const url = new URL(request.url);
  const ally_code = url.searchParams.get('ally_code') || "";

  if(ally_code === "" ){
    return apiRequest("characters", true, "GET");
  } else {
    return apiRequest("characters?ally_code=" + ally_code, true, "GET");
  }
  
}

export default function Characters() {


  //const globalStore = useGlobalContext();
  
  const loader = useLoaderData();

  return (
    <div>
      <div>
        <h2>Characters</h2>
      <ul>
        {loader.map((character, index) => (
          <li key={"character_"+index}>{character.character_name} - {character.power}</li>
        ))}
 
      </ul>  
      </div>
    </div>
  )
}
