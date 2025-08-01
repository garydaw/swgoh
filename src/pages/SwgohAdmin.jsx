import React, { useContext, useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { apiRequest } from '../helpers/ApiRequest';

export default function SwgohAdmin() {
  const [jsonText, setJsonText] = useState('');
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    setMessage('');
    try {
      const parsedArray = JSON.parse(jsonText);
      
      const result = await apiRequest('swgoh/units', true, 'POST', { units: parsedArray });
      setMessage(result.message);
      setJsonText("");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="unit-uploader">
      <p><Link to="https://swgoh.gg/api/units/" target="_blank" rel="noopener noreferrer" >Units</Link></p>
      <h2>Paste JSON</h2>
      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        placeholder="Paste JSON content here..."
      />
      <br />
      <button onClick={handleUpload}>Upload Units</button>
      {message && <p>{message}</p>}
    </div>
  );
}