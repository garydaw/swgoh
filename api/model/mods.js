import runSQL from "./database.js";

let mods = {};


mods.get = async (ally_code) => {

    let sql = "";
    sql += "SELECT rarity, speed, COUNT(*) AS count ";
    sql += "FROM ( ";
    sql += "    SELECT pm.rarity, ";
    sql += "        CASE WHEN pm.secondary_stat_1 = 'Speed' THEN pm.secondary_stat_1_value ELSE 0 END + ";
    sql += "        CASE WHEN pm.secondary_stat_2 = 'Speed' THEN pm.secondary_stat_2_value ELSE 0 END + ";
    sql += "        CASE WHEN pm.secondary_stat_3 = 'Speed' THEN pm.secondary_stat_3_value ELSE 0 END + ";
    sql += "        CASE WHEN pm.secondary_stat_4 = 'Speed' THEN pm.secondary_stat_4_value ELSE 0 END AS speed";
    sql += "    FROM player_mod pm  ";
    sql += "    WHERE pm.ally_code = ? ) AS mod_data ";
    sql += " GROUP BY speed, rarity ";
    sql += " ORDER BY speed, rarity ";

    const rows= await runSQL(sql, [ally_code]);

    return rows;
}


export default mods;