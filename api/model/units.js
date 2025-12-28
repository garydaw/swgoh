import runSQL from "./database.js";
import axios, { all } from "axios";
import fs from "fs";

const imgRootURL = 'https://game-assets.swgoh.gg/textures/'
const publicFolder = process.env.PUBLIC_FOLDER
const siteRootURL = process.env.SWGOH_URL

const isLocal = process.env.FRONTEND_DOMAIN === 'http://localhost:5173' ? true : false;

let units = {};

units.get = async (ally_code, base_id, combat_type) => {

    let sql = "";
    sql += "SELECT u.base_id, u.character_name, u.alignment, u.role, ";
    sql += "        u.categories, u.unit_image, ";
    sql += "        pu.gear_level, pu.gear_level_plus, pu.gear_level_flags, ";
    sql += "        pu.level, pu.power, pu.rarity, pu.zeta_abilities, pu.omicron_abilities, ";
    sql += "        pu.relic_tier, pu.has_ultimate, u.is_galactic_legend, "
    sql += "        CASE u.alignment WHEN 1 THEN 'neutral' WHEN 2 THEN 'light' ELSE 'dark' END as alignment_label "
    if(base_id != "") {
        sql += ", ";
        sql += "MAX(CASE WHEN pm.slot_id = 2 THEN s.slot_name END) AS slot1, ";
        sql += "MAX(CASE WHEN pm.slot_id = 3 THEN s.slot_name END) AS slot2, ";
        sql += "MAX(CASE WHEN pm.slot_id = 4 THEN s.slot_name END) AS slot3, ";
        sql += "MAX(CASE WHEN pm.slot_id = 5 THEN s.slot_name END) AS slot4, ";
        sql += "MAX(CASE WHEN pm.slot_id = 6 THEN s.slot_name END) AS slot5, ";
        sql += "MAX(CASE WHEN pm.slot_id = 7 THEN s.slot_name END) AS slot6, ";
        sql += "MAX(CASE WHEN pm.slot_id = 2 THEN pm.rarity END) AS rarity1, ";
        sql += "MAX(CASE WHEN pm.slot_id = 3 THEN pm.rarity END) AS rarity2, ";
        sql += "MAX(CASE WHEN pm.slot_id = 4 THEN pm.rarity END) AS rarity3, ";
        sql += "MAX(CASE WHEN pm.slot_id = 5 THEN pm.rarity END) AS rarity4, ";
        sql += "MAX(CASE WHEN pm.slot_id = 6 THEN pm.rarity END) AS rarity5, ";
        sql += "MAX(CASE WHEN pm.slot_id = 7 THEN pm.rarity END) AS rarity6, ";
        sql += "MAX(CASE WHEN pm.slot_id = 2 THEN pm.tier END) AS tier1, ";
        sql += "MAX(CASE WHEN pm.slot_id = 3 THEN pm.tier END) AS tier2, ";
        sql += "MAX(CASE WHEN pm.slot_id = 4 THEN pm.tier END) AS tier3, ";
        sql += "MAX(CASE WHEN pm.slot_id = 5 THEN pm.tier END) AS tier4, ";
        sql += "MAX(CASE WHEN pm.slot_id = 6 THEN pm.tier END) AS tier5, ";
        sql += "MAX(CASE WHEN pm.slot_id = 7 THEN pm.tier END) AS tier6, ";
        sql += "MAX(CASE WHEN pm.slot_id = 2 THEN gs.group_set_name END) AS set1, ";
        sql += "MAX(CASE WHEN pm.slot_id = 3 THEN gs.group_set_name END) AS set2, ";
        sql += "MAX(CASE WHEN pm.slot_id = 4 THEN gs.group_set_name END) AS set3, ";
        sql += "MAX(CASE WHEN pm.slot_id = 5 THEN gs.group_set_name END) AS set4, ";
        sql += "MAX(CASE WHEN pm.slot_id = 6 THEN gs.group_set_name END) AS set5, ";
        sql += "MAX(CASE WHEN pm.slot_id = 7 THEN gs.group_set_name END) AS set6, ";
        sql += "MAX(CASE WHEN pm.slot_id = 2 THEN CONCAT(pm.primary_stat_value, ' ', pm.primary_stat) END) AS primary1, ";
        sql += "MAX(CASE WHEN pm.slot_id = 3 THEN CONCAT(pm.primary_stat_value, ' ', pm.primary_stat) END) AS primary2, ";
        sql += "MAX(CASE WHEN pm.slot_id = 4 THEN CONCAT(pm.primary_stat_value, ' ', pm.primary_stat) END) AS primary3, ";
        sql += "MAX(CASE WHEN pm.slot_id = 5 THEN CONCAT(pm.primary_stat_value, ' ', pm.primary_stat) END) AS primary4, ";
        sql += "MAX(CASE WHEN pm.slot_id = 6 THEN CONCAT(pm.primary_stat_value, ' ', pm.primary_stat) END) AS primary5, ";
        sql += "MAX(CASE WHEN pm.slot_id = 7 THEN CONCAT(pm.primary_stat_value, ' ', pm.primary_stat) END) AS primary6, ";
        sql += "MAX(CASE WHEN pm.slot_id = 2 THEN CONCAT(pm.secondary_stat_1_value, ' ', pm.secondary_stat_1) END) AS secondaryOne1, ";
        sql += "MAX(CASE WHEN pm.slot_id = 3 THEN CONCAT(pm.secondary_stat_1_value, ' ', pm.secondary_stat_1) END) AS secondaryOne2, ";
        sql += "MAX(CASE WHEN pm.slot_id = 4 THEN CONCAT(pm.secondary_stat_1_value, ' ', pm.secondary_stat_1) END) AS secondaryOne3, ";
        sql += "MAX(CASE WHEN pm.slot_id = 5 THEN CONCAT(pm.secondary_stat_1_value, ' ', pm.secondary_stat_1) END) AS secondaryOne4, ";
        sql += "MAX(CASE WHEN pm.slot_id = 6 THEN CONCAT(pm.secondary_stat_1_value, ' ', pm.secondary_stat_1) END) AS secondaryOne5, ";
        sql += "MAX(CASE WHEN pm.slot_id = 7 THEN CONCAT(pm.secondary_stat_1_value, ' ', pm.secondary_stat_1) END) AS secondaryOne6, ";
        sql += "MAX(CASE WHEN pm.slot_id = 2 THEN CONCAT(pm.secondary_stat_2_value, ' ', pm.secondary_stat_2) END) AS secondaryTwo1, ";
        sql += "MAX(CASE WHEN pm.slot_id = 3 THEN CONCAT(pm.secondary_stat_2_value, ' ', pm.secondary_stat_2) END) AS secondaryTwo2, ";
        sql += "MAX(CASE WHEN pm.slot_id = 4 THEN CONCAT(pm.secondary_stat_2_value, ' ', pm.secondary_stat_2) END) AS secondaryTwo3, ";
        sql += "MAX(CASE WHEN pm.slot_id = 5 THEN CONCAT(pm.secondary_stat_2_value, ' ', pm.secondary_stat_2) END) AS secondaryTwo4, ";
        sql += "MAX(CASE WHEN pm.slot_id = 6 THEN CONCAT(pm.secondary_stat_2_value, ' ', pm.secondary_stat_2) END) AS secondaryTwo5, ";
        sql += "MAX(CASE WHEN pm.slot_id = 7 THEN CONCAT(pm.secondary_stat_2_value, ' ', pm.secondary_stat_2) END) AS secondaryTwo6, ";
        sql += "MAX(CASE WHEN pm.slot_id = 2 THEN CONCAT(pm.secondary_stat_3_value, ' ', pm.secondary_stat_3) END) AS secondaryThree1, ";
        sql += "MAX(CASE WHEN pm.slot_id = 3 THEN CONCAT(pm.secondary_stat_3_value, ' ', pm.secondary_stat_3) END) AS secondaryThree2, ";
        sql += "MAX(CASE WHEN pm.slot_id = 4 THEN CONCAT(pm.secondary_stat_3_value, ' ', pm.secondary_stat_3) END) AS secondaryThree3, ";
        sql += "MAX(CASE WHEN pm.slot_id = 5 THEN CONCAT(pm.secondary_stat_3_value, ' ', pm.secondary_stat_3) END) AS secondaryThree4, ";
        sql += "MAX(CASE WHEN pm.slot_id = 6 THEN CONCAT(pm.secondary_stat_3_value, ' ', pm.secondary_stat_3) END) AS secondaryThree5, ";
        sql += "MAX(CASE WHEN pm.slot_id = 7 THEN CONCAT(pm.secondary_stat_3_value, ' ', pm.secondary_stat_3) END) AS secondaryThree6, ";
        sql += "MAX(CASE WHEN pm.slot_id = 2 THEN CONCAT(pm.secondary_stat_4_value, ' ', pm.secondary_stat_4) END) AS secondaryFour1, ";
        sql += "MAX(CASE WHEN pm.slot_id = 3 THEN CONCAT(pm.secondary_stat_4_value, ' ', pm.secondary_stat_4) END) AS secondaryFour2, ";
        sql += "MAX(CASE WHEN pm.slot_id = 4 THEN CONCAT(pm.secondary_stat_4_value, ' ', pm.secondary_stat_4) END) AS secondaryFour3, ";
        sql += "MAX(CASE WHEN pm.slot_id = 5 THEN CONCAT(pm.secondary_stat_4_value, ' ', pm.secondary_stat_4) END) AS secondaryFour4, ";
        sql += "MAX(CASE WHEN pm.slot_id = 6 THEN CONCAT(pm.secondary_stat_4_value, ' ', pm.secondary_stat_4) END) AS secondaryFour5, ";
        sql += "MAX(CASE WHEN pm.slot_id = 7 THEN CONCAT(pm.secondary_stat_4_value, ' ', pm.secondary_stat_4) END) AS secondaryFour6, ";
        sql += "MAX(CASE WHEN pm.slot_id = 2 THEN um3.primary_stat END) AS bestMod1, ";
        sql += "MAX(CASE WHEN pm.slot_id = 3 THEN um3.primary_stat END) AS bestMod2, ";
        sql += "MAX(CASE WHEN pm.slot_id = 4 THEN um3.primary_stat END) AS bestMod3, ";
        sql += "MAX(CASE WHEN pm.slot_id = 5 THEN um3.primary_stat END) AS bestMod4, ";
        sql += "MAX(CASE WHEN pm.slot_id = 6 THEN um3.primary_stat END) AS bestMod5, ";
        sql += "MAX(CASE WHEN pm.slot_id = 7 THEN um3.primary_stat END) AS bestMod6, ";
        sql += "MAX(CASE WHEN pm.slot_id = 2 THEN um3.primary_stat = pm.primary_stat END) AS modMatch1, ";
        sql += "MAX(CASE WHEN pm.slot_id = 3 THEN um3.primary_stat = pm.primary_stat END) AS modMatch2, ";
        sql += "MAX(CASE WHEN pm.slot_id = 4 THEN um3.primary_stat = pm.primary_stat END) AS modMatch3, ";
        sql += "MAX(CASE WHEN pm.slot_id = 5 THEN um3.primary_stat = pm.primary_stat END) AS modMatch4, ";
        sql += "MAX(CASE WHEN pm.slot_id = 6 THEN um3.primary_stat = pm.primary_stat END) AS modMatch5, ";
        sql += "MAX(CASE WHEN pm.slot_id = 7 THEN um3.primary_stat = pm.primary_stat END) AS modMatch6 ";
    }
    sql += "FROM player_unit pu ";
    sql += "INNER JOIN unit u ";
    sql += "    ON pu.base_id = u.base_id ";
    if(base_id != "") {
     sql += "    LEFT JOIN player_mod pm "
	 sql += "       ON pu.base_id = pm.base_id "
	 sql += "       AND pu.ally_code = pm.ally_code "
     sql += "    LEFT JOIN slot s "
	 sql += "       ON s.slot_id = pm.slot_id "
     sql += "    LEFT JOIN group_set gs "
	 sql += "       ON gs.group_set_id = pm.group_set_id "
     sql += "    LEFT JOIN ( "
     sql += "       SELECT um.slot_id, um.base_id, um.primary_stat "
     sql += "       FROM unit_mod um "
     sql += "       INNER JOIN ( "
     sql += "           SELECT slot_id, base_id, MAX(date) AS max_date "
     sql += "           FROM unit_mod "
     sql += "           GROUP BY slot_id, base_id "
     sql += "       ) AS um2 "
     sql += "       ON um.slot_id = um2.slot_id "
     sql += "       AND um.base_id = um2.base_id "
     sql += "       AND um.date = um2.max_date "
     sql += "    ) AS um3 "
     sql += "       ON um3.slot_id = pm.slot_id "
     sql += "       AND um3.base_id = pm.base_id ";
    }
    sql += "WHERE pu.ally_code = ? ";
    sql += "AND u.combat_type = ? ";
    if(base_id != "")
        sql += "AND u.base_id = ? ";
    sql += "GROUP BY u.base_id, u.character_name, u.alignment, u.role, ";
    sql += "        u.categories, u.unit_image, ";
    sql += "        pu.gear_level, pu.gear_level_plus, pu.gear_level_flags, ";
    sql += "        pu.level, pu.power, pu.rarity, pu.zeta_abilities, pu.omicron_abilities, ";
    sql += "        pu.relic_tier, pu.has_ultimate, u.is_galactic_legend "
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

units.getGuildUnits = async (ally_code, base_id, combat_type) => {

    let sql = "";
    sql += "SELECT u.base_id,  p.ally_name as character_name, u.alignment, u.unit_image, ";
    sql += "        pu.gear_level, pu.gear_level_plus, pu.gear_level_flags, ";
    sql += "        pu.level, pu.power, pu.rarity, pu.zeta_abilities, pu.omicron_abilities, ";
    sql += "        pu.relic_tier, pu.has_ultimate, u.is_galactic_legend, "
    sql += "        CASE u.alignment WHEN 1 THEN 'neutral' WHEN 2 THEN 'light' ELSE 'dark' END as alignment_label, "
    sql += "        p.ally_code, p.ally_name "
    sql += "FROM player p "
    sql += "INNER JOIN player_unit pu ";
    sql += "    ON p.ally_code = pu.ally_code ";
    sql += "INNER JOIN unit u ";
    sql += "    ON pu.base_id = u.base_id ";
    sql += "WHERE p.guild_id = ( SELECT guild_id FROM player WHERE ally_code = ?) ";
    sql += "AND u.combat_type = ? ";
    sql += "AND u.base_id = ? ";
    sql += "GROUP BY u.base_id, u.alignment, u.unit_image, ";
    sql += "        pu.gear_level, pu.gear_level_plus, pu.gear_level_flags, ";
    sql += "        pu.level, pu.power, pu.rarity, pu.zeta_abilities, pu.omicron_abilities, ";
    sql += "        pu.relic_tier, pu.has_ultimate, u.is_galactic_legend "
    sql += "ORDER BY pu.gear_level DESC, pu.relic_tier DESC, pu.power DESC, p.ally_code ";

    const rows= await runSQL(sql, [ally_code, combat_type, base_id]);

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

    const allUnits = data.data;
   
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