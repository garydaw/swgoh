import comlink from '../comlink/client.js';
import gameData from '../model/gameData.js';
import importPlayer, {deleteGuildMembers} from './importPlayer.js';
import statCalculator from 'swgoh-stat-calc';

async function importGuild(guildId) {

    let calcGameData = await (await fetch('https://raw.githubusercontent.com/swgoh-utils/gamedata/refs/heads/main/gameData.json')).json();
    
    statCalculator.setGameData( calcGameData.data );

    const skills = await gameData.getSkills();

    const skillsMap = new Map();

    for (const skill of skills) {
        skillsMap.set(skill.id, {zetaTier: skill.zeta_tier, omicronTier: skill.omicron_tier});
    }

    const GLs = await gameData.getGls();
    const GLSet = new Set(GLs.map(item => item.base_id));


    const guildData = await comlink.getGuild(guildId);

    let returnMessage = `Guild data import completed, total members: ${guildData.guild.member.length}\n`;
    
    //loop through guild members and import their data
    for (const member of guildData.guild.member) {
        
        //if(member.playerId === "5gljXPF8TcC59PLhabODOA")
            returnMessage += await importPlayer(member.playerId, skillsMap, statCalculator, GLSet);
    }

    let playerIds = guildData.guild.member.map(member => member.playerId);
    returnMessage += await deleteGuildMembers(playerIds, guildId);
    
    return returnMessage;
}

export default importGuild;