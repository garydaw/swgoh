import express from 'express';
const twRouter = express.Router();
import teams from "../model/teams.js";

//get tw teams
twRouter.get('', async (req, res) => {

    //get teams
    const twTeams = await teams.get(req.query.ally_code, "tw");

    res.json(twTeams);
  
});

twRouter.post('', async (req, res) => {

    const { teamType, teamPost, offence, defence } = req.body;
    //set team
    await teams.set('tw', teamType.substring(3), teamPost, offence, defence);

    res.json([]);
  
});


export default twRouter;
