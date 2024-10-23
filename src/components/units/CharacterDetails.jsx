import React from 'react'
import { useNavigate } from "react-router";

export default function CharacterDetails({character}) {
  
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };
  return (
    <div>
      <div className="d-flex justify-content mb-2">
        <h2>Character Details</h2>
      </div>
      <p>
        Details for {character.character_name} to come
      </p>
      <button type="button" onClick={goBack} className="btn btn-primary">Back</button>
    </div>
  )
}
