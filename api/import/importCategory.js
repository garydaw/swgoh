import comlink from '../comlink/client.js';
import gameData from '../model/gameData.js';

async function importCategory(version) {

    const segment = await comlink.getGameData(version, false, 1);

    await gameData.clearCategory();

    for (const rawCategory of segment.category) {

        await gameData.addCategory(rawCategory.id, rawCategory.descKey, rawCategory.visible);
    }

    await gameData.clearCategory("PLACEHOLDER");

    return `Category data imported successfully.\n Rows imported: ${segment.category.length}\n`;

}

export default importCategory;