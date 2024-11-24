
import runSQL from "./database.js";

let migrations = {};

migrations.run = async (version) => {

    switch(version){
        case "1":
            await versionOne();
            break;
        case "2":
            await versionTwo();
            break;
        case "3":
            await versionThree();
            break;
        case "4":
            await versionFour();
            break;
        default:
            console.log("doh!");
    }

} 

async function versionFour (){

    console.log("add is_galactic_legend to unit");
    await runSQL("ALTER TABLE unit ADD IF NOT EXISTS is_galactic_legend boolean NOT NULL DEFAULT false");

    console.log("update existing GLs");
    await runSQL("UPDATE unit SET is_galactic_legend = true WHERE base_id IN ('GLLEIA','GLREY','GRANDMASTERLUKE','JABBATHEHUTT','JEDIMASTERKENOBI','LORDVADER','SITHPALPATINE','SUPREMELEADERKYLOREN')");

    console.log("add history of jounery guides");
    await runSQL("ALTER TABLE journey_guide ADD IF NOT EXISTS date_added DATETIME NOT NULL DEFAULT now()");
    await runSQL("ALTER TABLE journey_guide ADD IF NOT EXISTS is_current boolean NOT NULL DEFAULT true");

    await runSQL("ALTER TABLE journey_guide DROP PRIMARY KEY, ADD PRIMARY KEY (base_id, date_added)");

    console.log("creating rote_planets");
    await runSQL("CREATE TABLE IF NOT EXISTS rote_planets ("+
        "path VARCHAR(64) NOT NULL, "+
        "phase int NOT NULL, "+
        "planet VARCHAR(64) NOT NULL, "+
        "primary key(path, phase) "+
        ");");

    console.log("add rote_planets data");
    await runSQL("INSERT INTO rote_planets (path, phase, planet) SELECT 'light', 1, 'Coruscant' WHERE 'light' NOT IN (SELECT path FROM rote_planets WHERE phase = 1)");
    await runSQL("INSERT INTO rote_planets (path, phase, planet) SELECT 'light', 2, 'Bracca' WHERE 'light' NOT IN (SELECT path FROM rote_planets WHERE phase = 2)");
    await runSQL("INSERT INTO rote_planets (path, phase, planet) SELECT 'light', 3, 'Kashyyyk' WHERE 'light' NOT IN (SELECT path FROM rote_planets WHERE phase = 3)");
    await runSQL("INSERT INTO rote_planets (path, phase, planet) SELECT 'light', 4, 'Lothal' WHERE 'light' NOT IN (SELECT path FROM rote_planets WHERE phase = 4)");
    await runSQL("INSERT INTO rote_planets (path, phase, planet) SELECT 'light', 5, 'Ring of Kafrene' WHERE 'light' NOT IN (SELECT path FROM rote_planets WHERE phase = 5)");
    await runSQL("INSERT INTO rote_planets (path, phase, planet) SELECT 'light', 6, 'Scarif' WHERE 'light' NOT IN (SELECT path FROM rote_planets WHERE phase = 6)");
    await runSQL("INSERT INTO rote_planets (path, phase, planet) SELECT 'dark', 1, 'Mustafar' WHERE 'dark' NOT IN (SELECT path FROM rote_planets WHERE phase = 1)");
    await runSQL("INSERT INTO rote_planets (path, phase, planet) SELECT 'dark', 2, 'Geonosis' WHERE 'dark' NOT IN (SELECT path FROM rote_planets WHERE phase = 2)");
    await runSQL("INSERT INTO rote_planets (path, phase, planet) SELECT 'dark', 3, 'Dathomir' WHERE 'dark' NOT IN (SELECT path FROM rote_planets WHERE phase = 3)");
    await runSQL("INSERT INTO rote_planets (path, phase, planet) SELECT 'dark', 4, 'Haven Medical Station' WHERE 'dark' NOT IN (SELECT path FROM rote_planets WHERE phase = 4)");
    await runSQL("INSERT INTO rote_planets (path, phase, planet) SELECT 'dark', 5, 'Malachor' WHERE 'dark' NOT IN (SELECT path FROM rote_planets WHERE phase = 5)");
    await runSQL("INSERT INTO rote_planets (path, phase, planet) SELECT 'dark', 6, 'Death Star' WHERE 'dark' NOT IN (SELECT path FROM rote_planets WHERE phase = 6)");
    await runSQL("INSERT INTO rote_planets (path, phase, planet) SELECT 'neutral', 1, 'Corellia' WHERE 'neutral' NOT IN (SELECT path FROM rote_planets WHERE phase = 1)");
    await runSQL("INSERT INTO rote_planets (path, phase, planet) SELECT 'neutral', 2, 'Felucia' WHERE 'neutral' NOT IN (SELECT path FROM rote_planets WHERE phase = 2)");
    await runSQL("INSERT INTO rote_planets (path, phase, planet) SELECT 'neutral', 3, 'Tatooine' WHERE 'neutral' NOT IN (SELECT path FROM rote_planets WHERE phase = 3)");
    await runSQL("INSERT INTO rote_planets (path, phase, planet) SELECT 'neutral', 4, 'Kessel' WHERE 'neutral' NOT IN (SELECT path FROM rote_planets WHERE phase = 4)");
    await runSQL("INSERT INTO rote_planets (path, phase, planet) SELECT 'neutral', 5, 'Vandor' WHERE 'neutral' NOT IN (SELECT path FROM rote_planets WHERE phase = 5)");
    await runSQL("INSERT INTO rote_planets (path, phase, planet) SELECT 'neutral', 6, 'Hoth' WHERE 'neutral' NOT IN (SELECT path FROM rote_planets WHERE phase = 6)");

    console.log("creating tw counters");
    await runSQL("CREATE TABLE IF NOT EXISTS tw_counters ("+
        "base_id VARCHAR(64) NOT NULL, "+
        "counter text, " +
        "primary key(base_id), "+
        "CONSTRAINT fk_tw_counters__unit "+
        "FOREIGN KEY (base_id) REFERENCES unit (base_id) "+
        "ON DELETE CASCADE "+
        "ON UPDATE RESTRICT);");
        
    console.log("add history of tw_counters");
    await runSQL("ALTER TABLE tw_counters ADD IF NOT EXISTS date_added DATETIME NOT NULL DEFAULT now()");
    await runSQL("ALTER TABLE tw_counters ADD IF NOT EXISTS is_current boolean NOT NULL DEFAULT true");

    await runSQL("ALTER TABLE tw_counters DROP PRIMARY KEY, ADD PRIMARY KEY (base_id, date_added)");
    
    console.log("creating log table");
    await runSQL("CREATE TABLE IF NOT EXISTS log ("+
        "id int NOT NULL AUTO_INCREMENT, "+
        "ally_code int NOT NULL, "+
        "url VARCHAR(512) NOT NULL, "+
        "date_visited DATETIME NOT NULL DEFAULT now(), "+
        "primary key(id));");

        
    console.log("add history of tw_counters");
    await runSQL("ALTER TABLE tw_counters ADD IF NOT EXISTS date_added DATETIME NOT NULL DEFAULT now()");
    await runSQL("ALTER TABLE tw_counters ADD IF NOT EXISTS is_current boolean NOT NULL DEFAULT true");

    await runSQL("ALTER TABLE tw_counters DROP PRIMARY KEY, ADD PRIMARY KEY (base_id, date_added)");

}

async function versionThree (){

    console.log("starting version three");
    console.log("creating tw_wall");
    await runSQL("CREATE TABLE IF NOT EXISTS tw_wall ("+
        "tw_wall_id varchar(8) NOT NULL, "+
        "tw_wall_name varchar(32) NOT NULL, "+
        "combat_type int NOT NULL, "+
        "primary key(tw_wall_id) "+
        ");");

    console.log("add tw_wall data");
    await runSQL("INSERT INTO tw_wall (tw_wall_id, tw_wall_name, combat_type) SELECT 'FT', 'Front Wall Top', 1 WHERE 'FT' NOT IN (SELECT tw_wall_id FROM tw_wall)");
    await runSQL("INSERT INTO tw_wall (tw_wall_id, tw_wall_name, combat_type) SELECT 'FB', 'Front Wall Bottom', 1 WHERE 'FB' NOT IN (SELECT tw_wall_id FROM tw_wall)");
    await runSQL("INSERT INTO tw_wall (tw_wall_id, tw_wall_name, combat_type) SELECT 'ST', 'Second Wall Top', 1 WHERE 'ST' NOT IN (SELECT tw_wall_id FROM tw_wall)");
    await runSQL("INSERT INTO tw_wall (tw_wall_id, tw_wall_name, combat_type) SELECT 'SB', 'Second Wall Bottom', 1 WHERE 'SB' NOT IN (SELECT tw_wall_id FROM tw_wall)");
    await runSQL("INSERT INTO tw_wall (tw_wall_id, tw_wall_name, combat_type) SELECT 'TM', 'Third Wall Middle', 1 WHERE 'TM' NOT IN (SELECT tw_wall_id FROM tw_wall)");
    await runSQL("INSERT INTO tw_wall (tw_wall_id, tw_wall_name, combat_type) SELECT 'TB', 'Third Wall Bottom', 1 WHERE 'TB' NOT IN (SELECT tw_wall_id FROM tw_wall)");
    await runSQL("INSERT INTO tw_wall (tw_wall_id, tw_wall_name, combat_type) SELECT 'BM', 'Back Wall Middle', 1 WHERE 'BM' NOT IN (SELECT tw_wall_id FROM tw_wall)");
    await runSQL("INSERT INTO tw_wall (tw_wall_id, tw_wall_name, combat_type) SELECT 'BB', 'Back Wall Bottom', 1 WHERE 'BB' NOT IN (SELECT tw_wall_id FROM tw_wall)");
    await runSQL("INSERT INTO tw_wall (tw_wall_id, tw_wall_name, combat_type) SELECT 'FlF', 'Fleet Wall Front', 2 WHERE 'FlF' NOT IN (SELECT tw_wall_id FROM tw_wall)");
    await runSQL("INSERT INTO tw_wall (tw_wall_id, tw_wall_name, combat_type) SELECT 'FlB', 'Fleet Wall Back', 2 WHERE 'FlB' NOT IN (SELECT tw_wall_id FROM tw_wall)");

    console.log("add combat type to teams");
    await runSQL("ALTER TABLE team ADD IF NOT EXISTS combat_type INT NOT NULL DEFAULT 1");

    console.log("creating tw_wall_team");
    await runSQL("CREATE TABLE IF NOT EXISTS tw_wall_team ("+
        "tw_wall_id varchar(8) NOT NULL, "+
        "team_id int NOT NULL, "+
        "ally_code int NOT NULL, "+
        "primary key(team_id, ally_code), "+
        "CONSTRAINT fk_tw_wall_team__player "+
        "FOREIGN KEY (ally_code) REFERENCES player (ally_code) "+
        "ON DELETE CASCADE "+
        "ON UPDATE RESTRICT, "+
        "CONSTRAINT fk_tw_wall_team__team "+
        "FOREIGN KEY (team_id) REFERENCES team (team_id) "+
        "ON DELETE CASCADE "+
        "ON UPDATE RESTRICT "+
        ");");

        await runSQL("INSERT INTO slot (slot_id, slot_name, slot_long_name) SELECT 7, 'Cross', 'Multiplexer' WHERE 7 NOT IN (SELECT slot_id FROM slot)");
        await runSQL("UPDATE player_mod SET slot_id = 7 WHERE slot_id = 6 AND ((SELECT COUNT(*) FROM player_mod WHERE slot_id = 7) = 0)");
        await runSQL("UPDATE unit_mod SET slot_id = 7 WHERE slot_id = 6 AND ((SELECT COUNT(*) FROM unit_mod WHERE slot_id = 7) = 0)");
        await runSQL("UPDATE slot SET slot_name = 'Circle', slot_long_name = 'Data-Bus' WHERE slot_id = 6");
        await runSQL("UPDATE player_mod SET slot_id = 6 WHERE slot_id = 5 AND ((SELECT COUNT(*) FROM player_mod WHERE slot_id = 6) = 0)");
        await runSQL("UPDATE unit_mod SET slot_id = 6 WHERE slot_id = 5 AND ((SELECT COUNT(*) FROM unit_mod WHERE slot_id = 6) = 0)");
        await runSQL("UPDATE slot SET slot_name = 'Triangle', slot_long_name = 'Holo-Array' WHERE slot_id = 5");
        await runSQL("UPDATE player_mod SET slot_id = 5 WHERE slot_id = 4 AND ((SELECT COUNT(*) FROM player_mod WHERE slot_id = 5) = 0)");
        await runSQL("UPDATE unit_mod SET slot_id = 5 WHERE slot_id = 4 AND ((SELECT COUNT(*) FROM unit_mod WHERE slot_id = 5) = 0)");
        await runSQL("UPDATE slot SET slot_name = 'Diamond', slot_long_name = 'Processor' WHERE slot_id = 4");
        await runSQL("UPDATE player_mod SET slot_id = 4 WHERE slot_id = 3 AND ((SELECT COUNT(*) FROM player_mod WHERE slot_id = 4) = 0)");
        await runSQL("UPDATE unit_mod SET slot_id = 4 WHERE slot_id = 3 AND ((SELECT COUNT(*) FROM unit_mod WHERE slot_id = 4) = 0)");
        await runSQL("UPDATE slot SET slot_name = 'Arrow', slot_long_name = 'Receiver' WHERE slot_id = 3");
        await runSQL("UPDATE player_mod SET slot_id = 3 WHERE slot_id = 2 AND ((SELECT COUNT(*) FROM player_mod WHERE slot_id = 3) = 0)");
        await runSQL("UPDATE unit_mod SET slot_id = 3 WHERE slot_id = 2 AND ((SELECT COUNT(*) FROM unit_mod WHERE slot_id = 3) = 0)");
        await runSQL("UPDATE slot SET slot_name = 'Square', slot_long_name = 'Transmitter' WHERE slot_id = 2");
        await runSQL("UPDATE player_mod SET slot_id = 2 WHERE slot_id = 1 AND ((SELECT COUNT(*) FROM player_mod WHERE slot_id = 2) = 0)");
        await runSQL("UPDATE unit_mod SET slot_id = 2 WHERE slot_id = 1 AND ((SELECT COUNT(*) FROM unit_mod WHERE slot_id = 2) = 0)");

        await runSQL("DELETE FROM slot WHERE slot_id = 1");
}

async function versionTwo (){

    console.log("starting version Two");
    console.log("creating rote_operation");
    await runSQL("CREATE TABLE IF NOT EXISTS rote_operation ("+
        "path VARCHAR(64) NOT NULL, "+
        "phase int NOT NULL, "+
        "operation int NOT NULL, "+
        "unit_index int NOT NULL, "+
        "relic_level int NOT NULL, "+
        "base_id VARCHAR(64) NOT NULL, "+
        "ally_code int, "+
        "primary key(path, phase, operation, unit_index), "+
        "CONSTRAINT fk_rote_operation__base_id "+
        "FOREIGN KEY (base_id) REFERENCES unit (base_id) "+
        "ON DELETE CASCADE "+
        "ON UPDATE RESTRICT, "+
        "CONSTRAINT fk_rote__player_unit "+
        "FOREIGN KEY (ally_code, base_id) REFERENCES player_unit (ally_code, base_id) "+
        "ON DELETE CASCADE "+
        "ON UPDATE RESTRICT "+
        ");");

}

async function versionOne (){

    console.log("starting version One");
    console.log("creating player");
    await runSQL("CREATE TABLE IF NOT EXISTS player ("+
        "ally_code int NOT NULL, "+
        "password varchar(64), "+
        "ally_name VARCHAR(64), "+
        "character_galactic_power int, "+
        "ship_galactic_power int, "+
        "guild_id varchar(32), "+
        "guild_name varchar(256), "+
        "access int NOT NULL DEFAULT 0, "+
        "primary key(ally_code));");
  
    console.log("creating unit");
    await runSQL("CREATE TABLE IF NOT EXISTS unit ("+
        "base_id VARCHAR(64) NOT NULL, "+
        "combat_type int, "+
        "character_name VARCHAR(128), "+
        "url VARCHAR(256), "+
        "alignment int, " +
        "role VARCHAR(64), "+
        "categories VARCHAR(128), "+
        "unit_image VARCHAR(256), "+
        "primary key(base_id));");
  
    console.log("creating slot");
    await runSQL("CREATE TABLE IF NOT EXISTS slot ("+
        "slot_id int NOT NULL, "+
        "slot_name varchar(16) NOT NULL, "+
        "slot_long_name varchar(64) NOT NULL, "+
        "primary key(slot_id));");

    await runSQL("INSERT INTO slot (slot_id, slot_name, slot_long_name) SELECT 1, 'Square', 'Transmitter' WHERE 1 NOT IN (SELECT slot_id FROM slot)");
    await runSQL("INSERT INTO slot (slot_id, slot_name, slot_long_name) SELECT 2, 'Arrow', 'Receiver' WHERE 2 NOT IN (SELECT slot_id FROM slot)");
    await runSQL("INSERT INTO slot (slot_id, slot_name, slot_long_name) SELECT 3, 'Diamond', 'Processor' WHERE 3 NOT IN (SELECT slot_id FROM slot)");
    await runSQL("INSERT INTO slot (slot_id, slot_name, slot_long_name) SELECT 4, 'Triangle', 'Holo-Array' WHERE 4 NOT IN (SELECT slot_id FROM slot)");
    await runSQL("INSERT INTO slot (slot_id, slot_name, slot_long_name) SELECT 5, 'Circle', 'Data-Bus' WHERE 5 NOT IN (SELECT slot_id FROM slot)");
    await runSQL("INSERT INTO slot (slot_id, slot_name, slot_long_name) SELECT 6, 'Cross', 'Multiplexer' WHERE 6 NOT IN (SELECT slot_id FROM slot)");

    console.log("creating group_set");
    await runSQL("CREATE TABLE IF NOT EXISTS group_set ("+
        "group_set_id int NOT NULL, "+
        "group_set_name varchar(16) NOT NULL, "+
        "primary key(group_set_id));");

    await runSQL("INSERT INTO group_set (group_set_id, group_set_name) SELECT 1, 'Health' WHERE 1 NOT IN (SELECT group_set_id FROM group_set)");
    await runSQL("INSERT INTO group_set (group_set_id, group_set_name) SELECT 2, 'Offense' WHERE 2 NOT IN (SELECT group_set_id FROM group_set)");
    await runSQL("INSERT INTO group_set (group_set_id, group_set_name) SELECT 3, 'Defense' WHERE 3 NOT IN (SELECT group_set_id FROM group_set)");
    await runSQL("INSERT INTO group_set (group_set_id, group_set_name) SELECT 4, 'Speed' WHERE 4 NOT IN (SELECT group_set_id FROM group_set)");
    await runSQL("INSERT INTO group_set (group_set_id, group_set_name) SELECT 5, 'Crit Chance' WHERE 5 NOT IN (SELECT group_set_id FROM group_set)");
    await runSQL("INSERT INTO group_set (group_set_id, group_set_name) SELECT 6, 'Crit Damage' WHERE 6 NOT IN (SELECT group_set_id FROM group_set)");
    await runSQL("INSERT INTO group_set (group_set_id, group_set_name) SELECT 7, 'Potency' WHERE 7 NOT IN (SELECT group_set_id FROM group_set)");
    await runSQL("INSERT INTO group_set (group_set_id, group_set_name) SELECT 8, 'Tenacity' WHERE 8 NOT IN (SELECT group_set_id FROM group_set)");
  
    console.log("creating player_unit");
    await runSQL("CREATE TABLE IF NOT EXISTS player_unit ("+
        "ally_code int NOT NULL, "+
        "base_id VARCHAR(64) NOT NULL, "+
        "gear_level int, "+
        "gear_level_plus int, "+
        "gear_level_flags int, "+
        "level int, "+
        "power int, "+
        "rarity int, "+
        "zeta_abilities int, "+
        "omicron_abilities int, "+
        "relic_tier int, "+
        "has_ultimate boolean, "+
        "is_galactic_legend boolean, "+
        "primary key(ally_code, base_id), "+
        "CONSTRAINT fk_player_unit__player "+
        "FOREIGN KEY (ally_code) REFERENCES player (ally_code) "+
        "ON DELETE CASCADE "+
        "ON UPDATE RESTRICT, "+
        "CONSTRAINT fk_player_unit__unit "+
        "FOREIGN KEY (base_id) REFERENCES unit (base_id) "+
        "ON DELETE CASCADE "+
        "ON UPDATE RESTRICT);");
  
    console.log("creating player_mod");
    await runSQL("CREATE TABLE IF NOT EXISTS player_mod ("+
        "id varchar(32) NOT NULL, "+
        "ally_code int NOT NULL, "+
        "base_id VARCHAR(64) NOT NULL, "+
        "level int NOT NULL, "+
        "tier int NOT NULL, "+
        "rarity int NOT NULL, "+
        "slot_id int NOT NULL, "+
        "group_set_id int NOT NULL, "+
        "primary_stat varchar(64) NOT NULL, "+
        "primary_stat_value varchar(16) NOT NULL, "+
        "secondary_stat_1 varchar(64) NOT NULL, "+
        "secondary_stat_1_value varchar(16) NOT NULL, "+
        "secondary_stat_2 varchar(64) NOT NULL, "+
        "secondary_stat_2_value varchar(16) NOT NULL, "+
        "secondary_stat_3 varchar(64) NOT NULL, "+
        "secondary_stat_3_value varchar(16) NOT NULL, "+
        "secondary_stat_4 varchar(64) NOT NULL, "+
        "secondary_stat_4_value varchar(16) NOT NULL, "+
        "primary key(id), "+
        "CONSTRAINT fk_player_mod__player_unit "+
        "FOREIGN KEY (ally_code, base_id) REFERENCES player_unit (ally_code, base_id) "+
        "ON DELETE CASCADE "+
        "ON UPDATE RESTRICT, "+
        "CONSTRAINT fk_player_mod__slot "+
        "FOREIGN KEY (slot_id) REFERENCES slot (slot_id) "+
        "ON DELETE CASCADE "+
        "ON UPDATE RESTRICT, "+
        "CONSTRAINT fk_player_mod__group_set "+
        "FOREIGN KEY (group_set_id) REFERENCES group_set (group_set_id) "+
        "ON DELETE CASCADE "+
        "ON UPDATE RESTRICT);");
  
    console.log("creating unit_mod");
    await runSQL("CREATE TABLE IF NOT EXISTS unit_mod ("+
        "date date NOT NULL DEFAULT CURDATE(), "+
        "base_id varchar(64) NOT NULL, "+
        "slot_id int NOT NULL, "+
        "group_set_id int NOT NULL, "+
        "primary_stat varchar(64) NOT NULL, "+
        "primary key(date, base_id, slot_id), "+
        "CONSTRAINT fk_unit_mod__unit "+
        "FOREIGN KEY (base_id) REFERENCES unit (base_id) "+
        "ON DELETE CASCADE "+
        "ON UPDATE RESTRICT, "+
        "CONSTRAINT fk_unit_mod__slot "+
        "FOREIGN KEY (slot_id) REFERENCES slot (slot_id) "+
        "ON DELETE CASCADE "+
        "ON UPDATE RESTRICT, "+
        "CONSTRAINT fk_unit_mod__group_set "+
        "FOREIGN KEY (group_set_id) REFERENCES group_set (group_set_id) "+
        "ON DELETE CASCADE "+
        "ON UPDATE RESTRICT);");

    console.log("creating journey_guide");
    await runSQL("CREATE TABLE IF NOT EXISTS journey_guide ("+
        "base_id VARCHAR(64) NOT NULL, "+
        "list_order int NOT NULL, "+
        "guide text, " +
        "primary key(base_id), "+
        "CONSTRAINT fk_journey_guide__unit "+
        "FOREIGN KEY (base_id) REFERENCES unit (base_id) "+
        "ON DELETE CASCADE "+
        "ON UPDATE RESTRICT);");

    console.log("creating team");
    await runSQL("CREATE TABLE IF NOT EXISTS team ("+
        "team_id int NOT NULL AUTO_INCREMENT, "+
        "base_id_1 VARCHAR(64) NOT NULL, "+
        "base_id_2 VARCHAR(64), "+
        "base_id_3 VARCHAR(64), "+
        "base_id_4 VARCHAR(64), "+
        "base_id_5 VARCHAR(64), "+
        "list_order int NOT NULL, "+
        "defense boolean NOT NULL, "+
        "offense boolean NOT NULL, "+
        "team_size int NOT NULL, "+
        "team_type VARCHAR(16), "+
        "primary key(team_id), "+
        "CONSTRAINT fk_team__unit_1 "+
        "FOREIGN KEY (base_id_1) REFERENCES unit (base_id) "+
        "ON DELETE CASCADE "+
        "ON UPDATE RESTRICT, "+
        "CONSTRAINT fk_team__unit_2 "+
        "FOREIGN KEY (base_id_2) REFERENCES unit (base_id) "+
        "ON DELETE CASCADE "+
        "ON UPDATE RESTRICT, "+
        "CONSTRAINT fk_team__unit_3 "+
        "FOREIGN KEY (base_id_3) REFERENCES unit (base_id) "+
        "ON DELETE CASCADE "+
        "ON UPDATE RESTRICT, "+
        "CONSTRAINT fk_team__unit_4 "+
        "FOREIGN KEY (base_id_4) REFERENCES unit (base_id) "+
        "ON DELETE CASCADE "+
        "ON UPDATE RESTRICT, "+
        "CONSTRAINT fk_team__unit_5 "+
        "FOREIGN KEY (base_id_5) REFERENCES unit (base_id) "+
        "ON DELETE CASCADE "+
        "ON UPDATE RESTRICT "+
        ");");
}

export default migrations;