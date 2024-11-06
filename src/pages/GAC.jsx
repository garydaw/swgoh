import React, { useState } from 'react'
import { useLoaderData } from 'react-router';
import { apiRequest } from '../helpers/ApiRequest';
import Team from '../components/teams/Team';

export function gacLoader({params, request}){
  
  const url = new URL(request.url);
  const ally_code = url.searchParams.get('ally_code') || "";
  let queryArray = [];
  
  // Add ally_code if not empty
  if (ally_code !== "") {
    queryArray.push("ally_code=" + ally_code);
  }
  
  // Join parameters with '&' and prepend with '?'
  const queryString = queryArray.length > 0 ? "?" + queryArray.join("&") : "";
  
  return apiRequest("gac/" + queryString, true, "GET");
  
}

export default function GAC() {
  const [teamSize, setTeamSize] = useState("Three");
  const [offenceTeam, setOffenceTeam] = useState("offence");
  const loader = useLoaderData();

  const teamSelection = offenceTeam + teamSize;
  const teams = loader[teamSelection];
  
  const teamSizeChanged = (e) => {
    setTeamSize(e.target.value);
  }

  const offenceTeamChanged = (e) => {
    setOffenceTeam(e.target.value);
  }

  return (
    <div>
      <div className="d-flex justify-content mb-2">
        <h2>GAC</h2>
        <div style={{maxWidth:"250px"}} className="ms-2">
          <div className="form-check">
            <input className="form-check-input" type="radio" name="teamSizeRadio" id="teamSizeRadio3" value="Three" checked={teamSize === "Three"} onChange={teamSizeChanged}/>
            <label className="form-check-label" htmlFor="teamSizeRadio3">3v3</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="teamSizeRadio" id="teamSizeRadio5" value="Five" checked={teamSize === "Five"} onChange={teamSizeChanged}/>
            <label className="form-check-label" htmlFor="teamSizeRadio5">5v5</label>
          </div>
        </div>
        <div style={{maxWidth:"250px"}} className="ms-2">
          <div className="form-check">
            <input className="form-check-input" type="radio" name="offenceTeamRadio" id="offenceTeamRadioOffence" value="offence" checked={offenceTeam === "offence"} onChange={offenceTeamChanged}/>
            <label className="form-check-label" htmlFor="offenceTeamRadioOffence">Offence</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="offenceTeamRadio" id="offenceTeamRadioDefence" value="defence" checked={offenceTeam === "defence"} onChange={offenceTeamChanged}/>
            <label className="form-check-label" htmlFor="offenceTeamRadioDefence">Defence</label>
          </div>
        </div>
      </div>

      <div>
        {teams.map((team, itemIndex) => (
            <Team key={"gac_" + teamSelection + "_" + itemIndex} team={team} teamType={"gac"+teamSize}/>
          ))}
      </div>
    </div>
  )
}
