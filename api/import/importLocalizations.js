import comlink from '../comlink/client.js';
import gameData from '../model/gameData.js';

async function importLocalization(version) {

    const localization = await comlink.getLocalizationBundle(
        `${version}:ENG_US`,
        true
    );

    const localeContents = localization['Loc_ENG_US.txt'];

    const rows = parseLocalization(localeContents);

    await gameData.clearLocalization();
    
    for (const row of rows) {
        await gameData.addLocalization(row.key, row.value)
    }
}

function parseLocalization(contents) {
    const rows = [];

    for (const line of contents.split(/\r?\n/)) {
        if (!line || line.startsWith('#')) {
            continue;
        }

        // Only the first | is the key/value separator.
        const separator = line.indexOf('|');

        if (separator === -1) {
            continue;
        }

        const key = line.substring(0, separator).trim();
        const value = line.substring(separator + 1);

        if (!key) {
            continue;
        }

        rows.push({ key, value });
    }

    return rows;
}

export default importLocalization;