import React, {useState, useEffect} from 'react'
import { useLoaderData, useNavigate } from 'react-router'
import { apiRequest } from '../helpers/ApiRequest';
import CharacterBasic from '../components/units/CharacterBasic';
import { unitSearch } from '../helpers/UnitSearch';
import CharacterDetails from '../components/units/CharacterDetails';

export function characterLoader({params, request}){
  
  const url = new URL(request.url);
  const ally_code = url.searchParams.get('ally_code') || "";
  const base_id = url.searchParams.get('base_id') || "";
  let queryArray = [];
  
  // Add ally_code if not empty
  if (ally_code !== "") {
    queryArray.push("ally_code=" + ally_code);
  }
  
  // Add base_id if not empty
  if (base_id !== "") {
    queryArray.push("base_id=" + base_id);
  }
  
  // Join parameters with '&' and prepend with '?'
  const queryString = queryArray.length > 0 ? "?" + queryArray.join("&") : "";
  
  return apiRequest("characters" + queryString, true, "GET");
  
  
}

export default function Characters() {
  const loader = useLoaderData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCharacters, setFilteredCharacters] = useState(loader);
  const navigate = useNavigate();

  const currentQueryParams = new URLSearchParams(location.search);

  const char_details = currentQueryParams.has("base_id")

  useEffect(() => {
    setFilteredCharacters(loader);
    setSearchTerm("");
  }, [loader])
  
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    setFilteredCharacters(unitSearch(loader, value));
  };

  const handleCharacterBasicClick = (base_id) => {
    const currentQueryParams = new URLSearchParams(location.search);

    // Set or update the base_id query param
    currentQueryParams.set('base_id', base_id);

    // Navigate to the new route with updated query params
    navigate(`/characters?${currentQueryParams.toString()}`);
  };

  if(char_details){
    return <CharacterDetails character={filteredCharacters[0]} />
  } else {
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
              <CharacterBasic key={"character_"+itemIndex} character={character} onClick={handleCharacterBasicClick}/>
            ))}
          </div>
        </div>  
      </div>
    )
  }
}