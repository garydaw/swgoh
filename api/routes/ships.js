import express from 'express';
const shipsRouter = express.Router();
import units from "../model/units.js";

const COMBAT_TYPE = 2;

//get player details
shipsRouter.get('/', async (req, res) => {

    const ally_ships = await units.get(req.query.ally_code, COMBAT_TYPE);
    res.json(ally_ships);
  
});


export default shipsRouter;
