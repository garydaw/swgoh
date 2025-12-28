import React, {useState, useContext, useEffect} from 'react'
import { apiRequest } from '../helpers/ApiRequest';
import { GlobalContext } from '../store/GlobalStore';
import SearchableList from '../components/general/SearchableList';
import {  useSearchParams } from 'react-router-dom';
import UnitBasic from '../components/units/UnitBasic';


export default function GuildUnits() {
  const [units, setUnits] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const data = useContext(GlobalContext);

  const searchGuildUnitHandleItemClick = async (item) => {

    // Update the URL query parameter
    setSearchParams({ guild_unit: item["base_id"] });
   
  };

  const guildUnit = searchParams.get('guild_unit');

  useEffect(() => {
    if (!guildUnit) return;

    const fetchGuildUnits = async () => {
      const guildUnits = await apiRequest(
        `characters/guild/${guildUnit}`,
        false,
        'GET'
      );
      setUnits(guildUnits);
    };

    fetchGuildUnits();
  }, [guildUnit]);


  
  let character = data.units.find(obj => obj.base_id === guildUnit) || {character_name:"Search for a Character", base_id:""};


  return (
    <div>
      <div className="d-flex justify-content mb-2">
        <h2>Guild Units</h2>
        <div style={{maxWidth:"250px"}}>
          <SearchableList
              items={data.units}
              item_id="base_id"
              item_name="character_name"
              placeholder={character.character_name}
              clickHandler={searchGuildUnitHandleItemClick}/>
        </div>
      </div>
      
      <div className='container'>
        <div className="row">
          {units.map((unit, itemIndex) => (
            <UnitBasic key={"unit_"+itemIndex} unit={unit}/>
          ))}
        </div>
      </div>  
      
    </div>
  )
}
