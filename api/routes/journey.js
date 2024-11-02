import express from 'express';
const journeyRouter = express.Router();
import journeys from "../model/journeys.js";

//get journey guides
journeyRouter.get('', async (req, res) => {

    //get allies
    const guides = await journeys.get();

    res.json(guides);
  
});

journeyRouter.post('/', async (req, res) => {
    
    await journeys.set(req.body);
    
    res.json({result:true, message: 'Guide successfully changed.' });
  
});


export default journeyRouter;
