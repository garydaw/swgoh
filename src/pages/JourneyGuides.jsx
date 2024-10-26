import React, {useState} from 'react'
import { apiRequest } from '../helpers/ApiRequest';
import { useLoaderData } from 'react-router';
import SearchableList from '../components/general/SearchableList';
import {  useSearchParams } from 'react-router-dom';

export function journeyLoader({params, request}){
  
  return apiRequest("journey/", true, "GET");
  
}

export default function JourneyGuides() {
  const [characterName, setCharacterName] = useState("Search for a guide");
  const [searchParams, setSearchParams] = useSearchParams();
  const [baseID, setBaseID] = useState(searchParams.get('journey_guide') || "");
  const loader = useLoaderData();

  const searchGuideHandleItemClick = (item) => {

    setBaseID(item["base_id"]);
    setCharacterName(item["character_name"]);

    // Update the URL query parameter
    setSearchParams({ journey_guide: item["base_id"] });
  };

  let guide;
  if(baseID !== ""){
    const foundGuide = loader.find(obj => obj.base_id === baseID);
    guide = foundGuide.guide;
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
              placeholder={characterName}
              clickHandler={searchGuideHandleItemClick}/>
        </div>
      </div>
      <div dangerouslySetInnerHTML={{__html: guide}}></div>
    </div>
  )
}
