import runSQL from "./database.js";
import excel from "exceljs";

let tw_counters = {};
const fills = {
              headers:["FF93C47D", "FFD9EAD3"],
              light:["FF6FA8DC", "FFCFE2F3"], 
              dark:["FFE06666", "FFF4CCCC"],
              neutral:["FFCCCCCC", "FFEFEFEF"]
            };

tw_counters.get = async (includeEmpty=true) => {

    let sql = "SELECT u.base_id, IFNULL(twc.counter, 'No counters available') AS counters, u.character_name, u.unit_image ";
    sql += "FROM unit u ";
    sql += "LEFT OUTER JOIN tw_counters twc ";
    sql += " ON twc.base_id = u.base_id ";
    sql += "WHERE u.categories LIKE '%Leader%' "
    sql += "AND IFNULL(twc.is_current,1) = 1 "
    if(!includeEmpty){
      sql += "AND IFNULL(twc.counter, 'No counters available') <> 'No counters available' "
    }
    sql += "ORDER BY u.character_name";

    const counters = await runSQL(sql, []);
    
    return counters;
}

tw_counters.set = async (data) => {

    let sql = "UPDATE tw_counters SET is_current = 0 WHERE base_id = ?";

    await runSQL(sql, [data.base_id]);
    
    sql = "INSERT INTO tw_counters (base_id, counter) VALUES (?, ?)";

    await runSQL(sql, [data.base_id, data.counters]);

    return;
}


const setCellStyle = (cell, fontSize, bold, alignment, fillColor, wrapText) => {
  cell.font = { size: fontSize, bold: bold };
  cell.alignment = { 
    horizontal: alignment, 
    wrapText: wrapText
  };
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

tw_counters.getExcel = async (ally_code) => {

  let workbook = new excel.Workbook();

  //get counters
  const counters = await tw_counters.get(false);
  console.log(counters);
  /*****Header*****/
  let worksheet = workbook.addWorksheet("TW Counters");
  let row_count = 1;
  worksheet.getCell("A" + row_count).value = 'TW COUNTERS';
  setCellStyle(worksheet.getCell("A" + row_count), 24, true, 'center', fills.headers[0], false);

  //merge cells
  worksheet.mergeCells(row_count,1,row_count,2);

  row_count++;

  worksheet.getColumn(1).width = 30;
  worksheet.getColumn(2).width = 100;

  let current_character = '';

  for (let i = 0; i < counters.length; i++) {
    if(current_character !== counters[i].character_name){
      current_character = counters[i].character_name;
      worksheet.addRow([counters[i].character_name]);
      setCellStyle(worksheet.getCell("A" + row_count), 14, true, 'left', fills.headers[1], false);
      worksheet.mergeCells(row_count,1,row_count,2);
      row_count++;
    }
    let this_counter = counters[i].counters.replace(/<strong>/g, "");
    this_counter = this_counter.replace(/<\/strong>/g, '');
    this_counter = this_counter.replace(/<p>/g, "");
    this_counter = this_counter.replace(/<\/p>/g, "\n");
    worksheet.addRow([this_counter]);
    worksheet.getCell("A" + row_count).alignment = { 
      wrapText: true
    };
    worksheet.mergeCells(row_count,1,row_count,2);
    row_count++;
  }
 
  return workbook;
}

export default tw_counters;