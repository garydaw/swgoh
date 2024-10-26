import runSQL from "./database.js";

let journeys = {};

journeys.get = async () => {

    let sql = "SELECT jg.base_id, jg.guide, u.character_name ";
    sql += "FROM journey_guide jg ";
    sql += "INNER JOIN unit u";
    sql += " ON jg.base_id = u.base_id ";
    sql += "ORDER BY u.character_name";

    const guides = await runSQL(sql, []);
    
    return guides;
}

export default journeys;