import express from 'express';
const gacRouter = express.Router();
import teams from "../model/teams.js";

//get gac teams
gacRouter.get('', async (req, res) => {

    //get teams
    const gacTeams = await teams.get(req.query.ally_code, "gac");

    res.json(gacTeams);
  
});


export default gacRouter;
