import React from 'react'

export default function Relics() {
  return (
    <div>
      <div className="d-flex justify-content mb-2">
        <h2>Relics</h2>
      </div>
      <table className="table table-striped">
        <thead>
            <tr>
                <th className="w-15">Relic Material</th>
                <th className="w-25">Location</th>
                <th className="w-30">Gear</th>
                <th className="w-30">Tip</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Carbonite Circuit Board (35)</td>
                <td>Light Side Battle Normal 1-D</td>
                <td>
                    <ul className="list-unstyled">
                        <li>MK1 BAW Armor Mod (3)</li>
                        <li>MK1 Fabritech Data Pad (3)</li>
                        <li>MK1 CEC Fusion Furnace (3)</li>
                        <li>MK1 Loronar Power Cell (3)</li>
                    </ul>
                </td>
                <td>Just Farm away</td>
            </tr>
            <tr>
                <td>Bronzium Wiring (45)</td>
                <td>Light Side Battle Normal 7-B</td>
                <td>
                  <ul className="list-unstyled">
                    <li>Mk5 Fabritech Data Pad (10)</li>
                    <li>MK5 Sorosuub Keypad Salvage (2)</li>
                  </ul>
                </td>
                <td>Bonus of Kyrotechs from this level</td>
            </tr>
            <tr>
                <td>Cromium Transistor</td>
                <td>Shipments &rarr; Guild Activiy &rarr; 150 Guild tokens for 10</td>
                <td>MK 7 BlasTech Weapon Mod</td>
                <td>10 is worth about 33 Transistors!</td>
            </tr>
            <tr>
                <td>Aurodium Heatsink</td>
                <td>Shipments &rarr; Guild Activiy &rarr; 1,625 MK1 Raid tokens for 125</td>
                <td>MK 3 Sienar Holo Projector Salvage</td>
                <td>In Scavenger, click into Mk 2 Sienar Holo Project, then craft your 125 salavage into 6 full. Worth 25 Heatsinks!</td>
            </tr>
            <tr>
                <td>Electrium Conductor</td>
                <td>Shipments&rarr; Guild Activiy 2 or 3 for 200 or 300 Mk III Raid Tokens</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Zinbiddle Card</td>
                <td>Shipments&rarr; Guild Activiy 2 or 3 for 250 or 375 Mk III Raid Tokens</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Impulse Detector</td>
                <td>Shipments&rarr; Guild Activiy 2 or 3 for 530 or 795 Mk III Raid Tokens</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Aeromagnifier</td>
                <td>Shipments&rarr; Guild Activiy 2 or 3 for 400 or 600 Mk III Raid Tokens</td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>
    </div>
  )
}
