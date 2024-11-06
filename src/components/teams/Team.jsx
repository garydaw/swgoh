import React, { useState } from 'react'
import UnitBasic from '../units/UnitBasic';

export default function Team({team, teamType, editable="false", saveCallback}) {
  const [offence, setOffence] = useState(false);
  const [defence, setDefence] = useState(false)

  const numFormatter = new Intl.NumberFormat('en-US');

  const team_size = teamType.includes("Three") ? 3 : 5;
  
  let units = [];
  for(var u = 1; u <= team_size; u++){
    
    let unit = {}
    unit.base_id = team["base_id_" + u];
    unit.character_name = team["character_name_" + u];
    unit.alignment = team["alignment_" + u];
    unit.gear_level = team["gear_level_" + u];
    unit.gear_level_plus = team["gear_level_plus_" + u];
    unit.level = team["level_" + u];
    unit.power = team["power_" + u];
    unit.zeta_abilities = team["zeta_abilities_" + u];
    unit.omicron_abilities = team["omicron_abilities_" + u];
    unit.relic_tier = team["relic_tier_" + u];
    unit.unit_image = team["unit_image_" + u] || "blank.png";
    unit.rarity = team["rarity_" + u];
    unit.alignment_label = team["alignment_label_" + u];
    units.push(unit);
    
  }

  const saveTeam = () => {
    saveCallback(units, teamType, offence, defence);
    setOffence(false);
    setDefence(false);
  }

  const offenceChanged = (e) => {
    setOffence(!offence);
  }

  const defenceChanged = (e) => {
    setDefence(!defence);
  }

  return (
    <div className="mb-3">
      <div className="card">
        <div className="card-header">{team.team_name} {team.team_power !== 0 && "("+ numFormatter.format(team.team_power)+")"}</div>
        <div className="card-body">
          <div className="row">
          {units.map((unit, index) => {
             return (
              <UnitBasic key={"team_" + teamType + "_" + index} unit={unit}></UnitBasic>
             );
           })}
           {editable === "true" &&
            <div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="offence" id="teamAdminOffence" checked={offence} onChange={offenceChanged}/>
                <label className="form-check-label" htmlFor="teamAdminOffence">
                  Offence
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="defence" id="teamAdminDefence" checked={defence} onChange={defenceChanged}/>
                <label className="form-check-label" htmlFor="teamAdminDefence">
                  Defence
                </label>
              </div>
              <button className="btn btn-primary" onClick={saveTeam}>Save</button>
            </div>
            
            }
           </div>
        </div>
      </div>
    </div>
  )
}
