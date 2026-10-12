import gameData from '../model/gameData.js';

async function importSkills(skills) {


    await gameData.clearSkills();

    for (const skill of skills) {
        
        let zetaTier = 0;
        let omicronTier = 0;
        // Tiers for the players are 0 based, contrary to the tier name starting at 1
        for (let t = 0; t < skill.tier.length; t++) {
            if(skill.tier[t].isZetaTier) {
                zetaTier = t;
            }
            if(skill.tier[t].isOmicronTier) {
                omicronTier = t;
            }
        }

        await gameData.addSkill(skill.id, skill.nameKey, skill.abilityReference, skill.skillType, zetaTier, omicronTier);
    }

    return `Skill data imported successfully.\n Rows imported: ${skills.length}\n`;
    

}

export default importSkills;