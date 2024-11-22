import express from 'express';
const twCountersRouter = express.Router();
import tw_counters from "../model/tw_counters.js";

//get tw counters
twCountersRouter.get('', async (req, res) => {

    //get allies
    const counters = await tw_counters.get();

    res.json(counters);
  
});

twCountersRouter.post('/', async (req, res) => {
    
    await tw_counters.set(req.body);
    
    res.json({result:true, message: 'Counter successfully changed.' });
  
});


export default twCountersRouter;
