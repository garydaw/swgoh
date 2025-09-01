import React from 'react'
import { useLoaderData } from 'react-router'
import { apiRequest } from '../helpers/ApiRequest';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';


export function modsLoader({params, request}){
  
  const url = new URL(request.url);
  
  const ally_code = url.searchParams.get('ally_code') || "";
  let queryArray = [];
  
  // Add ally_code if not empty
  if (ally_code !== "") {
    queryArray.push("ally_code=" + ally_code);
  }
  
  // Join parameters with '&' and prepend with '?'
  const queryString = queryArray.length > 0 ? "?" + queryArray.join("&") : "";
  
  return apiRequest("mods/" + queryString, true, "GET");
  
}

export default function Mods() {
  const loader = useLoaderData();

  const transformed = Object.values(
    loader.reduce((acc, { rarity, speed, count }) => {
        if (!acc[speed]) {
        acc[speed] = { speed }; // start new row
        }
        acc[speed][rarity] = count; // set rarity column
        return acc;
    }, {})
    );
    
  return (
    <ResponsiveContainer width="100%" height="80%">
  <BarChart
    data={transformed}
    margin={{
      top: 20,
      right: 30,
      left: 20,
      bottom: 40, // increase bottom margin
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    
    <XAxis dataKey="speed">
      <Label value="Speed" offset={-5} position="insideBottom" />
    </XAxis>
    
    <YAxis>
      <Label 
        value="Mod Count" 
        angle={-90} 
        position="insideLeft" 
        style={{ textAnchor: "middle" }} 
      />
    </YAxis>
    <Tooltip labelFormatter={(value) => `Speed ${value}`} />
    <Legend verticalAlign="top" height={36}/>
    
    <Bar name="5 Dot" dataKey="5" stackId="a" fill="#8884d8" />
    <Bar name="6 Dot" dataKey="6" stackId="a" fill="#82ca9d" />
  </BarChart>
</ResponsiveContainer>

  );
};
