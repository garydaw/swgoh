import express from 'express';
const roteRouter = express.Router();
import rote from "../model/rote.js";


roteRouter.get('/planets', async (req, res) => {

    const planets = await rote.getPlanets();
    res.json(planets);
  
});

roteRouter.get('/operations/:path/:planet', async (req, res) => {

    const path = req.params.path;
    const planet = req.params.planet;
    const ops = await rote.getOperations(path, planet);
    res.json(ops);
  
});

roteRouter.post('/operations/auto/:path/:planet', async (req, res) => {

    const path = req.params.path;
    const planet = req.params.planet;
    await rote.allocateOperations(path, planet);
    
    const ops = await rote.getOperations(path, planet);
    res.json(ops);
  
});


export default roteRouter;
