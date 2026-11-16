import express from 'express';
const roteRouter = express.Router();
import rote from "../../model/rote.js";

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

export default roteRouter;
