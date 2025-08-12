import runSQL from "./database.js";
import axios, { all } from "axios";
import fs from "fs";

const imgRootURL = 'https://game-assets.swgoh.gg/textures/'
const publicFolder = process.env.PUBLIC_FOLDER
const siteRootURL = process.env.SWGOH_URL

const isLocal = process.env.DB_HOST === "localhost" ? true : false;

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
    sql += "SELECT u.base_id, u.character_name, u.alignment, u.role, ";
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

units.refreshUnits = async (data) => {

    const allUnits = data.units.data;
   
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

        
        if(isLocal){
           await units.saveImageFromURL(imgRootURL, publicFolder, imgName);
        }
    }

    return;

}

units.getUnit = (base_id) => {
  let sql = "";
    sql += "SELECT * "
    sql += "FROM unit p ";
    sql += "WHERE base_id = ? ";

  const row =  runSQL(sql, [base_id]);
  return row;
}

export default units;