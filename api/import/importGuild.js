import comlink from '../comlink/client.js';
import playerImport from './importPlayer.js';

async function importGuild(guildId) {


    console.log("units:", units.length);

    const guildData = await comlink.getGuild(guildId);

    console.log('Importing guild data for guild, total members:', guildData.guild.member.length);

    //loop through guild members and import their data
    for (const member of guildData.guild.member) {
        
        console.log('Importing player data for playerId:', member.playerId);
        //await playerImport(member.playerId);
    }
    
}

export default importGuild;