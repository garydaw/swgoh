import React from 'react'
import UnitBasic from '../units/UnitBasic';

export default function Team({team, team_type}) {

  const numFormatter = new Intl.NumberFormat('en-US');

  let units = [];
  for(var u = 1; u < 6; u++){
    
    if(team["character_name_" + u] !== null){
      let unit = {}
      unit.character_name = team["character_name_" + u];
      unit.alignment = team["alignment_" + u];
      unit.gear_level = team["gear_level_" + u];
      unit.gear_level_plus = team["gear_level_plus_" + u];
      unit.level = team["level_" + u];
      unit.power = team["power_" + u];
      unit.zeta_abilities = team["zeta_abilities_" + u];
      unit.omicron_abilities = team["omicron_abilities_" + u];
      unit.relic_tier = team["relic_tier_" + u];
      unit.unit_image = team["unit_image_" + u];
      unit.rarity = team["rarity_" + u];
      unit.alignment_label = team["alignment_label_" + u];
      units.push(unit);
    }
    
  }

  return (
    <div className="mb-3">
      <div className="card">
        <div className="card-header">{team.team_name} ({numFormatter.format(team.team_power)})</div>
        <div className="card-body">
          <div className="row">
          {units.map((unit, index) => {
             return (
              <UnitBasic key={"team_" + team_type + "_" + index} unit={unit}></UnitBasic>
             );
           })}
           </div>
        </div>
      </div>
    </div>
  )
}
