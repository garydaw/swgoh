import React from 'react'
import ProtectedLayout from '../layouts/ProtectedLayout'
import { useLoaderData } from 'react-router'
import { GlobalProvider, useGlobalContext } from '../store/GlobalStore'
import { useLocalStorage } from '../store/useLocalStorage'


export function unitLoader({params, request}){
  
  return {username:"Gary"}
}

export default function Units() {


  const globalStore = useGlobalContext();
  console.log(globalStore);
  const local = useLocalStorage("user");
  //const loader = useLoaderData();
  //console.log(loader);

  return (
    <div>
      <div>
        <h2>Units</h2>
      <ul>
        {/*loader.map((unit, index) => (
          <li key={"unit_"+index}>{unit.character_name}</li>
        ))*/}
 
      </ul>  
      </div>
    </div>
  )
}
