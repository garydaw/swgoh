import 'dotenv/config';
import { closeDB } from '../model/database.js';
import importGameData from './importGameData.js';
import importGuild from './importGuild.js';

async function main() {

    try {
        await importGameData();

        // await importGuild("Ge0VaZyTRH-pUMiXAvppXg");

    } finally {
        await closeDB();
    }
}

main().catch(error => {
    console.error('Daily import failed:', error);
    process.exit(1);
});