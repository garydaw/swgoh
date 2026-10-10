import gameData from '../model/gameData.js';

async function importSkills(skills) {
    
    await gameData.clearSkills();

    for (const skill of skills) {
        let zetaTier = 0;
        let omicronTier = 0;
        for (let t = 0; t < skill.tier.length; t++) {
            if(skill.tier[t].isZetaTier) {
                zetaTier = t+1;
            }
            if(skill.tier[t].isOmicronTier) {
                omicronTier = t+1;
            }
        }

        await gameData.addSkill(skill.id, skill.nameKey, skill.abilityReference, skill.skillType, zetaTier, omicronTier);
    }

    return `Skill data imported successfully.\n Rows imported: ${skills.length}\n`;
    

}

export default importSkills;