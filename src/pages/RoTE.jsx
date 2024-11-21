import React, { useEffect, useState } from 'react'
import Operations from '../components/rote/Operations'
import { useSearchParams } from 'react-router-dom';
import { apiRequest } from '../helpers/ApiRequest';
import AllyOperations from '../components/rote/AllyOperations';
import { useAuth } from '../store/useAuth';

export default function RoTE() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rotePath, setRotePath] = useState(searchParams.get('rote_path') || "light");
  const [rotePlanets, setRotePlanets] = useState([]);
  const [rotePlanet, setRotePlanet] = useState(searchParams.get('rote_planet') || "1");
  const [roteOperations, setRoteOperations] = useState([]);
  const [roteAllies, setRoteAllies] = useState([]);
  const [roteSwaps, setRoteSwaps] = useState([]);
  const [canWork, setCanWork] = useState([]);
  const [roteView, setRoteView] = useState(searchParams.get('rote_view') ||"planet");

  const {username, admin} = useAuth();

  const updatedSearchParams = new URLSearchParams(searchParams);

  useEffect(() => {
    
    const checkPlanets = async () => {
      
      if(rotePlanets.length === 0){
        const planets = await apiRequest('rote/planets', false, 'GET');
        setRotePlanets(planets);

        if(searchParams.get('rote_path') && searchParams.get('rote_planet')){
          getOperations();
        }
      }
      
    };

    //check if we have the planets list
    checkPlanets();
  }, []);
  
  const handleRotePathChange = (event) => {
    updatedSearchParams.set("rote_path", event.target.value);
    setSearchParams(updatedSearchParams);
    setRotePath(event.target.value);
  }

  const handleRotePlanetChange = (event) => {
    updatedSearchParams.set("rote_planet", event.target.value);
    setSearchParams(updatedSearchParams);
    setRotePlanet(event.target.value);
  }

  const operationsReceived = (result) => {
    setRoteOperations(result.operations);
    setRoteAllies(result.ally);
    createSwaps(result.swaps);
    createCanWork(result.canWork);
  }

  const getOperations = async () => {
    updatedSearchParams.set("rote_path", rotePath);
    updatedSearchParams.set("rote_planet", rotePlanet);
    setSearchParams(updatedSearchParams);
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

  const createCanWork = (swaps) => {
    let canWorkUnits = {};
    for(let s = 0; s < swaps.length; s++){
      (canWorkUnits[swaps[s].base_id] ??= []).push(swaps[s]);
    }
    setCanWork(canWorkUnits);
  }

  const allocateOperations  = async () => {
    const result = await apiRequest('rote/operations/auto/'+rotePath+'/'+rotePlanet, false, 'POST');
    operationsReceived(result);
  }

  const swapOperations  = async (path, phase, operation, unit_index, ally_code) => {
    const result = await apiRequest('rote/operations/swap/'+path+'/'+phase+'/'+operation+'/'+unit_index+'/'+ally_code, false, 'POST');
    operationsReceived(result);
  }

  const WorkOperations  = async (path, phase, operation, unit_index, ally_code) => {
    const result = await apiRequest('rote/operations/working/'+path+'/'+phase+'/'+operation+'/'+unit_index+'/'+ally_code, false, 'POST');
    operationsReceived(result);
  }

  const roteViewChanged = (event) => {
    updatedSearchParams.set("rote_view", event.target.value);
    setSearchParams(updatedSearchParams);
    setRoteView(event.target.value);
  }


  if(rotePlanets.length === 0){
    return <></>
  }
  return (
    <div>
      <div className="d-flex justify-content mb-2">
        <h2>RotE</h2>
        <div style={{maxWidth:"250px"}} className='px-2'>
          <select className="form-select" aria-label="Rote Path" name="Rote Path" onChange={handleRotePathChange} defaultValue={rotePath}>
            <option value="light">Light</option>
            <option value="neutral">Neutral</option>
            <option value="dark">Dark</option>
            </select>
        </div>
        <div style={{maxWidth:"250px"}} className='px-2'>
          <select className="form-select" aria-label="Rote Planet" name="Rote Planet" onChange={handleRotePlanetChange} defaultValue={rotePlanet}>
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
            <div className="form-check">
              <input className="form-check-input" type="radio" name="roteView" id="roteViewPlanet" value="planet" checked={roteView === "planet"} onChange={roteViewChanged}/>
              <label className="form-check-label" htmlFor="roteViewPlanet">Planet</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="roteView" id="roteViewAllies" value="allies" checked={roteView === "allies"} onChange={roteViewChanged}/>
              <label className="form-check-label" htmlFor="roteViewAllies">Allies</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="roteView" id="roteViewMe" value="me" checked={roteView === "me"} onChange={roteViewChanged}/>
              <label className="form-check-label" htmlFor="roteViewMe">Me</label>
            </div>
          </div>
        }
        {roteOperations.length > 0 && admin === 1 &&
          <div style={{maxWidth:"250px"}} className='px-2'>
            <button className='btn btn-primary' onClick={allocateOperations}>Auto Allocate</button>
          </div>
        }
      </div>
      
      {roteView === "planet"  &&
        roteOperations.map((operation, itemIndex) => (
          operation.length > 0 ?
            
            <Operations
              key={"rote_planet_"+rotePath+"_"+rotePlanet+"_"+itemIndex}
              operation={operation}
              swaps={roteSwaps}
              canWork={canWork}
              swapOperations={swapOperations}
              WorkOperations={WorkOperations}
              header={`${operation[0].path}, ${operation[0].phase} - ${operation[0].planet}, Operation ${operation[0].operation}`}/>
            :
            <div>Operation {itemIndex+1} not found</div>
          
          ))
      }
      {roteView !== "planet" &&
        <AllyOperations allies={roteAllies} username={roteView === "me" ? username : ""} />
      }
    </div>
  )
}
