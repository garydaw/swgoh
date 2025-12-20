import React from 'react'

export default function BasicOperations({roteBasic}) {

  return (
    <div>
      <table className="table-auto w-full border-collapse border border-gray-300 bg-gray-300">
        <thead>
          <tr style={{ backgroundColor: "rgba(200, 200, 200, 0.5)" }}>
            <th className="border border-gray-300 px-4 py-2">Character</th>
            <th className="border border-gray-300 px-4 py-2">Relic</th>
            <th className="border border-gray-300 px-4 py-2">Required</th>
            <th className="border border-gray-300 px-4 py-2">Actual</th>
          </tr>
        </thead>
        <tbody>
          {roteBasic.map((basicOp, index) => {
             const background = basicOp.required < basicOp.actual ? "rgba(0,255,0,0.25)"
                       : basicOp.required ===  basicOp.actual ? "rgba(255,255,0,0.25)" 
                       : "rgba(255,0,0,0.25)";
            return (
            <tr key={`rote_basic_${index}`} style={{ backgroundColor: background }}>
              <td className="border border-gray-300 px-4 py-2">{basicOp.character_name}</td>
              <td className="border border-gray-300 px-4 py-2">{basicOp.relic_level}</td>
              <td className="border border-gray-300 px-4 py-2">{basicOp.required}</td>
              <td className="border border-gray-300 px-4 py-2">{basicOp.actual}</td>
            </tr>)
          })}
        </tbody>
      </table>
    </div>
  )
}