import runSQL from "./database.js";

let journeys = {};

journeys.get = async () => {

    let sql = "SELECT u.base_id, IFNULL(jg.guide, 'No guide available') AS guide, u.character_name, u.unit_image ";
    sql += "FROM unit u ";
    sql += "LEFT OUTER JOIN journey_guide jg ";
    sql += " ON jg.base_id = u.base_id ";
    sql += "WHERE IFNULL(jg.is_current,1) = 1 "
    sql += "ORDER BY u.character_name";

    const guides = await runSQL(sql, []);
    
    return guides;
}

journeys.set = async (data) => {

    let sql = "UPDATE journey_guide SET is_current = 0 WHERE base_id = ?";

    await runSQL(sql, [data.base_id]);
    
    sql = "INSERT INTO journey_guide (base_id, list_order, guide) VALUES (?, 1, ?)";

    await runSQL(sql, [data.base_id, data.guide]);

    return;
} 

export default journeys;