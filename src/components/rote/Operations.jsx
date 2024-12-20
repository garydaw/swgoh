import React from 'react'
import Operation from './Operation'

export default function Operations({operation, swaps, swapOperations, canWork, WorkOperations, header}) {

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const operationChunks = chunkArray(operation, 5);

  return (
    <div>
      <div className="card mb-3">
        <div className="card-header text-center text-capitalize ">
          {header}
        </div>
        <div className="card-body">
          {operationChunks.map((chunk, rowIndex) => (
            <div className="row mb-3" key={"row_" + rowIndex}>
              {chunk.map((allocation, itemIndex) => (
                <Operation
                  key={"rote_" + allocation.path + "_" + allocation.phase + "_allocation_" + itemIndex}
                  allocation={allocation}
                  swaps={swaps}
                  swapOperations={swapOperations}
                  canWork={canWork}
                  WorkOperations={WorkOperations}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
