import React from 'react'
import Operation from './Operation'

export default function Operations({operation, swaps, swapOperations}) {

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
          {operation[0].path}, {operation[0].phase} - {operation[0].planet}, Operation {operation[0].operation}
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
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
