import express from 'express';
const modsRouter = express.Router();
import mods from "../model/mods.js";

//get player details
modsRouter.get('/', async (req, res) => {

    const ally_mods = await mods.get(req.query.ally_code);
    res.json(ally_mods);
  
});

modsRouter.get('/speed/:speed', async (req, res) => {

    const ally_mods = await mods.getSpeedMods(req.query.ally_code, req.params.speed);
    res.json(ally_mods);
  
});


export default modsRouter;
