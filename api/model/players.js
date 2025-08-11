import runSQL from "./database.js";
import axios from "axios";
import auth from "./auth.js";


const siteRootURL = process.env.SWGOH_URL

let players = {};

players.getGuildMembers = async (ally_code) => {

    
    let sql = "";
    sql += "SELECT p.ally_code, p.ally_name, p.access ";
    sql += "FROM player p ";
    sql += "WHERE p.guild_id = ( SELECT guild_id FROM player WHERE ally_code = ?) ";
    sql += "ORDER BY p.ally_name ";

    const rows= await runSQL(sql, [ally_code]);

    return rows;
}

players.getGuildMembersRefresh = async (ally_code) => {

    const url = siteRootURL + 'api/player/';
    let sql = "";
    sql += "SELECT  CONCAT(?, p.ally_code) AS url, p.refreshed, p.ally_name ";
    sql += "FROM player p ";
    sql += "ORDER BY p.refreshed ";

    const rows= await runSQL(sql, [url, ally_code]);

    return rows;
}

players.getPlayerGuild = async (ally_code) => {

    let sql = "";
    sql += "SELECT p.guild_id ";
    sql += "FROM player p ";
    sql += "WHERE ally_code = ? ";

    const rows= await runSQL(sql, [ally_code]);

    return rows[0].guild_id;
}


players.playerExists = async (ally_code) => {

    let sql = "";
    sql += "SELECT p.ally_code ";
    sql += "FROM player p ";
    sql += "WHERE ally_code = ? ";

    const rows= await runSQL(sql, [ally_code]);

    return rows.length === 1;
}

players.update = async (user_response) => {

    const ally_code = user_response.data.data.ally_code;
    
    let sql = "";
    sql += "UPDATE player SET ";
    sql += "ally_name = ?, ";
    sql += "character_galactic_power = ?, ";
    sql += "ship_galactic_power = ?, ";
    sql += "guild_id = ?, ";
    sql += "guild_name = ?, ";
    sql += "refreshed = Now() ";
    sql += "WHERE ally_code = ?"

    await runSQL(sql, [user_response.data.data.name, user_response.data.data.character_galactic_power, user_response.data.data.ship_galactic_power, 
                user_response.data.data.guild_id, user_response.data.data.guild_name,  ally_code]);

    //add player units
    for(var u = 0; u < user_response.data.units.length; u++){
        await players.addUnit(ally_code, user_response.data.units[u].data);
    }

    //delete all mods
    await runSQL("DELETE FROM player_mod WHERE ally_code  = ?", [ally_code]);

    //add mods
    for(var m = 0; m < user_response.data.mods.length; m++){
        await players.addMod(ally_code, user_response.data.mods[m]);
    }

}

players.addMod = async (ally_code, mod_data) => {

    if(!("secondary_stats" in mod_data)){
        mod_data.secondary_stats = [];
    }

    while(mod_data.secondary_stats.length < 4)
        mod_data.secondary_stats.push({"name":"","display_value":""});

    //insert or update

    let sql = "INSERT INTO player_mod (id, ";
    sql += "ally_code, base_id, level, tier, rarity, slot_id, group_set_id, ";
    sql += "primary_stat, primary_stat_value, secondary_stat_1, secondary_stat_1_value, secondary_stat_2, secondary_stat_2_value, ";
    sql += "secondary_stat_3, secondary_stat_3_value, secondary_stat_4, secondary_stat_4_value) ";
    sql += "VALUES (?, ";
    sql += "?, ?, ?, ?, ?, ?, ?, ";
    sql += "?, ?, ?, ?, ?, ?, ";
    sql += "?, ?, ?, ?) ";
    
    await runSQL(sql, [ mod_data.id,
        ally_code, mod_data.character, mod_data.level, mod_data.tier, mod_data.rarity, mod_data.slot, mod_data.set,
        mod_data.primary_stat.name, mod_data.primary_stat.display_value, mod_data.secondary_stats[0].name, mod_data.secondary_stats[0].display_value, mod_data.secondary_stats[1].name, mod_data.secondary_stats[1].display_value,
        mod_data.secondary_stats[2].name, mod_data.secondary_stats[2].display_value, mod_data.secondary_stats[3].name, mod_data.secondary_stats[3].display_value]);
    
}

players.addUnit = async (ally_code, unit_data) => {
    
    let gear_level_plus = 0;
    let gear_level_binary = "";
    for(var g = 0; g < unit_data.gear.length; g++){
        if(unit_data.gear[g].is_obtained){
            gear_level_plus++;
            gear_level_binary = "1" + gear_level_binary;
        } else {
            gear_level_binary = "0" + gear_level_binary;
        }
    }

    if(gear_level_binary === "")
        gear_level_binary = "0";
    const gear_level_flags = parseInt(gear_level_binary,2);

    //insert or update
    let sql = "INSERT INTO player_unit (ally_code, base_id, gear_level, gear_level_plus, gear_level_flags, level, power, rarity, ";
    sql += "zeta_abilities, omicron_abilities, relic_tier, has_ultimate, is_galactic_legend) ";
    sql += "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ";
    sql += "ON DUPLICATE KEY UPDATE ";
    sql += "gear_level = ?, ";
    sql += "gear_level_plus = ?, ";
    sql += "gear_level_flags = ?, ";
    sql += "level = ?, ";
    sql += "power = ?, ";
    sql += "rarity = ?, ";
    sql += "zeta_abilities = ?, ";
    sql += "omicron_abilities = ?, ";
    sql += "relic_tier = ?, ";
    sql += "has_ultimate = ?, ";
    sql += "is_galactic_legend = ? ";

    await runSQL(sql, [ally_code, unit_data.base_id,
        unit_data.gear_level, gear_level_plus, gear_level_flags, unit_data.level, unit_data.power, unit_data.rarity,
        unit_data.zeta_abilities.join(","), unit_data.omicron_abilities.join(","), unit_data.relic_tier, unit_data.has_ultimate, unit_data.is_galactic_legend, 
        unit_data.gear_level, gear_level_plus, gear_level_flags, unit_data.level, unit_data.power, unit_data.rarity,
        unit_data.zeta_abilities.join(","), unit_data.omicron_abilities.join(","), unit_data.relic_tier, unit_data.has_ultimate, unit_data.is_galactic_legend]);
}

players.add = async (ally_code) => {

    let sql = "";
    sql += "INSERT INTO player (ally_code) ";
    sql += "VALUES (?) ";

    await runSQL(sql, [ally_code]);

    await auth.changePassword(ally_code, ally_code);
}

players.delete = async (ally_code) => {
    
    let sql = "DELETE FROM player_mod WHERE ally_code = ?";

    await runSQL(sql, [ally_code]);
    
    sql = "DELETE FROM tw_wall_team WHERE ally_code = ?";

    await runSQL(sql, [ally_code]);

    sql = "UPDATE rote_operation SET ally_code = NULL WHERE ally_code = ?"
    
    await runSQL(sql, [ally_code]);
    
    sql = "DELETE FROM player_unit WHERE ally_code = ?";

    await runSQL(sql, [ally_code]);
    
    sql = "DELETE FROM player WHERE ally_code = ?";

    await runSQL(sql, [ally_code]);
}

players.refreshAllies = async (response) => {

    //find guild members
    let text_start = 0;
    const text = '<a href="/p/';
    text_start = response.data.indexOf(text, text_start) + text.length;
    
    let guild_ally_codes = [];

    while(text_start !== text.length-1){
        guild_ally_codes.push(response.data.substr(text_start, 9))
        text_start = response.data.indexOf(text, text_start) + text.length;
    }
    
    if(guild_ally_codes.length === 0){
        return;
    }
    
    //delete missing members    
    let sql = "";
    sql += "SELECT p.ally_code ";
    sql += "FROM player p ";
    sql += "WHERE p.ally_code NOT IN (?) ";

    const rows= await runSQL(sql, [guild_ally_codes]);
   
    for(var i = 0; i < rows.length; i++){
        players.delete(rows[i].ally_code);
    }

    //add and update existing members
    for(var i = 0; i < guild_ally_codes.length; i++){
        
        const playerExists = await players.playerExists(guild_ally_codes[i]);
        if(!playerExists){
            players.add(guild_ally_codes[i])
        }

    }
}


export default players;