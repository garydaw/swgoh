import express from 'express';
const generalRouter = express.Router();
import units from "../model/units.js";
import players from '../model/players.js';

//get player details
generalRouter.get('/', async (req, res) => {
    
    const general = {}
    general.units = await units.getGeneric(1);
    general.ships = await units.getGeneric(2);
    general.allies = await players.getGuildMembers(req.user.user_name)
    res.json(general);
  
});


export default generalRouter;
