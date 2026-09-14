import runSQL from "./database.js";

let rote_planner = {};

rote_planner.getPlans = async (id = null) => {

    let sql = "SELECT rp.id, rp.name, p.ally_name, rp.date_updated, up.ally_name AS updated_by, ";
    sql += "  rp.phase_1, rp.phase_2, rp.phase_3, rp.phase_4, rp.phase_5, rp.phase_6 ";
    sql += "FROM rote_planner rp ";
    sql += "INNER JOIN player p ";
    sql += " ON rp.ally_code = p.ally_code ";
    sql += "INNER JOIN player up ";
    sql += " ON rp.updated_by = up.ally_code ";

    const params = [];
    if (id !== null) {
        sql += "WHERE rp.id = ? ";
        params.push(id);
    }

    sql += "ORDER BY rp.date_updated";

    const raw_plans = await runSQL(sql, params);

    const plans = raw_plans.map((planData) => {
        return {
            id: planData.id,
            name: planData.name,
            ally_name: planData.ally_name,
            date_updated: planData.date_updated,
            updated_by: planData.updated_by,
            planets: {
                '1': JSON.parse(planData.phase_1),
                '2': JSON.parse(planData.phase_2),
                '3': JSON.parse(planData.phase_3),
                '4': JSON.parse(planData.phase_4),
                '5': JSON.parse(planData.phase_5),
                '6': JSON.parse(planData.phase_6)
            }
        };
    });

    return plans;
}

rote_planner.createPlan = async (planData, ally_code) => {

    let sql = "INSERT INTO rote_planner (name, ally_code, date_updated, updated_by, phase_1, phase_2, phase_3, phase_4, phase_5, phase_6) ";
    sql += "VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)";

    const result = await runSQL(sql, [
        planData.name,
        ally_code,
        ally_code,
        planData.plan.planets['1'],
        planData.plan.planets['2'],
        planData.plan.planets['3'],
        planData.plan.planets['4'],
        planData.plan.planets['5'],
        planData.plan.planets['6']
    ]);

    const newPlan = await rote_planner.getPlans(result.insertId);
    return newPlan[0];
}

rote_planner.updatePlan = async (id, planData, ally_code) => {

    let sql = "UPDATE rote_planner SET name = ?, date_updated = NOW(), updated_by = ?, phase_1 = ?, phase_2 = ?, phase_3 = ?, phase_4 = ?, phase_5 = ?, phase_6 = ? ";
    sql += "WHERE id = ?";

    await runSQL(sql, [
        planData.name,
        ally_code,
        planData.plan.planets['1'],
        planData.plan.planets['2'],
        planData.plan.planets['3'],
        planData.plan.planets['4'],
        planData.plan.planets['5'],
        planData.plan.planets['6'],
        id
    ]);

    const newPlan = await rote_planner.getPlans(id);
    return newPlan[0];
}

rote_planner.deletePlan = async (id) => {

    let sql = "DELETE FROM rote_planner WHERE id = ?";

    await runSQL(sql, [id]);

    return "true";
}

export default rote_planner;