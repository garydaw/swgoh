import bcrypt from 'bcrypt';
import runSQL from "./database.js";
import jwt from 'jsonwebtoken';


let auth = {};

//check password
auth.checkPassword = async (username, password) => {

    //get the user data
    const this_user = await auth.login(username);
    
    //no user then cant match
    if(this_user.length != 1)
        return false;
    
    // Compare the entered password with the stored hashed password
    return await bcrypt.compare(password, this_user[0].password);
    
}

//get basic user data
auth.login = async (username) => {

    let sql = "SELECT ally_code, password, access ";
    sql += "FROM player ";
    sql += "WHERE ally_code = ? "
    sql += "OR ally_name = ? "

    const this_user = await runSQL(sql, [username, username]);
    
    return this_user;
}

//create a jwt token and return this with the user data
auth.getAuthToken = async (username) => {

    const this_user = await auth.login(username);
    this_user[0].token = jwt.sign({ username: this_user[0].ally_code, access: this_user[0].access}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '168h' });
    return this_user[0];
}

//verify the token
auth.verifyAuthToken = async (authToken) => {

    return jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return false;
        }
        return true;
    })
}

auth.changePassword = async (username, password) => {

    const hash = await bcrypt.hash(password.toString(), 10);

    let sql = "UPDATE player ";
    sql += "SET password = ? "
    sql += "WHERE ally_code = ?"

    await runSQL(sql, [hash, username]);
    
    return;
}

auth.changeAdmin = async (username, access) => {


    let sql = "UPDATE player ";
    sql += "SET access = ? "
    sql += "WHERE ally_code = ?"

    await runSQL(sql, [access, username]);
    
    return;
}

/*
player.get = async (ally_code) => {

    let player_details = {};
    player_details.ally_code = ally_code;

    const rows = await runSQL("SELECT * FROM player WHERE ally_code = ?", ally_code);

    if(rows.length === 0)
        return player_details;

    player_details = rows[0];
    let sql2 = "";
    let sql = "";
    sql += "SELECT u.base_id, u.combat_type, u.character_name, u.alignment, ";
    sql += "    u.role, u.categories, u.unit_image,"
	sql += "	pu.gear_level, pu.gear_level_plus, pu.level, pu.power, pu.rarity, ";
	sql += "	pu.zeta_abilities, pu.omicron_abilities, pu.relic_tier, pu.has_ultimate, pu.is_galactic_legend ";
    sql += "FROM player_unit pu ";
    sql += "INNER JOIN unit u ";
    sql += "    ON pu.base_id = u.base_id ";
    sql += "WHERE pu.ally_code = ? ";
    sql2 += "AND     u.combat_type = 1 ";
    sql2 += "ORDER BY pu.power DESC ";

    player_details.units = await runSQL(sql + sql2, ally_code);

    sql2 = "AND     u.combat_type = 2 ";
    sql2 += "ORDER BY pu.power DESC ";
    player_details.ships = await runSQL(sql + sql2, ally_code);

    return player_details;

}

player.getUnit = async (ally_code, base_id) => {

    let unit = {};

    let sql = "";
    sql += "SELECT u.base_id, u.combat_type, u.character_name, u.alignment, u.role, u.categories, u.unit_image, ";
	sql += "	pu.gear_level, pu.gear_level_plus, pu.gear_level_flags, pu.level, pu.power, pu.rarity, ";
	sql += "	pu.zeta_abilities, pu.omicron_abilities, pu.relic_tier, pu.has_ultimate, pu.is_galactic_legend ";
    sql += "FROM player_unit pu ";
    sql += "INNER JOIN unit u ";
    sql += "    ON pu.base_id = u.base_id ";
    sql += "WHERE pu.ally_code = ? ";
    sql += "AND     u.base_id = ? ";

    const rows= await runSQL(sql, [ally_code, base_id]);
    unit.details = rows[0];

    sql = "SELECT  GROUP_CONCAT(DISTINCT gs.group_set_name SEPARATOR ',') AS group_set_names ";
    sql += "FROM unit_mod um ";
    sql += "INNER JOIN group_set gs ";
    sql += "    ON um.group_set_id = gs.group_set_id ";
    sql += "WHERE um.base_id = ? ";
    sql += "AND   um.date = (SELECT date FROM unit_mod ORDER BY date DESC LIMIT 1)"

    const best_sets = await runSQL(sql, [base_id]); 
    unit.best_sets = best_sets[0].group_set_names;

    sql = "SELECT s.slot_id, s.slot_name, s.slot_long_name, IFNULL(gs.group_set_name, '-') AS group_set_name, pm.level, ";
    sql += "    um.primary_stat AS best_primary_stat, IFNULL(pm.rarity, 0) AS rarity, IFNULL(pm.tier, 0) AS tier, ";
	sql += "    IFNULL(pm.primary_stat, '-') AS primary_stat, IFNULL(pm.primary_stat_value, '-') AS primary_stat_value, ";
	sql += "    IFNULL(pm.secondary_stat_1, '-') AS secondary_stat_1, IFNULL(pm.secondary_stat_1_value, '-') AS secondary_stat_1_value, ";
    sql += "    IFNULL(pm.secondary_stat_2, '-') AS secondary_stat_2, IFNULL(pm.secondary_stat_2_value, '-') AS secondary_stat_2_value, ";
    sql += "    IFNULL(pm.secondary_stat_3, '-') AS secondary_stat_3, IFNULL(pm.secondary_stat_3_value, '-') AS secondary_stat_3_value, ";
    sql += "    IFNULL(pm.secondary_stat_4, '-') AS secondary_stat_4, IFNULL(pm.secondary_stat_4_value, '-') AS secondary_stat_4_value ";
    sql += "    FROM slot s ";
    sql += "    LEFT OUTER JOIN unit_mod um ";
    sql += "    	ON s.slot_id = um.slot_id ";
    sql += "        AND   um.base_id = ? ";
    sql += "        AND   um.date = (SELECT date FROM unit_mod ORDER BY date DESC LIMIT 1)"
    sql += "    LEFT OUTER JOIN player_mod pm ";
    sql += "    	ON s.slot_id = pm.slot_id ";
    sql += "        AND pm.ally_code = ? "
    sql += "        AND   pm.base_id = ? ";
    sql += "    LEFT OUTER JOIN group_set gs ";
    sql += "    	ON gs.group_set_id = pm.group_set_id ";

    
    unit.mods = await runSQL(sql, [base_id, ally_code, base_id]);

    return unit;

} 


player.getUnits = async (ally_code) => {

    let sql = "";
    sql += "SELECT u.base_id, u.character_name ";
    sql += "FROM player_unit pu ";
    sql += "INNER JOIN unit u ";
    sql += "    ON pu.base_id = u.base_id ";
    sql += "WHERE pu.ally_code = ? ";
    sql += "AND u.combat_type = 1 ";
    sql += "ORDER BY u.character_name ";

    const rows= await runSQL(sql, [ally_code]);

    return rows;

} 
*/
export default auth;