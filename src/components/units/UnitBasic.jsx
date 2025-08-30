import React from 'react'
import CharacterImage from './CharacterImage';
import Stars from './Stars';

export default function UnitBasic({unit, onClick}) {
  
  return (
    <div className="col-xxl-3 col-md-4 col-sm-12 mb-3">
      <div className="card h-100" style={{ cursor: 'pointer' }} onClick={() => onClick(unit.base_id)}>
        <div className="card-header text-center">{unit.character_name}</div>
        <div className="card-body">
          <CharacterImage character={unit}/>
          <div className="card-text d-flex justify-content-center pt-1">
            <div>
              <Stars rarity={unit.rarity}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
