import comlink from '../comlink/client.js';
import importPlayer, {deleteGuildMembers} from './importPlayer.js';

async function importGuild(guildId) {

    const guildData = await comlink.getGuild(guildId);

    let returnMessage = `Guild data import completed, total members: ${guildData.guild.member.length}\n`;
    
    //loop through guild members and import their data
    for (const member of guildData.guild.member) {
        
        if(member.playerId === "5gljXPF8TcC59PLhabODOA")
            returnMessage += await importPlayer(member.playerId);
    }

    let playerIds = guildData.guild.member.map(member => member.playerId);
    returnMessage += await deleteGuildMembers(playerIds, guildId);
    
    return returnMessage;
}

export default importGuild;