import runSQL from "./database.js";
import axios, { all } from "axios";
import fs from "fs";

const imgRootURL = 'https://game-assets.swgoh.gg/textures/'
const publicFolder = process.env.PUBLIC_FOLDER

const isLocal = process.env.FRONTEND_DOMAIN === 'http://localhost:5173' ? true : false;

let gameData = {};

gameData.checkisLatestMetadata = async (type, version) => {

    const sql = "SELECT version, date_run, DATE_FORMAT(date_run, '%D %b %Y') AS date_run_formatted FROM metadata WHERE type = ? ORDER BY date_run DESC LIMIT 1;";

    const latestMetadata = await runSQL(sql, [type]);

    let check = {}
    check.isLatest = latestMetadata.length > 0 && latestMetadata[0].version === version;
    check.date_run = latestMetadata.length > 0 ? latestMetadata[0].date_run : null;
    check.date_run_formatted = latestMetadata.length > 0 ? latestMetadata[0].date_run_formatted : null;
    return check;
}

gameData.setLatestMetadata = async (type, version) => {

    const sql = "INSERT INTO metadata (type, version) VALUES (?, ?);";

    await runSQL(sql, [type, version]);
}

gameData.clearLocalization = async () => {

  const sql = "DELETE FROM localizations;"

  await runSQL(sql, []);

  return;
}

gameData.addLocalization = async(key, value) => {

  const sql = "INSERT INTO localizations (key_value, value) VALUES (?, ?);";

  await runSQL(sql, [key, value]);

  return;
}

gameData.getLocalizations = async () => {

  const sql = "SELECT key_value, value FROM localizations;" 

  return await runSQL(sql, []);
}

gameData.clearCategory = async (descKey) => {

  let sql = "DELETE FROM category "

  if(descKey) {
    sql += "WHERE descKey = ?;"
  } else {
    sql += ";"
  }
  
  await runSQL(sql, [descKey]);
}

gameData.addCategory = async(id, descKey, visible) => {

  const sql = "INSERT INTO category (id, descKey, visible) VALUES (?, ?, ?);";

  await runSQL(sql, [id, descKey, visible]);

  return;
}

gameData.getCategories = async () => {

  const sql = "SELECT id, descKey FROM category;"

  return await runSQL(sql, []);
}

gameData.saveImageFromURL = async (filename) => {
    try {
      const response = await axios({
          url: imgRootURL + filename,
          method: 'GET',
          responseType: 'stream',
      });

      // Create a write stream to save the file
      const writer = fs.createWriteStream(publicFolder + filename);

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

gameData.addUnit = async (unit) => {

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

      await runSQL(sql, [unit.base_id,
                          unit.combat_type, unit.name, unit.url, unit.alignment, unit.role, unit.categories.toString(), unit.unit_image,
                          unit.is_galactic_legend,
                          unit.combat_type, unit.name, unit.url, unit.alignment, unit.role, unit.categories.toString(), unit.unit_image,
                          unit.is_galactic_legend]);

      
      if(isLocal){
          await gameData.saveImageFromURL(unit.unit_image);
      }
    

    return;

}

export default gameData;