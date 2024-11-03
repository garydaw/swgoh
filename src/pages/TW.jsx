import React, { useState } from 'react'
import { useLoaderData } from 'react-router';
import { apiRequest } from '../helpers/ApiRequest';
import Team from '../components/teams/Team';

export function twLoader({params, request}){
  
  const url = new URL(request.url);
  const ally_code = url.searchParams.get('ally_code') || "";
  let queryArray = [];
  
  // Add ally_code if not empty
  if (ally_code !== "") {
    queryArray.push("ally_code=" + ally_code);
  }
  
  // Join parameters with '&' and prepend with '?'
  const queryString = queryArray.length > 0 ? "?" + queryArray.join("&") : "";
  
  return apiRequest("tw/" + queryString, true, "GET");
  
}

export default function TW() {
  const [viewTeam, setviewTeam] = useState("offence")
  const loader = useLoaderData();

  const teamSize = "Five";
  const teamSelection = viewTeam + teamSize;
  const teams = loader[teamSelection];
  
  const viewTeamChanged = (e) => {
    setviewTeam(e.target.value);
  }

  return (
    <div>
      <div className="d-flex justify-content mb-2">
        <h2>TW</h2>
        <div style={{maxWidth:"250px"}} className="ms-2">
          <div className="form-check">
            <input className="form-check-input" type="radio" name="viewTeamRadio" id="viewTeamRadioOffence" value="offence" checked={viewTeam === "offence"} onChange={viewTeamChanged}/>
            <label className="form-check-label" htmlFor="viewTeamRadioOffence">Offence</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="viewTeamRadio" id="viewTeamRadioDefence" value="defence" checked={viewTeam === "defence"} onChange={viewTeamChanged}/>
            <label className="form-check-label" htmlFor="viewTeamRadioDefence">Defence</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="viewTeamRadio" id="viewTeamRadioOverview" value="overview" checked={viewTeam === "overview"} onChange={viewTeamChanged}/>
            <label className="form-check-label" htmlFor="viewTeamRadioOverview">Overview</label>
          </div>
        </div>
      </div>

      <div>
        {teams.map((team, itemIndex) => (
            <Team key={"tw_" + teamSelection + "_" + itemIndex} team={team} teamType="tw"/>
          ))}
      </div>
    </div>
  )
}
