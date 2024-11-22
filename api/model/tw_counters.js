import runSQL from "./database.js";

let tw_counters = {};

tw_counters.get = async () => {

    let sql = "SELECT u.base_id, IFNULL(twc.counter, 'No counters available') AS counters, u.character_name, u.unit_image ";
    sql += "FROM unit u ";
    sql += "LEFT OUTER JOIN tw_counters twc ";
    sql += " ON twc.base_id = u.base_id ";
    sql += "WHERE u.categories LIKE '%Leader%' "
    sql += "AND IFNULL(twc.is_current,1) = 1 "
    sql += "ORDER BY u.character_name";

    const counters = await runSQL(sql, []);
    
    return counters;
}

tw_counters.set = async (data) => {

    let sql = "UPDATE tw_counters SET is_current = 0 WHERE base_id = ?";

    await runSQL(sql, [data.base_id]);
    
    sql = "INSERT INTO tw_counters (base_id, counter) VALUES (?, ?)";

    await runSQL(sql, [data.base_id, data.counters]);

    return;
} 

export default tw_counters;