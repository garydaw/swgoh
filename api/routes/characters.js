import express from 'express';
const charactersRouter = express.Router();
import units from "../model/units.js";
const COMBAT_TYPE = 1;

//get player details
charactersRouter.get('/', async (req, res) => {
    
    let base_id = "";
    if(req.query.hasOwnProperty("base_id")){
        base_id = req.query.base_id;
    }
    
    const ally_characters = await units.get(req.query.ally_code, base_id, COMBAT_TYPE);

    res.json(ally_characters);
  
});


export default charactersRouter;
