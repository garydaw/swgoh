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


mods.getSpeedMods = async (ally_code, speed) => {

    let sql = "";
    sql += "    SELECT s.slot_name AS `Slot`, gs.group_set_name AS `Set`, u.character_name AS `Character`, ";
    sql += "    pm.level AS `Level`, pm.tier AS `Tier`, rarity AS `Dots`, ";
    sql += "    CONCAT(pm.primary_stat_value, ' ', pm.primary_stat) AS `Primary`, ";
    sql += "    CONCAT(pm.secondary_stat_1_value, ' ', pm.secondary_stat_1) AS `Secondary 1`, ";
    sql += "    CONCAT(pm.secondary_stat_2_value, ' ', pm.secondary_stat_2) AS `Secondary 2`, ";
    sql += "    CONCAT(pm.secondary_stat_3_value, ' ', pm.secondary_stat_3) AS `Secondary 3`, ";
    sql += "    CONCAT(pm.secondary_stat_4_value, ' ', pm.secondary_stat_4) AS `Secondary 4` ";
    sql += "    FROM player_mod pm  ";
    sql += "    INNER JOIN unit u ";
    sql += "       ON u.base_id = pm.base_id "
    sql += "    INNER JOIN slot s "
    sql += "       ON s.slot_id = pm.slot_id "
    sql += "    INNER JOIN group_set gs "
    sql += "       ON gs.group_set_id = pm.group_set_id "
    sql += "    WHERE pm.ally_code = ? ";
    sql += "    AND    CASE WHEN pm.secondary_stat_1 = 'Speed' THEN pm.secondary_stat_1_value ELSE 0 END + ";
    sql += "        CASE WHEN pm.secondary_stat_2 = 'Speed' THEN pm.secondary_stat_2_value ELSE 0 END + ";
    sql += "        CASE WHEN pm.secondary_stat_3 = 'Speed' THEN pm.secondary_stat_3_value ELSE 0 END + ";
    sql += "        CASE WHEN pm.secondary_stat_4 = 'Speed' THEN pm.secondary_stat_4_value ELSE 0 END = ? ";
    sql += "    ORDER BY s.slot_name"

    const rows= await runSQL(sql, [ally_code, speed]);

    return rows;
}


export default mods;