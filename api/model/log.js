import runSQL from "./database.js";

let log = {};

log.addLog= async (ally_code, url) => {

  let sql = "INSERT INTO log (ally_code, url) "
  sql += "VALUES (?, ?) ";

  await runSQL(sql, [ally_code, url]);
}

export default log;