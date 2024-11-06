import express from 'express';
const gacRouter = express.Router();
import teams from "../model/teams.js";

//get gac teams
gacRouter.get('', async (req, res) => {

    //get teams
    const gacTeams = await teams.get(req.query.ally_code, "gac");

    res.json(gacTeams);
  
});

gacRouter.post('', async (req, res) => {

    const { teamType, teamPost, offence, defence } = req.body;
    //set team
    await teams.set('gac', teamType.substring(3), teamPost, offence, defence);

    res.json([]);
  
});


export default gacRouter;
