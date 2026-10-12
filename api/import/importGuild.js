import comlink from '../comlink/client.js';
import gameData from '../model/gameData.js';
import importPlayer, {deleteGuildMembers} from './importPlayer.js';

async function importGuild(guildId) {

    const skills = await gameData.getSkills();

    const skillsMap = new Map();

    for (const skill of skills) {
        skillsMap.set(skill.id, {zetaTier: skill.zeta_tier, omicronTier: skill.omicron_tier});
    }

    const guildData = await comlink.getGuild(guildId);

    let returnMessage = `Guild data import completed, total members: ${guildData.guild.member.length}\n`;
    
    //loop through guild members and import their data
    for (const member of guildData.guild.member) {
        
        if(member.playerId === "5gljXPF8TcC59PLhabODOA")
            returnMessage += await importPlayer(member.playerId, skillsMap);
    }

    let playerIds = guildData.guild.member.map(member => member.playerId);
    returnMessage += await deleteGuildMembers(playerIds, guildId);
    
    return returnMessage;
}

export default importGuild;