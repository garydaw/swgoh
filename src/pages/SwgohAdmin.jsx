import React, { useContext, useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { apiRequest } from '../helpers/ApiRequest';

export default function SwgohAdmin() {
  const [jsonText, setJsonText] = useState('');
  const [message, setMessage] = useState('');
  const [players, setPlayers] = React.useState([]);

  const importUnits = async () => {
    setMessage('Imports units...');
    try {
      const parsedArray = JSON.parse(jsonText);
      
      const result = await apiRequest('swgoh/units', true, 'POST', { units: parsedArray });
      setMessage(result.message);
      setJsonText("");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const importMembers = async () => {
    setMessage('Imports guild members...');
    try {
      
      const result = await apiRequest('swgoh/allies', true, 'POST', { data: jsonText });
      setPlayers(result);
      
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const getMembers = async () => {
    setMessage('getting guild members...');
    try {
      
      const result = await apiRequest('swgoh/allies', true, 'GET',);
      setPlayers(result);
      
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(); // e.g. "1/1/1900"
  };

  const importUser = async () => {
    setMessage('Setting user...');
    try {
      const parsedArray = JSON.parse(jsonText);
      
      const result = await apiRequest('swgoh/player', true, 'POST', { data: parsedArray });
      setJsonText("");
      setPlayers(result);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="unit-uploader">
      <p><Link to="https://swgoh.gg/api/units/" target="_blank" rel="noopener noreferrer" >Units</Link></p>
      <p><Link to="https://swgoh.gg/g/Ge0VaZyTRH-pUMiXAvppXg" target="_blank" rel="noopener noreferrer" >Guild</Link></p>
      <h2>Paste JSON</h2>
      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        placeholder="Paste JSON content here..."
      />
      <br />
      <button onClick={importUnits}>Import Units</button>
      <button onClick={importMembers}>Import Members</button>
      <button onClick={getMembers}>Get Members</button>
      <button onClick={importUser}>Import User</button>
      {message && <p>{message}</p>}

      <ul>
        {players.map((player, index) => (
          <li key={index} style={{ marginBottom: '8px' }}>
            <span style={{ marginRight: '10px', color: 'gray' }}>
              {player.ally_name}
            </span>
            <a href={player.url} target="_blank" rel="noopener noreferrer">
              {player.url}
            </a>
            <span style={{ marginLeft: '10px', color: 'gray' }}>
              ({formatDate(player.refreshed)})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}