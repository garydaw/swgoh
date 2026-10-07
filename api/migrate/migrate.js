import 'dotenv/config';
import mariadb from 'mariadb';

//vars to be swapped with env variables
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_MIGRATE_USER,
  password: process.env.DB_MIGRATE_PASS,
  database: process.env.MY_DB,
  bigIntAsNumber: true 
});

//connect to db, run query and return results
async function runSQL(sql, values) {

    const conn = await pool.getConnection();

    try {
        return await conn.query(sql, values);
    } finally {
        conn.release();
    }
}

const handlers = {
    0: comlinkImports
};

async function main() {

    const migration = await checkMigrationTable();

    const handler = handlers[migration];

    if (typeof handler !== 'function') {
        console.log(`No migration registered for version ${migration}.`);
        return;
    }

    await handler();
    await migrationCompleted(handler.name);

}

main()
    .then(async () => {
        await pool.end();
        console.log('Migration complete.');
    })
    .catch(async error => {
        console.error('Migration failed:', error);
        await pool.end();
        process.exit(1);
    });


async function checkMigrationTable() {
    await runSQL("CREATE TABLE IF NOT EXISTS migrations ("+
        "id int NOT NULL AUTO_INCREMENT, "+
        "name varchar(255) NOT NULL, "+
        "date_run DATETIME NOT NULL DEFAULT now(), "+
        "primary key(id) "+
        ");");

    const result = await runSQL("SELECT COUNT(*) as count FROM migrations;");
    return result[0].count;
}

async function migrationCompleted(migration) {
    await runSQL("INSERT INTO migrations (name) VALUES (?);", [migration]);
}

async function comlinkImports() {

    await convertCollation();

    await runSQL("CREATE TABLE IF NOT EXISTS metadata ("+
        "version varchar(255) NOT NULL, "+
        "type varchar(255) NOT NULL, "+
        "date_run DATETIME NOT NULL DEFAULT now(), "+
        "primary key(version, type) "+
        ");");

    await runSQL("CREATE TABLE IF NOT EXISTS localizations ("+
        "key_value varchar(255) NOT NULL, "+
        "value TEXT NOT NULL, "+
        "primary key(key_value) "+
        ");");

    await runSQL("CREATE TABLE IF NOT EXISTS category ("+
        "id varchar(255) NOT NULL, "+
        "descKey TEXT NOT NULL, "+
        "visible boolean NOT NULL, "+
        "primary key(id) "+
        ");");

    await runSQL("ALTER TABLE unit MODIFY categories varchar(255);");
}

async function convertCollation() {

    await runSQL(
        `ALTER DATABASE \`${process.env.MY_DB}\`
        CHARACTER SET utf8mb4
        COLLATE utf8mb4_unicode_ci`
    );

    // Drop foreign keys

    const foreignKeys = [
        ['journey_guide', 'fk_journey_guide__unit'],

        ['player_mod', 'fk_player_mod__group_set'],
        ['player_mod', 'fk_player_mod__player_unit'],
        ['player_mod', 'fk_player_mod__slot'],

        ['player_unit', 'fk_player_unit__player'],
        ['player_unit', 'fk_player_unit__unit'],

        ['rote_operation', 'fk_rote_operation__base_id'],
        ['rote_operation', 'fk_rote__player_unit'],

        ['team', 'fk_team__unit_1'],
        ['team', 'fk_team__unit_2'],
        ['team', 'fk_team__unit_3'],
        ['team', 'fk_team__unit_4'],
        ['team', 'fk_team__unit_5'],

        ['tw_counters', 'fk_tw_counters__unit'],

        ['tw_wall_team', 'fk_tw_wall_team__player'],
        ['tw_wall_team', 'fk_tw_wall_team__team'],

        ['unit_mod', 'fk_unit_mod__group_set'],
        ['unit_mod', 'fk_unit_mod__slot'],
        ['unit_mod', 'fk_unit_mod__unit']
    ];

    for (const [table, constraint] of foreignKeys) {
        console.log(`Dropping ${constraint}...`);

        await runSQL(
            `ALTER TABLE \`${table}\`
            DROP FOREIGN KEY \`${constraint}\``
        );
    }


    // Convert tables

    const tables = [
        'group_set',
        'journey_guide',
        'log',
        'migrations',
        'player_mod',
        'player_unit',
        'player',
        'rote_operation',
        'rote_planets',
        'rote_planner',
        'slot',
        'team',
        'tw_counters',
        'tw_wall_team',
        'tw_wall',
        'unit_mod',
        'unit'
    ];

    for (const table of tables) {
        console.log(`Converting ${table}...`);

        await runSQL(
            `ALTER TABLE \`${table}\`
            CONVERT TO CHARACTER SET utf8mb4
            COLLATE utf8mb4_unicode_ci`
        );
    }


    // Recreate foreign keys

    const constraints = [
        {
            table: 'journey_guide',
            name: 'fk_journey_guide__unit',
            column: 'base_id',
            refTable: 'unit',
            refColumn: 'base_id'
        },

        {
            table: 'player_mod',
            name: 'fk_player_mod__group_set',
            column: 'group_set_id',
            refTable: 'group_set',
            refColumn: 'group_set_id'
        },
        {
            table: 'player_mod',
            name: 'fk_player_mod__player_unit_base_id',
            column: 'base_id',
            refTable: 'player_unit',
            refColumn: 'base_id'
        },
        {
            table: 'player_mod',
            name: 'fk_player_mod__player_unit_ally_code',
            column: 'ally_code',
            refTable: 'player_unit',
            refColumn: 'ally_code'
        },
        {
            table: 'player_mod',
            name: 'fk_player_mod__slot',
            column: 'slot_id',
            refTable: 'slot',
            refColumn: 'slot_id'
        },

        {
            table: 'player_unit',
            name: 'fk_player_unit__player',
            column: 'ally_code',
            refTable: 'player',
            refColumn: 'ally_code'
        },
        {
            table: 'player_unit',
            name: 'fk_player_unit__unit',
            column: 'base_id',
            refTable: 'unit',
            refColumn: 'base_id'
        },

        {
            table: 'rote_operation',
            name: 'fk_rote_operation__base_id',
            column: 'base_id',
            refTable: 'unit',
            refColumn: 'base_id'
        },
        {
            table: 'rote_operation',
            name: 'fk_rote__player_unit',
            column: 'ally_code',
            refTable: 'player_unit',
            refColumn: 'ally_code'
        },
        {
            table: 'rote_operation',
            name: 'fk_rote__player_unit_base_id',
            column: 'base_id',
            refTable: 'player_unit',
            refColumn: 'base_id'
        },

        {
            table: 'team',
            name: 'fk_team__unit_1',
            column: 'base_id_1',
            refTable: 'unit',
            refColumn: 'base_id'
        },
        {
            table: 'team',
            name: 'fk_team__unit_2',
            column: 'base_id_2',
            refTable: 'unit',
            refColumn: 'base_id'
        },
        {
            table: 'team',
            name: 'fk_team__unit_3',
            column: 'base_id_3',
            refTable: 'unit',
            refColumn: 'base_id'
        },
        {
            table: 'team',
            name: 'fk_team__unit_4',
            column: 'base_id_4',
            refTable: 'unit',
            refColumn: 'base_id'
        },
        {
            table: 'team',
            name: 'fk_team__unit_5',
            column: 'base_id_5',
            refTable: 'unit',
            refColumn: 'base_id'
        },

        {
            table: 'tw_counters',
            name: 'fk_tw_counters__unit',
            column: 'base_id',
            refTable: 'unit',
            refColumn: 'base_id'
        },

        {
            table: 'tw_wall_team',
            name: 'fk_tw_wall_team__player',
            column: 'ally_code',
            refTable: 'player',
            refColumn: 'ally_code'
        },
        {
            table: 'tw_wall_team',
            name: 'fk_tw_wall_team__team',
            column: 'team_id',
            refTable: 'team',
            refColumn: 'team_id'
        },

        {
            table: 'unit_mod',
            name: 'fk_unit_mod__group_set',
            column: 'group_set_id',
            refTable: 'group_set',
            refColumn: 'group_set_id'
        },
        {
            table: 'unit_mod',
            name: 'fk_unit_mod__slot',
            column: 'slot_id',
            refTable: 'slot',
            refColumn: 'slot_id'
        },
        {
            table: 'unit_mod',
            name: 'fk_unit_mod__unit',
            column: 'base_id',
            refTable: 'unit',
            refColumn: 'base_id'
        }
    ];

    for (const constraint of constraints) {
        console.log(`Creating ${constraint.name}...`);

        await runSQL(
            `ALTER TABLE \`${constraint.table}\`
            ADD CONSTRAINT \`${constraint.name}\`
            FOREIGN KEY (\`${constraint.column}\`)
            REFERENCES \`${constraint.refTable}\` (\`${constraint.refColumn}\`)`
        );
    }
}