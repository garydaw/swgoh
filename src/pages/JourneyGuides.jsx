import React, {useState} from 'react'
import { apiRequest } from '../helpers/ApiRequest';
import { useLoaderData, useRevalidator } from 'react-router';
import SearchableList from '../components/general/SearchableList';
import {  useSearchParams } from 'react-router-dom';
import CharacterImage from '../components/units/CharacterImage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth } from '../store/useAuth';

export function journeyLoader({params, request}){
  
  return apiRequest("journey/", true, "GET");
  
}

export default function JourneyGuides() {
  const [searchParams, setSearchParams] = useSearchParams();
  const loader = useLoaderData();
  const [adminMode, setAdminMode] = useState(false)
  const [adminGuide, setAdminGuide] = useState("");

  let revalidator = useRevalidator();

  const {admin} = useAuth();

  const editGuide = () => {
    setAdminGuide(character.guide);
    setAdminMode(true);
  }

  const searchGuideHandleItemClick = (item) => {

    // Update the URL query parameter
    setSearchParams({ journey_guide: item["base_id"] });
  };

  
  let character = loader.find(obj => obj.base_id === searchParams.get('journey_guide')) || {character_name:"Search for a guide", base_id:""};


  const saveJourneyGuide = async() => {
    
    const result = await apiRequest('journey', true, 'POST', { base_id:character.base_id, guide:adminGuide })
      if(result.result){
        revalidator.revalidate();
      }

    setAdminMode(false);
}

  
  return (
    <div>
      <div className="d-flex justify-content mb-2">
        <h2>Journey Guides</h2>
        <div style={{maxWidth:"250px"}}>
          <SearchableList
              items={loader}
              item_id="base_id"
              item_name="character_name"
              placeholder={character.character_name}
              clickHandler={searchGuideHandleItemClick}/>
        </div>
      </div>
      {character.base_id !== "" && <CharacterImage character={character} centreImage="false"/>}
      {adminMode == false && <div dangerouslySetInnerHTML={{__html: character.guide}}></div>}
      {adminMode == true && <div className='mt-1'>
        <ReactQuill theme="snow" value={adminGuide} onChange={setAdminGuide}/>
        <button className="btn btn-primary mt-1" onClick={saveJourneyGuide}>Save</button>
      </div>}
      
      {admin === 1 && adminMode === false && character.base_id !== "" && <button className="btn btn-primary" onClick={editGuide}>Edit</button>}
    </div>
  )
}
