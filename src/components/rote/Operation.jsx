import React, { useState } from 'react'
import CharacterImage from '../units/CharacterImage';
import { useAuth } from '../../store/useAuth';

export default function Operation({allocation, swaps, swapOperations, canWork, WorkOperations}) {
  const [selectedSwapAlly, setSelectedSwapAlly] = useState("");
  const [selectedWorkAlly, setSelectedWorkAlly] = useState("");
  const [editing, setEditing] = useState(false);

  const {admin} = useAuth();
  
  const background = allocation.allocation_type === "Allocated" ? "rgba(0,255,0,0.25)"
                       : allocation.allocation_type === "Working" ? "rgba(255,255,0,0.25)" 
                       : "rgba(255,0,0,0.25)";

  const working_append = allocation.allocation_type === "Working" ? allocation.working_level : "";

  const swapAllyChanged = (event) => {
    setSelectedSwapAlly(event.target.value);
  }
  const swapRote = async() => {
    await swapOperations(allocation.path, allocation.phase, allocation.operation, allocation.unit_index, selectedSwapAlly);
    setEditing(false);
  }
  const canWorkAllyChanged = (event) => {
    setSelectedWorkAlly(event.target.value);
  }
  const canWorkRote = async() => {
    await WorkOperations(allocation.path, allocation.phase, allocation.operation, allocation.unit_index, selectedWorkAlly);
    setEditing(false);
  }
  const setEdit = () => {
    setEditing(true);
  }

  return (
    <div className="col" style={{maxWidth: "20%", minWidth: "200px"}}>
      <div className="card mb-3 h-100">
        <div className="card-header text-center">{allocation.character_name}</div>
        <div className="card-body" style={{backgroundColor: background}}>
          {!editing &&
          <div>
            <CharacterImage character={allocation}/>
            {allocation.ally_name !== null ? <b>{allocation.ally_name} {working_append}</b>
              : 
              admin === 1 && <button className="btn btn-primary" onClick={setEdit}>Edit</button>
            }
          </div>
          }
          {admin === 1 && editing && allocation.ally_name === null && swaps.hasOwnProperty(allocation.base_id) &&
            <div>
              <select className="form-select mb-2" aria-label="Operation swap" onChange={swapAllyChanged} name="Operation Swap">
                <option value="">Select</option>
                {swaps[allocation.base_id].map((swap, itemIndex) => (
                  <option key={"rote_planet"+itemIndex} value={swap.ally_code}>{swap.ally_name}</option>
                ))}
              </select>
              <button className="btn btn-primary mb-2" onClick={swapRote} disabled={selectedSwapAlly === ""}>Swap</button>
            </div>
          }
          {admin === 1 && editing && allocation.ally_name === null && canWork.hasOwnProperty(allocation.base_id) &&
            <div>
              <select className="form-select mb-2" aria-label="Working On" onChange={canWorkAllyChanged} name="Working On">
                <option value="">Select</option>
                {canWork[allocation.base_id].map((work, itemIndex) => (
                  <option key={"rote_planet"+itemIndex} value={work.ally_code}>{work.ally_name}</option>
                ))}
              </select>
              <button className="btn btn-primary mb-2" onClick={canWorkRote} disabled={selectedWorkAlly === ""}>Working</button>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
