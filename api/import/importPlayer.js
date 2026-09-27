import comlink from '../comlink/client.js';

async function importPlayer(allyCode) {

    const player = await comlink.getPlayer(String(allyCode));

    console.log('Importing player data for allyCode units:', player.rosterUnit.length);

    /*
    for (const unit of player.rosterUnit) {

        for (const mod of unit.equippedStatMod) {

            const modData = mapMod(unit, mod);

            await players.addMod(
                allyCode,
                modData
            );
        }
    }
    */

    return player;
}

export default importPlayer;