import 'dotenv/config';
import importGuild from './importGuild.js';
import importPlayer from './importPlayer.js';

async function main() {
    await importGuild("Ge0VaZyTRH-pUMiXAvppXg");
}

main().catch(error => {
    console.error('Daily import failed:', error);
    process.exit(1);
});