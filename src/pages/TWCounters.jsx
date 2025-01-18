import React, {useState} from 'react'
import { apiRequest } from '../helpers/ApiRequest';
import { useLoaderData, useRevalidator } from 'react-router';
import SearchableList from '../components/general/SearchableList';
import {  useSearchParams } from 'react-router-dom';
import CharacterImage from '../components/units/CharacterImage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth } from '../store/useAuth';

export function twcountersLoader({params, request}){
  
  return apiRequest("twcounters/", true, "GET");
  
}
export default function TWCounters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const loader = useLoaderData();
  const [adminMode, setAdminMode] = useState(false);
  const [adminCounter, setAdminCounter] = useState("");

  let revalidator = useRevalidator();

  const {admin} = useAuth();

  const editCounter = () => {
    setAdminCounter(character.counters);
    setAdminMode(true);
  }

  const searchCounterHandleItemClick = (item) => {

    // Update the URL query parameter
    setSearchParams({ tw_counter: item["base_id"] });
  };
  
  const getExport = async () => {
    const blob = await apiRequest('twcounters/export', true, 'GET', null, 'blob');
      // Create a link element to download the file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tw_counter.xlsx'; // Set file name
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    
  }

  
  let character = loader.find(obj => obj.base_id === searchParams.get('tw_counter')) || {character_name:"Search for a counter", base_id:""};


  const saveTWCounter = async() => {
    
    const result = await apiRequest('twcounters', true, 'POST', { base_id:character.base_id, counters:adminCounter })
      if(result.result){
        revalidator.revalidate();
      }

    setAdminMode(false);
}

  
  return (
    <div>
      <div className="d-flex justify-content mb-2">
        <h2>TW Counters</h2>
        <div style={{maxWidth:"250px"}}>
          <SearchableList
              items={loader}
              item_id="base_id"
              item_name="character_name"
              placeholder={character.character_name}
              clickHandler={searchCounterHandleItemClick}/>
        </div>
        <div style={{maxWidth:"250px"}} className='px-2'>
            <button className='btn btn-primary' onClick={getExport}>Export</button>
          </div>
      </div>
      {character.base_id !== "" && <CharacterImage character={character} centreImage="false"/>}
      {adminMode == false && <div dangerouslySetInnerHTML={{__html: character.counters}}></div>}
      {adminMode == true && <div className='mt-1'>
        <ReactQuill theme="snow" value={adminCounter} onChange={setAdminCounter}/>
        <button className="btn btn-primary mt-1" onClick={saveTWCounter}>Save</button>
      </div>}
      
      {admin === 1 && adminMode === false && character.base_id !== "" && <button className="btn btn-primary" onClick={editCounter}>Edit</button>}
    </div>
  )
}
