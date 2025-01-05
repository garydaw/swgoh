import runSQL from "./database.js";
import excel from "exceljs";
import players from "./players.js";

let rote = {};
let fills = {
              headers:["FF93C47D", "FFD9EAD3"],
              light:["FF6FA8DC", "FFCFE2F3"], 
              dark:["FFE06666", "FFF4CCCC"],
              neutral:["FFCCCCCC", "FFEFEFEF"]
            };

let row_count = 1;

rote.get = async () => {

    let operation = {}
    
    return operation;

}

rote.getExcel = async (ally_code) => {

  //get allies
  const allies = await players.getGuildMembers(ally_code);
  
  //add blank ally for missing operations
  allies.unshift({ally_code: -1, ally_name: 'Unallocated'});

  let workbook = new excel.Workbook();

  for(let i = 1; i < 7; i++){
    
    let worksheet = workbook.addWorksheet("RoTE - Phase " + i);
    row_count = 1;

    //Title
    worksheet.getCell('A' + row_count).value = 'ROTE OPERATION REQUIREMENTS PHASE ' + i;
    setCellStyle(worksheet.getCell('A' + row_count), 24, true, 'center', fills.headers[0]);
    
    
    //merge cells
    worksheet.mergeCells(row_count,1,row_count,5);

    row_count++;
 
    worksheet.getColumn(1).width = 40;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 50;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 40;

    for(let p = 0; p < allies.length; p++){
      worksheet.addRow(['','','','','']);
      worksheet.getRow(row_count).eachCell({ includeEmpty: true }, (cell, colNumber) => {
        if (colNumber >= 1 && colNumber <= 5) { 
          setCellStyle(cell, 14, true, 'center', 'FF000000'); 
        }
      });
      worksheet.getRow(row_count).height = 10;
      row_count++;
      worksheet = await rote.addExcelPlayerPhase(worksheet, i, allies[p].ally_code);
    }
  }

  return workbook;
}

const capitalize = (s) =>{
    return s && String(s[0]).toUpperCase() + String(s).slice(1);
}

const setCellStyle = (cell, fontSize, bold, alignment, fillColor) => {
  cell.font = { size: fontSize, bold: bold };
  cell.alignment = { horizontal: alignment };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: fillColor }
  };
  cell.border = {
    top: {style:'thick', color: {argb:'FF000000'}},
    left: {style:'thick', color: {argb:'FF000000'}},
    bottom: {style:'thick', color: {argb:'FF000000'}},
    right: {style:'thick', color: {argb:'FF000000'}}
  };
};

rote.addExcelPlayerPhase = async (worksheet, phase, ally_code) => { 
  //header
  worksheet.addRow(['PLAYER','LOCATION','CHARACTER','OPERATION NO','COMPLETED']);
  const row = worksheet.getRow(row_count);

  row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
    if (colNumber >= 1 && colNumber <= 5) { 
      setCellStyle(cell, 14, true, 'center', fills.headers[1]); 
    }
  });
  row_count++;
  const start_row = row_count;

  const paths = ['light', 'dark', 'neutral'];
  for (const path of paths) {
    const playerOperations = await rote.getAllyOperationsExcel(phase, path, ally_code);
    
    for (let i = 0; i < playerOperations.length; i++) {
      let row = [];
      row.push(playerOperations[i].ally_name);
      row.push(capitalize(playerOperations[i].path));
      row.push(playerOperations[i].character_name);
      row.push(playerOperations[i].operation);
      row.push(playerOperations[i].progress);
      worksheet.addRow(row);

      setCellStyle(worksheet.getCell('B' + row_count), 14, true, 'center', fills[path][0]); 
      setCellStyle(worksheet.getCell('C' + row_count), 14, true, 'center', fills[path][1]); 
      setCellStyle(worksheet.getCell('D' + row_count), 14, true, 'center', fills[path][1]);
      if(playerOperations[i].progress === 'Complete' || playerOperations[i].progress === 'N/A')
        setCellStyle(worksheet.getCell('E' + row_count), 14, true, 'center', fills[path][1]);
      else
        setCellStyle(worksheet.getCell('E' + row_count), 14, true, 'center', fills[path][0]); 

      row_count++;
    }
  }
  
  worksheet.mergeCells(start_row, 1, row_count - 1, 1);

  setCellStyle(worksheet.getCell('A' + start_row), 20, true, 'center', fills.headers[0]);
  worksheet.getCell('A' + start_row).alignment = { vertical: 'middle', horizontal: 'center' };

  return worksheet;
};

rote.getAllyOperationsExcel = async (phase, path, ally_code) => {
  let sql = "";
  sql += "SELECT IFNULL(ro.path, ?) AS path, ro.phase, rp.planet, CASE WHEN ro.operation IS NULL THEN 'N/A' ELSE 'OP '+ro.operation END as operation, ";
  sql += "ro.unit_index, IFNULL(u.character_name, 'N/A') AS character_name, ";
  sql += "p.ally_name, ";
  sql += "CASE WHEN pu.ally_code IS NULL THEN 'N/A' ";
  sql += "WHEN u.combat_type = 1 AND pu.relic_tier - 2 >= ro.relic_level THEN 'Complete' ";
  sql += "WHEN u.combat_type = 2 AND pu.rarity = 7 THEN 'Complete' ";
  sql += "ELSE CONCAT("
  sql += "	CASE WHEN u.combat_type = 2 THEN CONCAT( pu.rarity, ' star') WHEN pu.relic_tier > 2 THEN CONCAT('R',CAST(pu.relic_tier - 2  AS VARCHAR(2))) ELSE CONCAT('G', CAST(pu.gear_level AS VARCHAR(4))) END) END AS progress ";
  if(ally_code === -1){
    sql += "FROM (SELECT -1 AS ally_code, 'Unallocated' AS ally_name) p ";
  }  else {
    sql += "FROM	player p ";
  }
  sql += "LEFT OUTER JOIN rote_operation ro ";
  sql += "	ON IFNULL(ro.ally_code, -1) = p.ally_code ";
  sql += "  AND ro.phase = ? ";
  sql += "  AND ro.path = ? ";
  sql += "LEFT OUTER JOIN  rote_planets rp ";
  sql += "    ON rp.phase = ro.phase ";
  sql += "    AND rp.path = ro.path ";
  sql += "LEFT OUTER JOIN player_unit pu ";
  sql += "    ON  pu.ally_code = p.ally_code ";
  sql += "    AND  pu.base_id = ro.base_id ";
  sql += "LEFT OUTER JOIN unit u ";
  sql += "    ON u.base_id = ro.base_id ";
  sql += "WHERE p.ally_code = ? ";
  sql += "ORDER BY rp.planet, ro.operation, ro.unit_index ";
  
  return await runSQL(sql, [path, phase, path, ally_code]);
}

rote.getPlanets = async () => {

  let sql = "";
  sql += "SELECT path, phase, planet ";
  sql += "FROM rote_planets ";
  sql += "ORDER BY path, phase ";

  const rows= await runSQL(sql, []);

  let planets = {};
  planets.light = [];
  planets.dark = [];
  planets.neutral = [];

  for(let p = 0; p < rows.length; p++){
    planets[rows[p].path].push(rows[p].planet);
  }

  return planets;
}

rote.getOperations = async (path, phase) => {

  let operations = [];
  let sql = "";
  let rote_sql = "SELECT ro.path, ro.phase, rp.planet, ro.operation, "
  rote_sql += "ro.unit_index, ro.base_id, u.character_name, u.unit_image, "
  rote_sql += "p.ally_code, p.ally_name, "
  rote_sql += "CASE WHEN u.combat_type = 2 THEN CONCAT('(', pu.rarity, ' star)') WHEN pu.relic_tier > 2 THEN CONCAT('(R',CAST(pu.relic_tier - 2  AS VARCHAR(2)),')') ELSE CONCAT('(G', CAST(pu.gear_level AS VARCHAR(4)),')') END AS working_level, ";
  rote_sql += "CASE WHEN p.ally_code IS NULL THEN 'Unallocated' "
  rote_sql += "WHEN u.combat_type = 1 AND pu.relic_tier - 2 >= ro.relic_level THEN 'Allocated' "
  rote_sql += "WHEN u.combat_type = 2 AND pu.rarity = 7 THEN 'Allocated' "
  rote_sql += "ELSE 'Working' END AS allocation_type "
  rote_sql += "FROM rote_operation ro "
  rote_sql += "INNER JOIN rote_planets rp "
  rote_sql += "    ON rp.phase = ro.phase "
  rote_sql += "    AND rp.path = ro.path "
  rote_sql += "INNER JOIN unit u "
  rote_sql += "    ON u.base_id = ro.base_id "
  rote_sql += "LEFT OUTER JOIN player p "
  rote_sql += "    ON  ro.ally_code = p.ally_code "
  rote_sql += "LEFT OUTER JOIN player_unit pu "
  rote_sql += "    ON  pu.ally_code = p.ally_code "
  rote_sql += "    AND  pu.base_id = ro.base_id "
  rote_sql += "WHERE ro.path = ? ";
  rote_sql += "AND ro.phase = ? ";

  for(let i = 1; i < 7; i++){
      sql = rote_sql
      sql += "AND ro.operation = ? ";
      sql += "ORDER BY ro.unit_index ";

      const operation = await runSQL(sql, [path, phase, i]);
      operations.push(operation);
  }

  sql = rote_sql
  sql += "ORDER BY p.ally_name,  ro.operation, ro.unit_index";

  const ally = await runSQL(sql, [path, phase]);

  sql = "SELECT DISTINCT ro.base_id, p.ally_code, p.ally_name, u.character_name ";
  sql += "FROM rote_operation ro ";
  sql += "INNER JOIN unit u "
  sql += "    ON u.base_id = ro.base_id "
  sql += "INNER JOIN rote_operation ro2 ";
  sql += "    ON ro2.path = ro.path ";
  sql += "    AND ro2.phase = ro.phase ";
  sql += "    AND ro2.base_id = ro.base_id ";
  sql += "    AND ro2.ally_code IS NOT NULL ";
  sql += "INNER JOIN player p "
  sql += "    ON  ro2.ally_code = p.ally_code "
  sql += "WHERE ro.path = ? ";
  sql += "AND ro.phase = ? ";
  sql += "AND ro.ally_code IS NULL "
  sql += "ORDER BY ro.base_id, p.ally_name";

  const swaps = await runSQL(sql, [path, phase]);

  sql = "SELECT DISTINCT ro.base_id, p.ally_code, u.character_name, CONCAT(p.ally_name, ' ',  "
  sql += "	CASE WHEN u.combat_type = 2 THEN CONCAT('(', pu.rarity, ' star)') WHEN pu.relic_tier > 2 THEN CONCAT('(R',CAST(pu.relic_tier - 2  AS VARCHAR(2)),')') ELSE CONCAT('(G', CAST(pu.gear_level AS VARCHAR(4)),')') END) AS ally_name ";
  sql += "FROM rote_operation ro ";
  sql += "INNER JOIN unit u ";
  sql += "	ON u.base_id = ro.base_id ";
  sql += "INNER JOIN player_unit pu ";
  sql += "	ON u.base_id = pu.base_id ";
  sql += "INNER JOIN player p ";
  sql += "ON p.ally_code = pu.ally_code ";
  sql += "LEFT OUTER JOIN  ";
  sql += "(SELECT * FROM rote_operation WHERE ally_code IS NOT NULL) ro2 ";
  sql += "   ON ro2.path = ro.path  ";
  sql += "    AND ro2.phase = ro.phase  ";
  sql += "    AND ro2.base_id = ro.base_id  ";
  sql += "    AND ro2.ally_code = pu.ally_code ";
  sql += "WHERE ro.path = ? ";
  sql += "AND ro.phase = ? ";
  sql += "AND ro.ally_code IS NULL  ";
  sql += "AND ro2.ally_code IS NULL ";
  sql += "ORDER BY ro.base_id, pu.relic_tier DESC, pu.rarity DESC, pu.gear_level DESC, pu.gear_level_plus DESC, pu.`power` DESC";

  const canWork = await runSQL(sql, [path, phase]);

  let view = {};
  view.operations = operations;
  view.ally = ally;
  view.swaps = swaps;
  view.canWork = canWork;

  return view;
}

rote.allocateOperations = async (path, phase) => {

  //reset allocation
  let sql = "UPDATE rote_operation SET ally_code = null WHERE path = ? AND phase = ?";
  await runSQL(sql, [path, phase]);

  //all operations
  const all_operations = [1,2,3,4,5,6];

  //operations that cant be filled
  sql = "SELECT DISTINCT operation ";
  sql += "FROM rote_operation ro ";
  sql += "INNER JOIN unit u ";
  sql += "    ON	ro.base_id = u.base_id ";
  sql += "LEFT OUTER JOIN player_unit pu ";
  sql += "ON 	ro.base_id = pu.base_id ";
  sql += "AND	pu.rarity = 7 ";
  sql += "AND CASE WHEN u.combat_type = 1 THEN pu.relic_tier -2 ELSE ro.relic_level END >= ro.relic_level ";
  sql += "WHERE ro.path = ? ";
  sql += "AND 	ro.PHASE = ? ";
  sql += "AND	pu.base_id IS NULL ";

  const impossible_operations = await runSQL(sql, [path, phase]);
  const impossible_array = impossible_operations.map(obj => obj.operation);

  //possible operations, but may need multiple phases
  const makeable_operations = all_operations.filter(num => !impossible_array.includes(num));

  let fill_operations = makeable_operations;
  if(fill_operations.length > 0){

      //check makeable operations
      let base_ids = await rote.getEmptyAllocations(path, phase, fill_operations);

      //filter by missing != 0
      let missing_base_ids = base_ids.filter(item => item.missing > 0);

      while (missing_base_ids.length > 0){
          missing_base_ids.sort((a, b) => b.missing < a.missing ? -1 : (b.missing > a.missing ? 1 : 0));

          sql = "SELECT operation, COUNT(*) as unit_count "
          + "FROM    rote_operation "
          + "WHERE   path = ? "
          + "AND 	PHASE = ? "
          + "AND     operation IN (?) "
          + "AND     base_id = ? "
          + "GROUP BY operation "
          + "ORDER BY COUNT(*) "

          const unit_count = await runSQL(sql, [path, phase, fill_operations, missing_base_ids[0].base_id]);
          const remove_operation = rote.minNumbersToAddUpToTarget(unit_count, missing_base_ids[0].missing);

          fill_operations = fill_operations.filter(item => !remove_operation.includes(item));

          if(fill_operations.length === 0)
              break;

          base_ids = await rote.getEmptyAllocations(path, phase, fill_operations);

          //filter by missing != 0
          missing_base_ids = base_ids.filter(item => item.missing > 0);
      }
  
      if(fill_operations.length > 0)
          await rote.allocateToOperations(path, phase, fill_operations);
  }

  const removed_operations = all_operations.filter(item => !fill_operations.includes(item));

  if(removed_operations.length > 0)
      await rote.allocateToOperations(path, phase, removed_operations);

}

rote.getEmptyAllocations = async (path, phase, operations) => {

  let sql = "SELECT op.base_id, u.combat_type, op.relic_level, "
      + "op.required, COUNT(*) AS guild_count, GREATEST(op.required - COUNT(*), 0) AS missing "
      + "FROM (SELECT base_id, relic_level, COUNT(*) AS required "
      + "FROM rote_operation "
      + "WHERE ally_code IS NULL "
      + "AND path = ? "
      + "AND PHASE = ? "
      + "AND operation IN (?) "
      + "GROUP BY  base_id, relic_level) op "
      + "INNER JOIN unit u "
      + "ON u.base_id = op.base_id "
      + "LEFT OUTER JOIN (SELECT pu1.* "
      + "                FROM player_unit pu1 "
      + "                LEFT OUTER JOIN rote_operation ro1 "
      + "                    ON  pu1.base_id = ro1.base_id "
      + "                    AND pu1.ally_code = ro1.ally_code "
      + "                    AND   ro1.path = ? "
      + "                    AND   ro1.PHASE = ? "
      + "                    AND   ro1.operation IN (?)  "
      + "                WHERE ro1.base_id IS NULL"
      + "                AND   pu1.ally_code NOT IN (SELECT ally_code "
      + "                                               FROM rote_operation "
      + "                                               WHERE path = ? "
      + "                                               AND PHASE = ? "
      + "                                               AND operation IN (?) "
      + "                                               GROUP BY ally_code "
      + "                                               HAVING COUNT(*) < 10) "
      + "                                             ) AS pu "
      + "ON 	op.base_id = pu.base_id "
      + "AND	pu.rarity = 7 "
      + "AND CASE WHEN u.combat_type = 1 THEN pu.relic_tier - 2 ELSE op.relic_level END >= op.relic_level "
      + "GROUP BY op.base_id, op.required ";

  const empty_operations = await runSQL(sql, [path, phase, operations, path, phase, operations, path, phase, operations]);

  return empty_operations;
}

rote.allocateToOperations = async (path, phase, operations) => {

  let allocation_left = await rote.getAllyCountAvailableAllocations(path, phase, operations);
  let found = true;

  while(allocation_left.length > 0 && found){

      found = false;
      for(var i = 0; i < allocation_left.length; i++){
          if(allocation_left[i].ally_allocated < 10){
              found = true;
              await rote.allocateAlly(path, phase, operations, allocation_left[i].ally_code, allocation_left[i].ally_allocated);
          }
      }
      allocation_left = await rote.getAllyCountAvailableAllocations(path, phase, operations);
  }
}

rote.allocateAlly = async (path, phase, operations, ally_code, allocated) => {
    
  let sql = 
  "SELECT 	DISTINCT ro.base_id "
  +"    FROM 	rote_operation ro "
  +"    INNER JOIN unit u "
  +"        ON	ro.base_id = u.base_id "
  +"    INNER JOIN player_unit pu "
  +"       ON  	pu.base_id = ro.base_id "
  +"       AND	pu.rarity = 7 "
  +"       AND	CASE WHEN u.combat_type = 1 THEN pu.relic_tier - 2 ELSE ro.relic_level END >= ro.relic_level "
  +"    LEFT OUTER JOIN rote_operation ro_allocate "
  +"      ON		ro_allocate.base_id = pu.base_id "
  +"      AND 	ro_allocate.ally_code = pu.ally_code "
  +"      AND	    ro_allocate.PATH = ?  "
  +"      AND 	ro_allocate.PHASE = ? "
  +"    WHERE		ro.PATH = ? "
  +"    AND 		ro.PHASE = ? "
  +"    AND     	ro.operation IN (?) "
  +"    AND		ro.ally_code IS NULL "
  +"    AND		ro_allocate.base_id IS NULL "
  +"    AND		pu.ally_code = ?";

  const base_ids = await runSQL(sql, [path, phase, path, phase, operations, ally_code]);
  
  base_ids.forEach(async function (ally, index) {
      if(allocated < 10){
          sql = "UPDATE rote_operation SET ally_code = ? WHERE base_id = ? AND path = ? "
              + "AND phase = ? AND operation IN (?) AND ally_code IS NULL ORDER BY operation, unit_index LIMIT 1";
          await runSQL(sql, [ally_code, ally.base_id, path, phase, operations]);
          allocated++;
      }
  });
}

rote.getAllyCountAvailableAllocations = async (path, phase, operations) => {

  const sql = 
  "SELECT 	pu.ally_code, COUNT(*) AS ally_available, "
  +"          IFNULL((SELECT 	COUNT(*) AS ally_allocation "
  +"              FROM 		rote_operation ro1 "
  +"              WHERE		ro1.PATH = ? "
  +"              AND 		ro1.PHASE = ? "
  +"              AND		ro1.ally_code = pu.ally_code "
  +"              GROUP BY pu.ally_code), 0) AS ally_allocated "
  +"FROM 	(SELECT DISTINCT ro1.base_id, ro1.relic_level, u.combat_type "
  +"       FROM	rote_operation ro1 "
  +"       INNER JOIN unit u "
  +"          ON	ro1.base_id = u.base_id "
  +"       WHERE		ro1.PATH = ? "
  +"       AND 		ro1.PHASE = ? "
  +"       AND     	ro1.operation IN (?) "
  +"       AND		ro1.ally_code IS NULL) ro "
  +"INNER JOIN player_unit pu "
  +"  ON  	pu.base_id = ro.base_id "
  +"  AND	pu.rarity = 7 "
  +"  AND	CASE WHEN ro.combat_type = 1 THEN pu.relic_tier - 2 ELSE ro.relic_level END >= ro.relic_level "
  +"LEFT OUTER JOIN rote_operation ro_allocate "
  +"  ON		ro_allocate.base_id = pu.base_id "
  +"  AND 	ro_allocate.ally_code = pu.ally_code "
  +"  AND	    ro_allocate.PATH = ?  "
  +"  AND 	ro_allocate.PHASE = ? "
  +"WHERE ro_allocate.base_id IS NULL "
  +"GROUP BY pu.ally_code "
  +"ORDER BY ally_available";

  return await runSQL(sql, [path, phase, path, phase, operations, path, phase]);
}

rote.minNumbersToAddUpToTarget = (arr, target) => {
    
  let sum = BigInt(0);
  let index = arr.length - 1;
  const usedNumbers = [];
  
  while (sum < target && index >= 0) {
      while (sum + arr[index].unit_count <= target) {
          sum += arr[index].unit_count;
          usedNumbers.push(arr[index].operation);
          if (sum >= target) {
              return usedNumbers;
          }
      }
      index--;
  }
  //target is lower than any count so just take the first operation 
  usedNumbers.push(arr[0].operation);
  return usedNumbers; // If no combination of numbers adds up to the target
}

rote.swapOperations = async (path, phase, operation, team_index, ally_code) => {

  //get base_id
  let sql = "SELECT base_id "
  + "FROM rote_operation "
  + "WHERE path = ? "
  + "AND phase = ? "
  + "AND operation = ? "
  + "AND unit_index = ? "

  const base_id_result = await runSQL(sql, [path, phase, operation, team_index]);

  const base_id = base_id_result[0].base_id;

  sql = "UPDATE rote_operation "
  + "SET ally_code = null "
  + "WHERE path = ? "
  + "AND phase = ? "
  + "AND base_id = ? "
  + "AND ally_code = ?";

  await runSQL(sql, [path, phase, base_id, ally_code]);

  sql = "UPDATE rote_operation "
  + "SET ally_code = ? "
  + "WHERE path = ? "
  + "AND phase = ? "
  + "AND operation = ? "
  + "AND unit_index = ? ";

  await runSQL(sql, [ally_code, path, phase, operation, team_index]);
  
}

rote.workingOperations = async (path, phase, operation, team_index, ally_code) => {
  let sql = "UPDATE rote_operation "
  + "SET ally_code = ? "
  + "WHERE path = ? "
  + "AND phase = ? "
  + "AND operation = ? "
  + "AND unit_index = ? ";

  await runSQL(sql, [ally_code, path, phase, operation, team_index]);
}
export default rote;