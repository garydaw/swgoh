import React from 'react'
import { useLoaderData } from 'react-router'
import { apiRequest } from '../helpers/ApiRequest';
import CharacterBasic from '../components/units/CharacterBasic';

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
  
  const loader = useLoaderData();

  return (
    <div>
      <div>
        <h2>Characters</h2>
        <div className='container'>
          <div className="row">
            {loader.map((character, itemIndex) => (
              <CharacterBasic key={"character_"+itemIndex} character={character}/>
            ))}
          </div>
        </div>  
      </div>
    </div>
  )
}
