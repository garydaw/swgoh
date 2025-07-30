import runSQL from "./database.js";
import axios from "axios";
import fs from "fs";

const imgRootURL = 'https://game-assets.swgoh.gg/textures/'
const publicFolder = process.env.PUBLIC_FOLDER
const siteRootURL = process.env.SWGOH_URL

let units = {};

units.get = async (ally_code, base_id, combat_type) => {

    let sql = "";
    sql += "SELECT u.base_id, u.character_name, u.alignment, u.role, ";
    sql += "        u.categories, u.unit_image, ";
    sql += "        pu.gear_level, pu.gear_level_plus, pu.gear_level_flags, ";
    sql += "        pu.level, pu.power, pu.rarity, pu.zeta_abilities, pu.omicron_abilities, ";
    sql += "        pu.relic_tier, pu.has_ultimate, u.is_galactic_legend, "
    sql += "        CASE u.alignment WHEN 1 THEN 'neutral' WHEN 2 THEN 'light' ELSE 'dark' END as alignment_label "
    sql += "FROM player_unit pu ";
    sql += "INNER JOIN unit u ";
    sql += "    ON pu.base_id = u.base_id ";
    sql += "WHERE pu.ally_code = ? ";
    sql += "AND u.combat_type = ? ";
    if(base_id != "")
        sql += "AND u.base_id = ? ";
    sql += "ORDER BY pu.power DESC, u.character_name ";

    const rows= await runSQL(sql, [ally_code, combat_type, base_id]);

    return rows;

} 

units.getGeneric = async (combat_type) => {

    let sql = "";
    sql += "SELECT u.base_id, u.character_name, u.alignment, u.role, u.url, ";
    sql += "        u.categories, u.unit_image, ";
    sql += "        13 AS gear_level, 0 AS gear_level_plus, ";
    sql += "        85 AS level, 0 AS power, 7 AS rarity, 0 AS zeta_abilities, 0 AS omicron_abilities, ";
    sql += "        11 AS relic_tier, u.is_galactic_legend AS has_ultimate, u.is_galactic_legend, "
    sql += "        CASE u.alignment WHEN 1 THEN 'neutral' WHEN 2 THEN 'light' ELSE 'dark' END as alignment_label "
    sql += "FROM unit u ";
    sql += "WHERE u.combat_type = ? ";
    sql += "ORDER BY u.character_name ";

    const rows= await runSQL(sql, [combat_type]);

    return rows;

}

units.saveImageFromURL = async (url, path, filename) => {
    try {
    const response = await axios({
        url: url + filename,
        method: 'GET',
        responseType: 'stream',
    });

    // Create a write stream to save the file
    const writer = fs.createWriteStream(path + filename);

    // Pipe the image data to the file
    response.data.pipe(writer);

    // Return a promise that resolves when the write stream is done
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading the image:', error);
    }
}

units.refreshUnits = async () => {

    const response = await axios.get(siteRootURL + 'api/units');

    const allUnits = response.data.data;

    //loop round allUnits
    for(var u = 0; u < allUnits.length; u++){
        //insert or update
        let sql = "INSERT INTO unit (base_id, combat_type, character_name, url, alignment, role, categories, unit_image, is_galactic_legend) ";
        sql += "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ";
        sql += "ON DUPLICATE KEY UPDATE ";
        sql += "combat_type = ?, ";
        sql += "character_name = ?, ";
        sql += "url = ?, ";
        sql += "alignment = ?, ";
        sql += "role = ?, ";
        sql += "categories = ?, ";
        sql += "unit_image = ?, ";
        sql += "is_galactic_legend = ? ";

        const imgName = allUnits[u].image.split("/").pop();
        await runSQL(sql, [allUnits[u].base_id,
                            allUnits[u].combat_type, allUnits[u].name, allUnits[u].url, allUnits[u].alignment, allUnits[u].role, allUnits[u].categories.toString(), imgName,
                            allUnits[u].is_galactic_legend,
                            allUnits[u].combat_type, allUnits[u].name, allUnits[u].url, allUnits[u].alignment, allUnits[u].role, allUnits[u].categories.toString(), imgName,
                            allUnits[u].is_galactic_legend]);

        

        await units.saveImageFromURL(imgRootURL, publicFolder, imgName);
    }

    return;

}

units.setBestMods = async (base_id, url, character_name) => {

    await runSQL("DELETE FROM unit_mod WHERE base_id = ?", [base_id]);

    const response = await axios.get('https:' + url + 'best-mods/');

    const html = response.data;
    var mod_start = 0;

    
    //arrow
    mod_text = "Best Arrow (Receiver)";
    mod_start = html.indexOf(mod_text, mod_start) + mod_text.length;
    mod_text = "Mod Primary Stat: <strong>";
    mod_start = html.indexOf(mod_text, mod_start) + mod_text.length;

    //no mods found
    if(mod_start === mod_text.length - 1){
        return;
    }

    mod_end = html.indexOf("</strong>", mod_start);
    var arrow = html.substr(mod_start, mod_end - mod_start);

    //triangle
    var mod_text = "Best Triangle (Holo-Array)";
    mod_start = html.indexOf(mod_text, mod_start) + mod_text.length;
    mod_text = "Mod Primary Stat: <strong>";
    mod_start = html.indexOf(mod_text, mod_start) + mod_text.length;
    var mod_end = html.indexOf("</strong>", mod_start);
    var triangle = html.substr(mod_start, mod_end - mod_start);

    //circle
    mod_text = "Best Circle (Data-Bus)";
    mod_start = html.indexOf(mod_text, mod_start) + mod_text.length;
    mod_text = "Mod Primary Stat: <strong>";
    mod_start = html.indexOf(mod_text, mod_start) + mod_text.length;
    mod_end = html.indexOf("</strong>", mod_start);
    var circle = html.substr(mod_start, mod_end - mod_start);

    //Cross
    mod_text = "Best Cross (Multiplexer)";
    mod_start = html.indexOf(mod_text, mod_start) + mod_text.length;
    mod_text = "Mod Primary Stat: <strong>";
    mod_start = html.indexOf(mod_text, mod_start) + mod_text.length;
    mod_end = html.indexOf("</strong>", mod_start);
    var cross = html.substr(mod_start, mod_end - mod_start);

    //sets
    //mod_text = "The most popular Mod Set for " + htmlEncode(character_name) + " is";
    mod_text = "The most popular Mod Set for " + character_name + " is";
    mod_start = html.indexOf(mod_text, mod_start) + mod_text.length;
    mod_end = html.indexOf("</p>", mod_start);
    var full_set = html.substr(mod_start, mod_end - mod_start);

    var set_start = 0;
    var set = [];

    var set_text = '<span class="fw-bold">';
    set_start = full_set.indexOf(set_text, set_start) + set_text.length;
    var set_end = full_set.indexOf("</span>", set_start);
    set.push(full_set.substr(set_start, set_end - set_start));

    //double set
    if(full_set.substr(set_end + 9,1) === "4"){
        set.push(full_set.substr(set_start, set_end - set_start));
    }
    
    set_start = full_set.indexOf(set_text, set_start) + set_text.length;
    var set_end = full_set.indexOf("</span>", set_start);
    set.push(full_set.substr(set_start, set_end - set_start));

    //double set
    if(full_set.substr(set_end + 9,1) === "4"){
        set.push(full_set.substr(set_start, set_end - set_start));
    }

    if(set.length === 2){
        set_start = full_set.indexOf(set_text, set_start) + set_text.length;
        var set_end = full_set.indexOf("</span>", set_start);
        set.push(full_set.substr(set_start, set_end - set_start));
    }
    
    let sql = "INSERT INTO unit_mod (base_id, slot_id, group_set_id, primary_stat) SELECT ?, ?, group_set_id, ? FROM group_set WHERE group_set_name = ?";

    //square
    await runSQL(sql, [base_id, 2, "Offense", set[0]]);

    //arrow
    await runSQL(sql, [base_id, 3, arrow, set[0]]);

    //diamond
    await runSQL(sql, [base_id, 4, "Defense", set[1]]);

    //triangle
    await runSQL(sql, [base_id, 5, triangle, set[1]]);

    //circle
    await runSQL(sql, [base_id, 6, circle, set[2]]);

    //cross
    await runSQL(sql, [base_id, 7, cross, set[2]]);

}

export default units;