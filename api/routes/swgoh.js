import express from 'express';
const swgohRouter = express.Router();
import swgoh from "../model/swgoh.js";


//get player details
swgohRouter.get('/guild/:guild_id', async (req, res) => {

    //get units
    await swgoh.refreshUnits();

    res.json({ message:"Guild refreshed"});
  
});


export default swgohRouter;
