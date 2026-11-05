import gameData from '../model/gameData.js';

async function importUnits(units, eraDefinition) {

    const { categoryMap, localizationMap } = await loadMappings();
    let unitCount = 0;

    const unitMap = new Map();

    for (const unit of units) {

        if(unit.obtainableTime != 0) {
            continue;
        }

        if(unitMap.get(unit.baseId)){
            continue;
        }

        unitMap.set(unit.baseId);

        const mappedUnit = mapUnit(
            unit,
            categoryMap,
            localizationMap
        );
        
        await gameData.addUnit(mappedUnit);
        unitCount++;
    }

    const now = Date.now();

    const currentEra = eraDefinition.find(era => {
        const start = Number(era.startTimeMs);
        const end = Number(era.endTimeMs);

        return now >= start && now < end;
    });

    await gameData.setEraUnits(currentEra?.eraUnitId ?? []);

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

    const crew = unit.combatType === 2
        ? unit.crew?.map(member => member.unitId) ?? []
        : null;
    
    return {
        base_id: unit.baseId,
        combat_type: unit.combatType,
        name: name,
        url: createUnitUrl(name),
        alignment: unit.forceAlignment,
        role: role,
        categories: categories.join(','),
        unit_image: unit.thumbnailName + '.png',
        crew: JSON.stringify(crew),
        is_galactic_legend: isGalacticLegend ? 1 : 0
    };

}

function createUnitUrl(characterName) {

    const slug = characterName
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/["()'\/,]/g, '')
        .replace(/ &/g, '');

    return `//swgoh.gg/units/${slug}/`;
}

export default importUnits;
