import React, { useState } from 'react'
import CharacterImage from '../units/CharacterImage';

export default function Operation({allocation, swaps, swapOperations}) {
  const [selectedAlly, setSelectedAlly] = useState("")
  const background = allocation.ally_name === null ? "rgba(255,0,0,0.25)" : "rgba(0,255,0,0.25)";

  const allyChanged = (event) => {
    setSelectedAlly(event.target.value);
  }
  const swapRote = async() => {
    swapOperations(allocation.path, allocation.phase, allocation.operation, allocation.unit_index, selectedAlly);
  }

  return (
    <div className="col" style={{maxWidth: "20%", minWidth: "200px"}}>
      <div className="card mb-3 h-100">
        <div className="card-header text-center">{allocation.character_name}</div>
        <div className="card-body" style={{backgroundColor: background}}>
          <CharacterImage character={allocation}/>
          {allocation.ally_name !== null ? <b>{allocation.ally_name}</b> : "Not allocated"}
          {allocation.ally_name === null && swaps.hasOwnProperty(allocation.base_id) &&
            <div>
              <select className="form-select" aria-label="Operation swap" onChange={allyChanged} name="Operation Swap">
                  <option value="">Select</option>
                {swaps[allocation.base_id].map((swap, itemIndex) => (
                  <option key={"rote_planet"+itemIndex} value={swap.ally_code}>{swap.ally_name}</option>
                ))}
              </select>
              <button className="btn btn-primary mt-2" onClick={swapRote} disabled={selectedAlly === ""}>Swap</button>
            </div>
            }
        </div>
      </div>
    </div>
  )
}
