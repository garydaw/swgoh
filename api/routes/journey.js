import express from 'express';
const journeyRouter = express.Router();
import journeys from "../model/journeys.js";

//get journey guides
journeyRouter.get('', async (req, res) => {

    //get allies
    const guides = await journeys.get();

    res.json(guides);
  
});


export default journeyRouter;
