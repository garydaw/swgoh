import React from 'react'
import { useLoaderData } from 'react-router'
import { apiRequest } from '../helpers/ApiRequest';

export function characterLoader({params, request}){
  
  return apiRequest("characters");
}

export default function Characters() {


  //const globalStore = useGlobalContext();
  
  const loader = useLoaderData();

  return (
    <div>
      <div>
        <h2>Characters</h2>
      <ul>
        {loader.map((characters, index) => (
          <li key={"characters_"+index}>{characters.character_name}</li>
        ))}
 
      </ul>  
      </div>
    </div>
  )
}
