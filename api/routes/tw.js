import express from 'express';
const twRouter = express.Router();
import teams from "../model/teams.js";

//get tw teams
twRouter.get('', async (req, res) => {

    //get teams
    const twTeams = await teams.get(req.query.ally_code, "tw");

    res.json(twTeams);
  
});


export default twRouter;
