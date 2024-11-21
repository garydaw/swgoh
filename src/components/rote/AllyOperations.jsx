import React from 'react'
import Operations from './Operations';

export default function AllyOperations({allies, username}) {
  let allyOps = [];

  for (let a = 0; a < allies.length; a++) {
    const allyCode = allies[a].ally_code;
    if(username === allyCode || username === ""){
      const allyName = allies[a].ally_name;
      const existingAlly = allyOps.find(op => op.ally_code === allyCode);
      let thisOp = { ...allies[a] };
      thisOp.ally_name = "Operation " +allies[a].operation;
      
      if (!existingAlly) {
        allyOps.push({
          ally_code: allyCode,
          ally_name: allyName,
          ops: [thisOp],
        });
      } else {
        existingAlly.ops.push(thisOp);
      }
    }
  }

  return (
    <div>
      {allyOps.map((operation, itemIndex) => (
          <Operations
            key={"rote_allies_"+itemIndex}
            operation={operation.ops}
            swaps={[]}
            canWork={[]}
            swapOperations={[]}
            WorkOperations={[]}
            header={operation.ally_name}/>
          
          
        
        ))}
      </div>
  )
}
