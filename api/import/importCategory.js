import gameData from '../model/gameData.js';

async function importCategory(category) {

    await gameData.clearCategory();

    for (const rawCategory of category) {

        await gameData.addCategory(rawCategory.id, rawCategory.descKey, rawCategory.visible);
    }

    await gameData.clearCategory("PLACEHOLDER");

    return `Category data imported successfully.\n Rows imported: ${segment.category.length}\n`;

}

export default importCategory;