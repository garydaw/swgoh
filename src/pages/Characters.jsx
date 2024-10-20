import React, {useState} from 'react'
import { useLoaderData } from 'react-router'
import { apiRequest } from '../helpers/ApiRequest';
import CharacterBasic from '../components/units/CharacterBasic';
import { unitSearch } from '../helpers/UnitSearch';

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCharacters, setFilteredCharacters] = useState(loader);
  
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    setFilteredCharacters(unitSearch(loader, value));
  };

  return (
    <div>
      <div className="d-flex justify-content mb-2">
        <h2>Characters</h2>
        <input
          type="text"
          style={{maxWidth:"250px"}}
          className="form-control ms-2 me-3"
          placeholder="Filter by name, role, faction, etc"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className='container'>
        <div className="row">
          {filteredCharacters.map((character, itemIndex) => (
            <CharacterBasic key={"character_"+itemIndex} character={character}/>
          ))}
        </div>
      </div>  
    </div>
  )
}
