import runSQL from "./database.js";

let journeys = {};

journeys.get = async () => {

    let sql = "SELECT u.base_id, IFNULL(jg.guide, 'No guide available') AS guide, u.character_name, u.unit_image ";
    sql += "FROM unit u ";
    sql += "LEFT OUTER JOIN journey_guide jg ";
    sql += " ON jg.base_id = u.base_id ";
    sql += "WHERE u.is_galactic_legend = 1 "
    sql += "ORDER BY u.character_name";

    const guides = await runSQL(sql, []);
    
    return guides;
}

export default journeys;