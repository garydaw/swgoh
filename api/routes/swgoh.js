import express from 'express';
const swgohRouter = express.Router();
import units from "../model/units.js";
import players from "../model/players.js";


//refresh guild
swgohRouter.get('/guild/:guild_id', async (req, res) => {

    const guild_id = req.params.guild_id;

    //get units
    //await units.refreshUnits();

    //get allies
    //await players.refreshAllies(guild_id);

    // get best unit mods
    var all_units = await units.getGeneric(1);
    
    for(var u = 0; all_units.length > u; u++){
        console.log("Setting best mods for " + all_units[u].character_name);
        await units.setBestMods(all_units[u].base_id, all_units[u].url, all_units[u].character_name);
        
    }


    res.json({ message:"Guild refreshed"});
  
});


export default swgohRouter;
