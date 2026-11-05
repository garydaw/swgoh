import comlink from '../comlink/client.js';
import importLocalization from './importLocalizations.js';
import importCategory from './importCategory.js';
import importSkills from './importSkills.js';
import importUnits from './importUnits.js';
import gameData from '../model/gameData.js';

async function importGameData(options = {}) {

    const forceLocalizationRefresh = options.localization ?? false;
    const forceUnitRefresh = options.unit ?? false;

    let returnMessage = '';
    const metadata = await comlink.getMetaData();
    
    const localizationVersion = metadata.latestLocalizationBundleVersion;
    const gameDataVersion = metadata.latestGamedataVersion;

    const isLocalizationLatest = await gameData.checkisLatestMetadata('localization', localizationVersion);
    const isGameDataLatest = await gameData.checkisLatestMetadata('gamedata', gameDataVersion);

    if(forceLocalizationRefresh || !isLocalizationLatest.isLatest) {

        returnMessage += await importLocalization(localizationVersion);
        if(!isLocalizationLatest.isLatest) {
            await gameData.setLatestMetadata('localization', localizationVersion);
        }
    } else {

        returnMessage += `Localization data is already up to date (Date: ${isLocalizationLatest.date_run_formatted}).\n`;
    }

    if(forceUnitRefresh || !isGameDataLatest.isLatest) {

        const segmentOne = await comlink.getGameData(gameDataVersion, false, 1);
        const segmentThree = await comlink.getGameData(gameDataVersion, false, 3);
        const segmentFour = await comlink.getGameData(gameDataVersion, false, 4);

        returnMessage += await importCategory(segmentOne.category);

        returnMessage += await importSkills(segmentOne.skill);

        returnMessage += await importUnits(segmentThree.units, segmentFour.eraDefinition);

        if(!isGameDataLatest.isLatest) {
            await gameData.setLatestMetadata('gamedata', gameDataVersion);
        }

    } else {

        returnMessage += `Category and Unit data is already up to date (Date: ${isGameDataLatest.date_run_formatted}).\n`;

    }

    return returnMessage;
}


export default importGameData;