import React, { useContext, useEffect, useState } from 'react'
import { apiRequest } from '../helpers/ApiRequest';

export default function SwgohAdmin() {
  const [jsonText, setJsonText] = useState('');
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    setMessage('');
    try {
      const parsedArray = JSON.parse(jsonText);
      
      await apiRequest('swgoh/units', true, 'POST', { units: parsedArray });
      setMessage('Units uploaded successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="unit-uploader">
      <p>https://swgoh.gg/api/units/</p>
      <h2>Paste Unit JSON</h2>
      <textarea
        rows="20"
        cols="80"
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