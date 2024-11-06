import runSQL from "./database.js";

let teams = {};

teams.get = async (ally_code, team_type) => {

    let all_teams = {}
    all_teams.defenceFive = await teams.getTeams(ally_code, team_type, false, 5);
    all_teams.offenceFive = await teams.getTeams(ally_code, team_type, true, 5);

    if(team_type === "gac"){
        all_teams.offenceThree = await teams.getTeams(ally_code, team_type, true, 3);
        all_teams.defenceThree = await teams.getTeams(ally_code, team_type, false, 3);
    } else {
        all_teams.overviewFive = await teams.getTWOverview(ally_code);
    }

    return all_teams;

}

teams.set = async (teamType, teamSize, teamPost, offence, defence) => {

    for(var t = teamPost.length; t < 5; t++){
        teamPost[t] = null;
    }
    
    const teamSql = "INSERT INTO team (base_id_1, base_id_2, base_id_3, base_id_4, base_id_5, list_order, defense, offense, team_size, team_type)" +
                "SELECT ?, ?, ?, ?, ?, IFNULL(MAX(list_order), 0) + 1, ?, ?, ?, ? FROM team";
    
    await runSQL(teamSql, [teamPost[0], teamPost[1], teamPost[2], teamPost[3], teamPost[4], 
            defence, offence, teamSize === "Three" ? 3 : 5, teamType]);
            
}

teams.getTWOverview = async (ally_code) => {

    let sql = "SELECT guild_id FROM player WHERE ally_code = ?";
    
    const guild_id = await runSQL(sql, [ally_code]);

    sql = "SELECT u.base_id, u.alignment, u.unit_image, 2 AS relic_tier, 7 AS rarity, ";
    sql += "     13 AS gear_level, 0 AS gear_level_plus, 85 AS level, 0 AS zeta_abilities, 0 AS omicron_abilities, "
    sql += "    CASE u.alignment WHEN 1 THEN 'neutral' WHEN 2 THEN 'light' ELSE 'dark' END as alignment_label, ";
    sql += "    CONCAT(u.character_name, ' (', CAST(COUNT(*) AS varchar(3)), ')') AS character_name "; //cast to string BigInt json issue
    sql += "    FROM team t ";
    sql += "    CROSS JOIN player p ";
    sql += "    INNER JOIN unit u ";
    sql += "        ON u.base_id = t.base_id_1 ";
    sql += "    INNER JOIN player_unit pu1 ";
    sql += "        ON	pu1.base_id = t.base_id_1 ";
    sql += "        AND pu1.ally_code = p.ally_code ";
    sql += "        AND pu1.relic_tier > 1 ";
    sql += "    INNER JOIN player_unit pu2 ";
    sql += "        ON	pu2.base_id = t.base_id_2 ";
    sql += "        AND pu2.ally_code = p.ally_code ";
    sql += "        AND pu2.relic_tier > 1 ";
    sql += "    INNER JOIN player_unit pu3 ";
    sql += "        ON	pu3.base_id = t.base_id_3 ";
    sql += "        AND pu3.ally_code = p.ally_code ";
    sql += "        AND pu3.relic_tier > 1 ";
    sql += "    INNER JOIN player_unit pu4 ";
    sql += "        ON	pu4.base_id = t.base_id_4 ";
    sql += "        AND pu4.ally_code = p.ally_code ";
    sql += "        AND pu4.relic_tier > 1 ";
    sql += "    INNER JOIN player_unit pu5 ";
    sql += "        ON	pu5.base_id = t.base_id_5 ";
    sql += "        AND pu5.ally_code = p.ally_code ";
    sql += "        AND pu5.relic_tier > 1 ";
    sql += "    WHERE t.team_type = 'tw' ";
    sql += "    AND	t.defense = 1 ";
    sql += "    AND p.guild_id = ? "
    sql += "    GROUP BY u.base_id, u.alignment, u.unit_image, u.character_name ";

    const rows = await runSQL(sql, [guild_id[0].guild_id]);
    
    return rows;


}

teams.getTeams = async (ally_code, team_type, offence_team, team_size) => {

    let sql = "SELECT t.list_order, t.defense, t.offense, t.team_id, CONCAT(u1.character_name, ' Team') AS team_name, ";
    sql += "    u1.base_id AS base_id_1, u1.character_name AS character_name_1, u1.alignment AS alignment_1, u1.unit_image AS unit_image_1, CASE u1.alignment WHEN 1 THEN 'neutral' WHEN 2 THEN 'light' ELSE 'dark' END as alignment_label_1, ";
    sql += "    u2.base_id AS base_id_2, u2.character_name AS character_name_2, u2.alignment AS alignment_2, u2.unit_image AS unit_image_2, CASE u2.alignment WHEN 1 THEN 'neutral' WHEN 2 THEN 'light' ELSE 'dark' END as alignment_label_2, ";
    sql += "    u3.base_id AS base_id_3, u3.character_name AS character_name_3, u3.alignment AS alignment_3, u3.unit_image AS unit_image_3, CASE u3.alignment WHEN 1 THEN 'neutral' WHEN 2 THEN 'light' ELSE 'dark' END as alignment_label_3, ";
    sql += "    u4.base_id AS base_id_4, u4.character_name AS character_name_4, u4.alignment AS alignment_4, u4.unit_image AS unit_image_4, CASE u4.alignment WHEN 1 THEN 'neutral' WHEN 2 THEN 'light' ELSE 'dark' END as alignment_label_4, ";
    sql += "    u5.base_id AS base_id_5, u5.character_name AS character_name_5, u5.alignment AS alignment_5, u5.unit_image AS unit_image_5, CASE u5.alignment WHEN 1 THEN 'neutral' WHEN 2 THEN 'light' ELSE 'dark' END as alignment_label_5, ";
    sql += "    pu1.gear_level AS gear_level_1, pu1.gear_level_plus AS gear_level_plus_1, pu1.`level` AS level_1, pu1.`power` AS power_1, pu1.zeta_abilities AS zeta_abilities_1, pu1.omicron_abilities AS omicron_abilities_1, pu1.relic_tier AS relic_tier_1, pu1.rarity AS rarity_1, ";
    sql += "    pu2.gear_level AS gear_level_2, pu2.gear_level_plus AS gear_level_plus_2, pu2.`level` AS level_2, pu2.`power` AS power_2, pu2.zeta_abilities AS zeta_abilities_2, pu2.omicron_abilities AS omicron_abilities_2, pu2.relic_tier AS relic_tier_2, pu2.rarity AS rarity_2, ";
    sql += "    pu3.gear_level AS gear_level_3, pu3.gear_level_plus AS gear_level_plus_3, pu3.`level` AS level_3, pu3.`power` AS power_3, pu3.zeta_abilities AS zeta_abilities_3, pu3.omicron_abilities AS omicron_abilities_3, pu3.relic_tier AS relic_tier_3, pu3.rarity AS rarity_3, ";
    sql += "    pu4.gear_level AS gear_level_4, pu4.gear_level_plus AS gear_level_plus_4, pu4.`level` AS level_4, pu4.`power` AS power_4, pu4.zeta_abilities AS zeta_abilities_4, pu4.omicron_abilities AS omicron_abilities_4, pu4.relic_tier AS relic_tier_4, pu4.rarity AS rarity_4, ";
    sql += "    pu5.gear_level AS gear_level_5, pu5.gear_level_plus AS gear_level_plus_5, pu5.`level` AS level_5, pu5.`power` AS power_5, pu5.zeta_abilities AS zeta_abilities_5, pu5.omicron_abilities AS omicron_abilities_5, pu5.relic_tier AS relic_tier_5, pu5.rarity AS rarity_5, ";
    sql += "    CASE WHEN u1.base_id IS NOT NULL THEN 1 ELSE 0 END + ";
    sql += "    CASE WHEN u2.base_id IS NOT NULL THEN 1 ELSE 0 END + ";
    sql += "    CASE WHEN u3.base_id IS NOT NULL THEN 1 ELSE 0 END + ";
    sql += "    CASE WHEN u4.base_id IS NOT NULL THEN 1 ELSE 0 END + ";
    sql += "    CASE WHEN u5.base_id IS NOT NULL THEN 1 ELSE 0 END AS team_count, ";
    sql += "    CASE WHEN pu1.base_id IS NOT NULL THEN 1 ELSE 0 END + ";
    sql += "    CASE WHEN pu2.base_id IS NOT NULL THEN 1 ELSE 0 END + ";
    sql += "    CASE WHEN pu3.base_id IS NOT NULL THEN 1 ELSE 0 END + ";
    sql += "    CASE WHEN pu4.base_id IS NOT NULL THEN 1 ELSE 0 END + ";
    sql += "    CASE WHEN pu5.base_id IS NOT NULL THEN 1 ELSE 0 END AS player_team_count, ";
    sql += "    CAST(IFNULL(pu1.`power`, 0) + IFNULL(pu2.`power`, 0) + IFNULL(pu3.`power`, 0) + IFNULL(pu4.`power`, 0) + IFNULL(pu5.`power`, 0) AS varchar(32)) AS team_power "
    sql += "FROM team t ";
    sql += "INNER JOIN unit u1 ";
    sql += "    ON t.base_id_1 = u1.base_id ";
    sql += "LEFT OUTER JOIN unit u2 ";
    sql += "    ON t.base_id_2 = u2.base_id ";
    sql += "LEFT OUTER JOIN unit u3 ";
    sql += "    ON t.base_id_3 = u3.base_id ";
    sql += "LEFT OUTER JOIN unit u4 ";
    sql += "    ON t.base_id_4 = u4.base_id ";
    sql += "LEFT OUTER JOIN unit u5 ";
    sql += "    ON t.base_id_5 = u5.base_id ";
    sql += "LEFT OUTER JOIN player_unit pu1 ";
    sql += "    ON t.base_id_1 = pu1.base_id ";
    sql += "    AND pu1.ally_code = ? ";
    sql += "LEFT OUTER JOIN player_unit pu2 ";
    sql += "    ON t.base_id_2 = pu2.base_id ";
    sql += "    AND pu2.ally_code = ? ";
    sql += "LEFT OUTER JOIN player_unit pu3 ";
    sql += "    ON t.base_id_3 = pu3.base_id ";
    sql += "    AND pu3.ally_code = ? ";
    sql += "LEFT OUTER JOIN player_unit pu4 ";
    sql += "    ON t.base_id_4 = pu4.base_id ";
    sql += "    AND pu4.ally_code = ? ";
    sql += "LEFT OUTER JOIN player_unit pu5 ";
    sql += "    ON t.base_id_5 = pu5.base_id ";
    sql += "    AND pu5.ally_code = ? ";
    sql += "WHERE t.team_size = ? ";
    sql += "AND t.team_type = ? ";
    if(offence_team){
        sql += "AND t.offense = 1 ";
    } else {
        sql += "AND t.defense = 1 ";
    }
    sql += "ORDER BY team_count - player_team_count,  CAST(team_power AS int) DESC";

    const rows = await runSQL(sql, [ally_code,ally_code,ally_code,ally_code,ally_code,team_size,team_type]);
    
    return rows;
}


export default teams;