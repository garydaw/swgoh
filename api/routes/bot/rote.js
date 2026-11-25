import express from 'express';
const roteRouter = express.Router();
import rote from "../../model/rote.js";
import players from "../../model/players.js"
import rote_planner from '../../model/rote_planner.js';

roteRouter.get('/ops', async (req, res) => {

    const ops = ['light', 'dark', 'neutral'];
    res.json(ops);
  
});

roteRouter.get('/ops/:path/planets', async (req, res) => {
    const { path } = req.params;

    const planets = await rote.getPlanetsForPath(path);

    res.json(planets);
});

roteRouter.get('/ops/:path/:planet/:operation/units', async (req, res) => {
    const { path, planet, operation } = req.params;

    const units = await rote.getUnitsForOperation(path, planet, operation);

    res.json(units);
});

roteRouter.get('/ops/:path/:planet/:operation/units/allies', async (req, res) => {
    const { path, planet, operation } = req.params;

    const units = req.query.units.split(',');

    const data = await rote.getAlliesForUnits(path, planet, operation, units);

    res.json(data);
});

roteRouter.get('/ops/deployments/:phase/:discord_id', async (req, res) => {

    let returnObj = { player: null, planner: false, deployments: {} };
    const { phase, discord_id} = req.params;

    const player =  await players.getPlayerByDiscordId(discord_id);

    if(!player){
        res.json(returnObj);
        return;
    }

    returnObj.player = player;

    const roteExists = await rote_planner.checkActive();

    returnObj.planner = roteExists;
    
    if(!returnObj.planner){
        res.json(returnObj);
        return;
    }

    const deployments = await rote.getAllyDeployments(phase, player.ally_code);

    returnObj.deployments = deployments;

    res.json(returnObj);
});


export default roteRouter;
