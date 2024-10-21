import runSQL from "./database.js";
import axios from "axios";
import fs from "fs";

const imgRootURL = 'https://game-assets.swgoh.gg/textures/'
const publicFolder = process.env.PUBLIC_FOLDER
const siteRootURL = process.env.SWGOH_URL

let units = {};

units.get = async (ally_code, combat_type) => {

    let sql = "";
    sql += "SELECT u.base_id, u.character_name, u.alignment, u.role, ";
    sql += "        u.categories, u.unit_image, ";
    sql += "        pu.gear_level, pu.gear_level_plus, pu.gear_level_flags, ";
    sql += "        pu.level, pu.power, pu.rarity, pu.zeta_abilities, pu.omicron_abilities, ";
    sql += "        pu.relic_tier, pu.has_ultimate, pu.is_galactic_legend, "
    sql += "        CASE u.alignment WHEN 1 THEN 'neutral' WHEN 2 THEN 'light' ELSE 'dark' END as alignment_label "
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
        let sql = "INSERT INTO unit (base_id, combat_type, character_name, url, alignment, role, categories, unit_image) ";
        sql += "VALUES (?, ?, ?, ?, ?, ?, ?, ?) ";
        sql += "ON DUPLICATE KEY UPDATE ";
        sql += "combat_type = ?, ";
        sql += "character_name = ?, ";
        sql += "url = ?, ";
        sql += "alignment = ?, ";
        sql += "role = ?, ";
        sql += "categories = ?, ";
        sql += "unit_image = ?";

        const imgName = allUnits[u].image.split("/").pop();
        await runSQL(sql, [allUnits[u].base_id,
                            allUnits[u].combat_type, allUnits[u].name, allUnits[u].url, allUnits[u].alignment, allUnits[u].role, allUnits[u].categories.toString(), imgName,
                            allUnits[u].combat_type, allUnits[u].name, allUnits[u].url, allUnits[u].alignment, allUnits[u].role, allUnits[u].categories.toString(), imgName]);

        

        await units.saveImageFromURL(imgRootURL, publicFolder, imgName);
    }

    return;

} 

export default units;