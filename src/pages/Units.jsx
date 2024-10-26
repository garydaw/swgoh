import React, {useState, useEffect} from 'react'
import { useLoaderData, useNavigate } from 'react-router'
import { apiRequest } from '../helpers/ApiRequest';
import UnitBasic from '../components/units/UnitBasic';
import { unitSearch } from '../helpers/UnitSearch';
import CharacterDetails from '../components/units/CharacterDetails';


export function unitLoader({params, request}){
  const url = new URL(request.url);
  const api = url.pathname.slice(1)
  
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
  
  return apiRequest(api + queryString, true, "GET");
  
}

export default function Units({combat_type}) {
  const loader = useLoaderData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUnits, setFilteredUnits] = useState(loader);
  const navigate = useNavigate();
  
  const currentQueryParams = new URLSearchParams(location.search);

  const show_details = currentQueryParams.has("base_id")

  useEffect(() => {
    setFilteredUnits(loader);
    setSearchTerm("");
  }, [loader])
  
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    setFilteredUnits(unitSearch(loader, value));
  };

  const handleUnitBasicClick = (base_id) => {
    const currentQueryParams = new URLSearchParams(location.search);

    // Set or update the base_id query param
    currentQueryParams.set('base_id', base_id);

    // Navigate to the new route with updated query params
    navigate(`/${combat_type}?${currentQueryParams.toString()}`);
  };

  if(show_details){
    return <CharacterDetails character={filteredUnits[0]} />
  } else {
    return (
      <div>
        <div className="d-flex justify-content mb-2">
          <h2 style={{textTransform: "capitalize"}}>{combat_type}</h2>
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
            {filteredUnits.map((unit, itemIndex) => (
              <UnitBasic key={"unit_"+itemIndex} unit={unit} onClick={handleUnitBasicClick}/>
            ))}
          </div>
        </div>  
      </div>
    )
  }
}