import comlink from '../comlink/client.js';
import players from '../model/players.js';
import normaliseComlinkMod from './modHelper.js'

async function importPlayer(playerId, skillsMap, statCalculator, GLSet) {

    let returnMessage = ``;

    const playerData = await comlink.getPlayer(null, String(playerId));
    
    const playerExists = await players.playerExists(playerData.allyCode);

    if (!playerExists) {
        await players.add(playerData.allyCode);
        returnMessage += `Player ${playerData.name} (${playerData.allyCode}) added to guild.\n`;
    }

    let player = {};

    player.data = {
        ally_code: playerData.allyCode,
        name: playerData.name,
        character_galactic_power: playerData.profileStat.find(item => item.nameKey === 'STAT_CHARACTER_GALACTIC_POWER_ACQUIRED_NAME')?.value,
        ship_galactic_power: playerData.profileStat.find(item => item.nameKey === 'STAT_SHIP_GALACTIC_POWER_ACQUIRED_NAME')?.value,
        guild_id: playerData.guildId,
        guild_name: playerData.guildName,
        player_id: playerData.playerId
    }

    player.units = playerData.rosterUnit.map(unit => {

        const base_id = unit.definitionId.split(':')[0];
        const omicronAbilities = [];
        const zetaAbilities = [];
        const isGalacticLegend = GLSet.has(base_id);
        let hasUltimate = false;

        if(isGalacticLegend && unit.purchasedAbilityId.length > 0)
            hasUltimate = true;

        for(const skill of unit.skill) {
            const skillInfo = skillsMap.get(skill.id);

            if(skillInfo.zetaTier > 0 && skill.tier >= skillInfo.zetaTier) {
                zetaAbilities.push(skill.id);
            }
            if(skillInfo.omicronTier > 0 && skill.tier >= skillInfo.omicronTier) {
                omicronAbilities.push(skill.id);
            }
        }

        const gear_level_flags = unit.equipment.reduce((accumulator, item) => {
            return accumulator | (1 << item.slot);
        }, 0);

        const gear_level_plus = unit.equipment.length;

        const mods = [];

        for (const mod of unit.equippedStatMod ?? [] ) {
            mods.push(normaliseComlinkMod(base_id, mod));
        }
             
        return {
            base_id: base_id,
            gear_level: unit.currentTier,
            gear_level_plus: gear_level_plus,
            gear_level_flags: gear_level_flags,
            level: unit.currentLevel,
            power: statCalculator.calcCharGP( unit ),
            rarity: unit.currentRarity,
            zeta_abilities: zetaAbilities,
            omicron_abilities: omicronAbilities,
            relic_tier: unit.relic?.currentTier ?? 1,
            has_ultimate: hasUltimate,
            is_galactic_legend: isGalacticLegend,
            mods: mods
        }
    });
    
    await players.update(player);

    return returnMessage

}

async function deleteGuildMembers(playerIds, guildId) {

    let returnMessage = ``;
    const playersToRemove = await players.playersToRemove(playerIds, guildId);
     for (const player of playersToRemove) {
        await players.delete(player.ally_code);
        returnMessage += `Player ${player.ally_name} (${player.ally_code}) removed from guild.\n`;
     }
     return returnMessage;
}


export { deleteGuildMembers }

export default importPlayer;