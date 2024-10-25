import express from 'express';
const shipsRouter = express.Router();
import units from "../model/units.js";

const COMBAT_TYPE = 2;

//get player details
shipsRouter.get('/', async (req, res) => {

    let base_id = "";
    if(req.query.hasOwnProperty("base_id")){
        base_id = req.query.base_id;
    }

    const ally_ships = await units.get(req.query.ally_code, base_id, COMBAT_TYPE);
    res.json(ally_ships);
  
});


export default shipsRouter;
