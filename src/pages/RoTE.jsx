import React, { useEffect, useState } from 'react'
import Operations from '../components/rote/Operations'
import { useSearchParams } from 'react-router-dom';
import { apiRequest } from '../helpers/ApiRequest';

export default function RoTE() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rotePath, setRotePath] = useState(searchParams.get('rote_path') || "light");
  const [rotePlanets, setRotePlanets] = useState([]);
  const [rotePlanet, setRotePlanet] = useState(searchParams.get('rote_planet') || "1");
  const [roteOperations, setRoteOperations] = useState([]);
  const [roteSwaps, setRoteSwaps] = useState([]);

  useEffect(() => {
    // Send a request to the backend to check if the user is logged in
    
    const checkPlanets = async () => {
      
      if(rotePlanets.length === 0){
        const planets = await apiRequest('rote/planets', false, 'GET');
        setRotePlanets(planets)
      }
      
    };

    //check if use is still logged in
    checkPlanets();
  }, []);
  
  const handleRotePathChange = (event) => {
    setRotePath(event.target.value);
  }

  const handleRotePlanetChange = (event) => {
    setRotePlanet(event.target.value);
  }

  const operationsReceived = (result) => {
    setRoteOperations(result.operations);
    createSwaps(result.swaps);
  }

  const getOperations = async () => {
    const result = await apiRequest('rote/operations/'+rotePath+'/'+rotePlanet, false, 'GET');
    operationsReceived(result);
    
  }

  const createSwaps = (swaps) => {
    let operationSwaps = {};
    for(let s = 0; s < swaps.length; s++){
      (operationSwaps[swaps[s].base_id] ??= []).push(swaps[s]);
    }
    setRoteSwaps(operationSwaps);
  }

  const allocateOperations  = async () => {
    const result = await apiRequest('rote/operations/auto/'+rotePath+'/'+rotePlanet, false, 'POST');
    operationsReceived(result);
  }

  const swapOperations  = async (path, phase, operation, unit_index, ally_code) => {
    console.log("swap "+unit_index);
    console.log("swap "+ally_code);
    //const result = await apiRequest('rote/operations/swap'+rotePath+'/'+rotePlanet, false, 'GET');
    //operationsReceived(result);
  }


  if(rotePlanets.length === 0){
    return <></>
  }
  return (
    <div>
      <div className="d-flex justify-content mb-2">
        <h2>RotE</h2>
        <div style={{maxWidth:"250px"}} className='px-2'>
          <select className="form-select" aria-label="Rote Path" onChange={handleRotePathChange} defaultValue={rotePath}>
            <option value="light">Light</option>
            <option value="neutral">Neutral</option>
            <option value="dark">Dark</option>
            </select>
        </div>
        <div style={{maxWidth:"250px"}} className='px-2'>
          <select className="form-select" aria-label="Rote Planet" onChange={handleRotePlanetChange} defaultValue={rotePlanet}>
            {rotePlanets[rotePath].map((planet, itemIndex) => (
              <option key={"rote_planet"+itemIndex} value={itemIndex+1}>{itemIndex+1}-{planet}</option>
            ))}
          </select>
        </div>
        <div style={{maxWidth:"250px"}} className='px-2'>
          <button className='btn btn-primary' onClick={getOperations}>View</button>
        </div>
        {roteOperations.length > 0 &&
          <div style={{maxWidth:"250px"}} className='px-2'>
            <button className='btn btn-primary' onClick={allocateOperations}>Auto Allocate</button>
          </div>
        }
      </div>
      
      {roteOperations.map((operation, itemIndex) => (
          <Operations
            key={"rote_"+rotePath+"_"+rotePlanet+"_"+itemIndex}
            operation={operation}
            swaps={roteSwaps}
            swapOperations={swapOperations}/>
        ))}
    </div>
  )
}
