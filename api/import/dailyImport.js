import 'dotenv/config';
import { closeDB } from '../model/database.js';
import importGameData from './importGameData.js';
import importGuild from './importGuild.js';
import sendImportEmail from './email.js';

async function main() {

    try {
        const startTime = new Date();
        const gameData = await importGameData();
        const endTimeGameData = new Date();
        const durationGameData = (endTimeGameData - startTime) / 1000;

        //await importGuild("Ge0VaZyTRH-pUMiXAvppXg");

        const endTime = new Date();
        const duration = (endTime - startTime) / 1000;

        await sendImportEmail(
            'SWGOH daily import completed',
            `The SWGOH daily import completed successfully in ${duration} seconds. \n` +
            `Game data import took ${durationGameData} seconds. \n` +
            `${gameData}`
        );

    } finally {
        await closeDB();
    }
}

main().catch(async error => {
    console.error('Daily import failed:', error);
    try {
        await sendImportEmail(
            'SWGOH daily import FAILED',
            `The SWGOH daily import failed.\n\n${error.stack || error}`
        );
    } catch (emailError) {
        console.error('Failed to send error email:', emailError);
    }
    process.exit(1);
});