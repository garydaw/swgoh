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

players.playerExists = async (ally_code) => {

    let sql = "";
    sql += "SELECT p.ally_code ";
    sql += "FROM player p ";
    sql += "WHERE ally_code = ? ";

    const rows= await runSQL(sql, [ally_code]);

    return rows.length === 1;
}

players.update = async (ally_code) => {

    const user_response = await axios.get(siteRootURL + 'api/player/'+ally_code);

    let sql = "";
    sql += "UPDATE player SET ";
    sql += "ally_name = ?, ";
    sql += "character_galactic_power = ?, ";
    sql += "ship_galactic_power = ?, ";
    sql += "guild_id = ?, ";
    sql += "guild_name = ? ";
    sql += "WHERE ally_code = ?"

    await runSQL(sql, [user_response.data.data.name, user_response.data.data.character_galactic_power, user_response.data.data.ship_galactic_power, 
                user_response.data.data.guild_id, user_response.data.data.guild_name,  ally_code]);

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

players.refreshAllies = async (guild_id) => {

    const response = await axios.get(siteRootURL + 'g/'+guild_id);


    //find guild members
    let text_start = 0;
    const text = '<a href="/p/';
    text_start = response.data.indexOf(text, text_start) + text.length;
    
    let guild_ally_codes = [];

    while(text_start !== text.length-1){
        guild_ally_codes.push(response.data.substr(text_start, 9))
        text_start = response.data.indexOf(text, text_start) + text.length;
    }

    //delete missing members
    let sql = "";
    sql += "SELECT p.ally_code ";
    sql += "FROM player p ";
    sql += "WHERE p.guild_id = ? ";
    sql += "AND p.ally_code NOT IN (?) ";

    const rows= await runSQL(sql, [guild_id, guild_ally_codes]);
    
    for(var i = 0; i < rows.length; i++){
        players.delete(rows[i].ally_code);
    }

    //add and update existing members
    for(var i = 0; i < guild_ally_codes.length; i++){
        console.log(guild_ally_codes[i]);
        const playerExists = await players.playerExists(guild_ally_codes[i]);
        if(!playerExists){
            players.add(guild_ally_codes[i])
        }

        players.update(guild_ally_codes[i]);
    }
}


export default players;