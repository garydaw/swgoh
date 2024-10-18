import runSQL from "./database.js";

let units = {};

units.get = async (ally_code, combat_type) => {

    let sql = "";
    sql += "SELECT u.base_id, u.character_name, u.alignment, u.role, ";
    sql += "        u.categories, u.unit_image, ";
    sql += "        pu.gear_level, pu.gear_level_plus, pu.gear_level_flags, ";
    sql += "        pu.level, pu.power, pu.rarity, pu.zeta_abilities, pu.omicron_abilities, ";
    sql += "        pu.relic_tier, pu.has_ultimate, pu.is_galactic_legend "
    sql += "FROM player_unit pu ";
    sql += "INNER JOIN unit u ";
    sql += "    ON pu.base_id = u.base_id ";
    sql += "WHERE pu.ally_code = ? ";
    sql += "AND u.combat_type = ? ";
    sql += "ORDER BY pu.power DESC, u.character_name ";

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