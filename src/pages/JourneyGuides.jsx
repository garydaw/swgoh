import React, {useState} from 'react'
import { apiRequest } from '../helpers/ApiRequest';
import { useLoaderData } from 'react-router';
import SearchableList from '../components/general/SearchableList';
import {  useSearchParams } from 'react-router-dom';
import CharacterImage from '../components/units/CharacterImage';

export function journeyLoader({params, request}){
  
  return apiRequest("journey/", true, "GET");
  
}

export default function JourneyGuides() {
  const [character, setcharacter] = useState({character_name:"Search for a guide", unit_image:""});
  const [searchParams, setSearchParams] = useSearchParams();
  const loader = useLoaderData();

  const searchGuideHandleItemClick = (item) => {

    setcharacter(loader.find(obj => obj.base_id === item["base_id"]));

    // Update the URL query parameter
    setSearchParams({ journey_guide: item["base_id"] });
  };

  
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
      {character.unit_image !== "" && <CharacterImage character={character} centreImage="false"/>}
      <div dangerouslySetInnerHTML={{__html: character.guide}}></div>
    </div>
  )
}
