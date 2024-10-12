import runSQL from "./database.js";

let units = {};

units.get = async (ally_code, combat_type) => {

    let sql = "";
    sql += "SELECT u.base_id, u.character_name ";
    sql += "FROM player_unit pu ";
    sql += "INNER JOIN unit u ";
    sql += "    ON pu.base_id = u.base_id ";
    sql += "WHERE pu.ally_code = ? ";
    sql += "AND u.combat_type = ? ";
    sql += "ORDER BY u.character_name ";

    const rows= await runSQL(sql, [ally_code, combat_type]);

    return rows;

} 

units.getGeneric = async (combat_type) => {

    let sql = "";
    sql += "SELECT u.base_id, u.character_name ";
    sql += "FROM unit u ";
    sql += "WHERE u.combat_type = ? ";
    sql += "ORDER BY u.character_name ";

    const rows= await runSQL(sql, [combat_type]);

    return rows;

} 

export default units;