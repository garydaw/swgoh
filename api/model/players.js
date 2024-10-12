import runSQL from "./database.js";

let players = {};

players.getGuildMembers = async (ally_code) => {

    let sql = "";
    sql += "SELECT p.ally_code, p.ally_name ";
    sql += "FROM player p ";
    sql += "WHERE p.guild_id = ( SELECT guild_id FROM player WHERE ally_code = ?) ";
    sql += "ORDER BY p.ally_name ";

    const rows= await runSQL(sql, [ally_code]);

    return rows;

} 


export default players;