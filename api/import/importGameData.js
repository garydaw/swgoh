import comlink from '../comlink/client.js';
import importLocalization from './importLocalizations.js';
import importCategory from './importCategory.js';
import importSkills from './importSkills.js';
import importUnits from './importUnits.js';
import gameData from '../model/gameData.js';

async function importGameData() {

    let returnMessage = '';
    const metadata = await comlink.getMetaData();
    
    const localizationVersion = metadata.latestLocalizationBundleVersion;
    const gameDataVersion = metadata.latestGamedataVersion;

    const isLocalizationLatest = await gameData.checkisLatestMetadata('localization', localizationVersion);
    const isGameDataLatest = await gameData.checkisLatestMetadata('gamedata', gameDataVersion);

    if(!isLocalizationLatest.isLatest) {

        returnMessage += await importLocalization(localizationVersion);
        await gameData.setLatestMetadata('localization', localizationVersion);

    } else {

        returnMessage += `Localization data is already up to date (Date: ${isLocalizationLatest.date_run_formatted}).\n`;
    }

    if(!isGameDataLatest.isLatest) {

        const segmentOne = await comlink.getGameData(gameDataVersion, false, 1);
        const segmentThree = await comlink.getGameData(gameDataVersion, false, 1);

        returnMessage += await importCategory(segmentOne.category);

        returnMessage += await importSkills(segmentOne.skill);

        returnMessage += await importUnits(segmentThree.units);
        await gameData.setLatestMetadata('gamedata', gameDataVersion);

    } else {

        returnMessage += `Category and Unit data is already up to date (Date: ${isGameDataLatest.date_run_formatted}).\n`;

    }

    return returnMessage;
}


export default importGameData;