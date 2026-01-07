import React, { useEffect, useState } from 'react'
import Operations from '../components/rote/Operations'
import { useSearchParams } from 'react-router-dom';
import { apiRequest } from '../helpers/ApiRequest';
import AllyOperations from '../components/rote/AllyOperations';
import BasicOperations from '../components/rote/BasicOperations';
import { useAuth } from '../store/useAuth';

export default function RoTE() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rotePath, setRotePath] = useState(searchParams.get('rote_path') || "light");
  const [rotePlanets, setRotePlanets] = useState([]);
  const [rotePlanet, setRotePlanet] = useState(searchParams.get('rote_planet') || "1");
  const [roteOperations, setRoteOperations] = useState([]);
  const [roteBasic, setRoteBasic] = useState([]);
  const [roteAllies, setRoteAllies] = useState([]);
  const [roteSwaps, setRoteSwaps] = useState([]);
  const [canWork, setCanWork] = useState([]);
  const [roteView, setRoteView] = useState(searchParams.get('rote_view') ||"planet");
  const [keyUnits, setKeyUnits] = useState([]);
  const [showModal, setshowModal] = useState(false);

  const {username, admin} = useAuth();

  const updatedSearchParams = new URLSearchParams(searchParams);

  useEffect(() => {
    
    const checkPlanets = async () => {
      
      if(rotePlanets.length === 0){
        const planets = await apiRequest('rote/planets', false, 'GET');
        setRotePlanets(planets);

        const keyUnits = await apiRequest('rote/keyunits', false, 'GET');
        setKeyUnits(keyUnits);

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
    setRoteBasic(result.basic);
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

  const getExport = async () => {
    const blob = await apiRequest('rote/export', true, 'GET', null, 'blob');
     // Create a link element to download the file
     const url = window.URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = 'rote.xlsx'; // Set file name
     document.body.appendChild(a);
     a.click();
     a.remove();
     window.URL.revokeObjectURL(url);
    
  }

  const showKeyUnit = async () => {
    setshowModal(true);
  }

  const groupedKeyUnits = keyUnits.reduce((acc, item) => {
    const groupKey = `${item.path}-${item.phase}`;

    if (!acc[groupKey]) {
      acc[groupKey] = {
        path: item.path,
        phase: item.phase,
        characters: {}
      };
    }

    if (!acc[groupKey].characters[item.character_name]) {
      acc[groupKey].characters[item.character_name] = {
        relic_level: item.relic_level,
        allies: []
      };
    }

    acc[groupKey].characters[item.character_name].allies.push(
      item.ally_name
    );

    return acc;
  }, {});


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

      <div id="roteModal" className="modal" style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-content">
          <span className="close" onClick={() => setshowModal(false)}>
            &times;
          </span>

          {Object.values(groupedKeyUnits).map(group => (
            <div key={`${group.path}-${group.phase}`}>
              <h3>
                {group.path.charAt(0).toUpperCase() + group.path.slice(1)} Phase {group.phase}
              </h3>

              <ul>
                {Object.entries(group.characters).map(
                  ([characterName, characterData]) => (
                    <li key={characterName}>
                      
                        {characterName} (Relic {characterData.relic_level})
                     
                      {" — "}
                      {characterData.allies.join(", ")}
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>


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
          <div style={{ maxWidth: "250px" }} className="px-2 d-flex flex-wrap">
            {[
              ["planet", "Planet"],
              ["basic", "Basic"],
              ["allies", "Allies"],
              ["me", "Me"]
            ].map(([value, label]) => (
              <div key={value} className="form-check w-50">
                <input
                  className="form-check-input"
                  type="radio"
                  name="roteView"
                  id={`roteView-${value}`}
                  value={value}
                  checked={roteView === value}
                  onChange={roteViewChanged}
                />
                <label className="form-check-label" htmlFor={`roteView-${value}`}>
                  {label}
                </label>
              </div>
            ))}
          </div>

        }
        {roteOperations.length > 0 && admin === 1 &&
          <div style={{maxWidth:"250px"}} className='px-2'>
            <button className='btn btn-primary' onClick={allocateOperations}>Auto Allocate</button>
          </div>
        }
        {roteOperations.length > 0 &&
          <div style={{maxWidth:"250px"}} className='px-2'>
            <button className='btn btn-primary' onClick={getExport}>Export</button>
          </div>
        }
        <div style={{maxWidth:"250px"}} className='px-2'>
          <button className='btn btn-primary' onClick={showKeyUnit}>Key Units</button>
        </div>
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
      {roteView == "basic"  &&
        <BasicOperations roteBasic={roteBasic} />
      }
      {(roteView == "allies" || roteView == "me") &&
        <AllyOperations allies={roteAllies} username={roteView === "me" ? username : ""} />
      }
    </div>
  )
}
