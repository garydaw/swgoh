import React, { useContext, useEffect, useState } from 'react'
import Team from '../components/teams/Team';
import { GlobalContext } from '../store/GlobalStore';
import { unitSearch } from '../helpers/UnitSearch';
import UnitBasic from '../components/units/UnitBasic';
import { apiRequest } from '../helpers/ApiRequest';

export default function TeamAdmin() {
  const data = useContext(GlobalContext);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [teamType, setTeamType] = useState("")
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUnits, setFilteredUnits] = useState(data.units);
  const [teamPost, setTeamPost] = useState([]);
  const [teamMaxSize, setTeamMaxSize] = useState(0);
  const [team, setTeam] = useState({
                                  character_name_1: null,
                                  character_name_2: null,
                                  character_name_3: null,
                                  character_name_4: null,
                                  character_name_5: null,
                                  team_name: "",
                                  team_power: 0
                                })

  useEffect(() => {
    setFilteredUnits(data.units);
    setSearchTerm("");
  }, [data.units]);

  const teamTypeChanged = (e) => {
    setTeamType(e.target.value);
    setTeamMaxSize(e.target.value.includes("Three") ? 3 : 5)
  }


  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    setFilteredUnits(unitSearch(data.units, value));
  };


  const handleUnitBasicClick = (base_id) => {
    
    if(teamPost.length === teamMaxSize){
      setToastMessage("Max Team Size reached.");
      setShowToast(true);
    } else if(teamPost.includes(base_id)){
      setToastMessage("Unit already in team.");
      setShowToast(true);
    } else {

      const unit = data.units.find(unit => unit.base_id === base_id);
      const newSize = teamPost.length + 1
      const teamName = newSize === 1 ? unit.character_name + " Team" : team.team_name;
      setTeam(team => ({
        ...team, 
        team_name:teamName,
        [`base_id_${newSize}`] : unit.base_id,
        [`character_name_${newSize}`] : unit.character_name,
        [`alignment_${newSize}`] : unit.alignment,
        [`gear_level_${newSize}`] : unit.gear_level,
        [`gear_level_plus_${newSize}`] : unit.gear_level_plus,
        [`level_${newSize}`] : unit.level,
        [`power_${newSize}`] : unit.power,
        [`zeta_abilities_${newSize}`] : unit.zeta_abilities,
        [`omicron_abilities_${newSize}`] : unit.omicron_abilities,
        [`relic_tier_${newSize}`] : unit.relic_tier,
        [`unit_image_${newSize}`] : unit.unit_image,
        [`rarity_${newSize}`] : unit.rarity,
        [`alignment_label_${newSize}`] : unit.alignment_label,

      }));

      const newPost = [base_id, ...teamPost]
      setTeamPost(newPost);
    }
  };

  const saveCallback = async (units, teamType, offence, defence) => {

    const api = teamType === "twFive" ? 'tw' : 'gac';
    await apiRequest(api, true, 'POST', { teamType, teamPost, offence, defence});
    setToastMessage("Team added.");
    setShowToast(true);
    setSearchTerm("");
    setTeamPost([]);
    setTeam({
              character_name_1: null,
              character_name_2: null,
              character_name_3: null,
              character_name_4: null,
              character_name_5: null,
              team_name: "",
              team_power: 0
            });
  }
  return (
    <div>
      <div className="d-flex justify-content mb-2">
        <h2>Team Admin</h2>
        <div style={{maxWidth:"250px"}} className="ms-2">
          <div className="form-check">
            <input className="form-check-input" type="radio" name="teamTypeRadio" id="teamTypeRadioGACThree" value="gacThree" checked={teamType === "gacThree"} onChange={teamTypeChanged}/>
            <label className="form-check-label" htmlFor="teamTypeRadioGACThree">GAC 3v3</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="teamTypeRadio" id="teamTypeRadioGACFive" value="gacFive" checked={teamType === "gacFive"} onChange={teamTypeChanged}/>
            <label className="form-check-label" htmlFor="teamTypeRadioGACFive">GAC 5v5</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="teamTypeRadio" id="teamTypeRadioTWFive" value="twFive" checked={teamType === "twFive"} onChange={teamTypeChanged}/>
            <label className="form-check-label" htmlFor="teamTypeRadioTWFive">TW</label>
          </div>
        </div>
      </div>

      <div
        className={`toast position-fixed top-0 start-50 translate-middle-x p-2 ${showToast ? 'show' : ''}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ minWidth: '200px', zIndex: '9999' }}
      >
        <div className="toast-header">
          <strong className="me-auto">Notification</strong>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowToast(false)}
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body">
          {toastMessage}
        </div>
      </div>

      {teamType !== "" &&
        <div>
          <Team team={team} teamType={teamType} editable="true" saveCallback={saveCallback}/>
          
          <input
              type="text"
              style={{maxWidth:"250px"}}
              className="form-control mb-2"
              placeholder="Filter by name, role, faction, etc"
              value={searchTerm}
              onChange={handleSearch}
            />
          <div className='container'>
            <div className="row">
              {filteredUnits.map((unit, itemIndex) => (
                <UnitBasic key={"unit_"+itemIndex} unit={unit} onClick={handleUnitBasicClick}/>
              ))}
            </div>
          </div>  
        </div>
      }
    </div>
  )
}
