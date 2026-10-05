import comlink from '../comlink/client.js';
import importLocalization from './importLocalizations.js';
import importCategory from './importCategory.js';
import importUnits from './importUnits.js';
import gameData from '../model/gameData.js';

async function importGameData() {

    const metadata = await comlink.getMetaData();
    const needImport = await gameData.checkMetadata(metadata.latestLocalizationBundleVersion);

    if(!needImport) {
        return;
    }

    //await importLocalization(metadata.latestLocalizationBundleVersion);

    const gameDataVersion = metadata.latestGamedataVersion;

    //await importCategory(gameDataVersion);

    await importUnits(gameDataVersion);

}


export default importGameData;