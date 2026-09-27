import comlink from '../comlink/client.js';
import playerImport from './importPlayer.js';

async function importGuild(guildId) {

    const guildData = await comlink.getGuild(guildId);

    console.log('Importing guild data for guild, total members:', guildData.guild.member.length);

    //loop through guild members and import their data
    for (const member of guildData.guild.member) {
        console.log('Importing player data for playerId:', member.playerId);
        //await playerImport(member.playerId);
    }

    // Test for a specific player
    await playerImport("832233694");
    
}

export default importGuild;