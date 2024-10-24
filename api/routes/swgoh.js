import express from 'express';
const swgohRouter = express.Router();
import units from "../model/units.js";
import players from "../model/players.js";


//refresh guild
swgohRouter.get('/guild/:guild_id', async (req, res) => {

    const guild_id = req.params.guild_id;

    //get units
    await units.refreshUnits();

    //get allies
    await players.refreshAllies(guild_id);


    res.json({ message:"Guild refreshed"});
  
});


export default swgohRouter;
