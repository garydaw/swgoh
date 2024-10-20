import runSQL from "./database.js";
import axios from 'axios';
import fs from 'fs';

const siteRootURL = 'https://swgoh.gg/';
const imgRootURL = 'https://game-assets.swgoh.gg/textures/'
const publicFolder = "C:\\Users\\garyd\\Documents\\code\\swgoh\\public\\images\\units\\";

let swgoh = {};

swgoh.refreshUnits = async () => {

    const response = await axios.get(siteRootURL + 'api/units');

    const units = response.data.data;

    //loop round units
    for(var u = 0; u < units.length; u++){
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

        const imgName = units[u].image.split("/").pop();
        await runSQL(sql, [units[u].base_id,
                            units[u].combat_type, units[u].name, units[u].url, units[u].alignment, units[u].role, units[u].categories.toString(), imgName,
                            units[u].combat_type, units[u].name, units[u].url, units[u].alignment, units[u].role, units[u].categories.toString(), imgName]);

        

        await swgoh.saveImageFromURL(imgRootURL, publicFolder, imgName);
    }

    return;

} 

swgoh.saveImageFromURL = async (url, path, filename) => {
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


export default swgoh;