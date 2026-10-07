import comlink from '../comlink/client.js';
import gameData from '../model/gameData.js';

async function importUnits(version) {

    const segment = await comlink.getGameData(version, false, 3);

    const { categoryMap, localizationMap } = await loadMappings();
    let unitCount = 0;

    for (const unit of segment.units) {

        const suffix = unit.id.split(':').pop(); 
        if(suffix !== 'ONE_STAR') {
            continue;
        }

        const mappedUnit = mapUnit(
            unit,
            categoryMap,
            localizationMap
        );
        
        await gameData.addUnit(mappedUnit);
        unitCount++;
    }

    return `Unit data imported successfully.\n Rows imported: ${unitCount}\n`;
}

async function loadMappings() {

    const categories = await gameData.getCategories();

    const localizations = await gameData.getLocalizations();


    const categoryMap = new Map();

    for (const category of categories) {
        categoryMap.set(category.id, category.descKey);
    }

    const localizationMap = new Map();

    for (const localization of localizations) {
        localizationMap.set(
            localization.key_value,
            localization.value
        );
    }

    return {
        categoryMap,
        localizationMap
    };
}

function mapUnit(unit, categoryMap, localizationMap) {

    const roleCategory = unit.categoryId.find(category =>
        category.startsWith('role_') &&
        category !== 'role_leader'
    );

    let role = '';

    if (roleCategory) {

        const descKey = categoryMap.get(roleCategory);

        if (descKey) {
            role = localizationMap.get(descKey) ?? '';
        }
    }

    const categories = unit.categoryId
        .filter(category => category !== roleCategory)
        .filter(category => !category.startsWith('release_'))
        .filter(category => !category.startsWith('selftag_'))
        .filter(category => !category.startsWith('teamup_'))
        .map(category => {

            const descKey = categoryMap.get(category);

            if (!descKey) {
                return null;
            }

            return localizationMap.get(descKey) ?? null;

        })
        .filter(value => value !== null);

    const name = localizationMap.get(unit.nameKey) ?? unit.nameKey;

    const isGalacticLegend = unit.categoryId?.includes('galactic_legend') ?? false;
    
    return {
        base_id: unit.baseId,
        combat_type: unit.combatType,
        character_name: name,
        url: createUnitUrl(name),
        alignment: unit.forceAlignment,
        role: role,
        categories: categories.join(','),
        unit_image: unit.thumbnailName + '.png',
        is_galactic_legend: isGalacticLegend ? 1 : 0
    };

}

function createUnitUrl(characterName) {

    const slug = characterName
        .toLowerCase()
        .replaceAll(' ', '-')
        .replaceAll('"', '')
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll("'", '')
        .replaceAll('/', '')
        .replaceAll(' &', '')
        .replaceAll(',', '');

    return `//swgoh.gg/units/${slug}/`;
}

export default importUnits;
