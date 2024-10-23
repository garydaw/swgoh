import React from 'react'
import CharacterImage from './CharacterImage';
import Stars from './Stars';

export default function CharacterBasic({character, onClick}) {
  
  return (
    <div className="col-xxl-3 col-md-4 col-sm-12" onClick={() => onClick(character.base_id)}>
      <div className="card mb-3">
        <div className="card-header text-center">{character.character_name}</div>
        <div className="card-body">
          <CharacterImage character={character}/>
          <div className="card-text d-flex justify-content-center pt-1">
            <div>
              <Stars rarity={character.rarity}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
