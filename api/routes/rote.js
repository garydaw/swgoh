import express from 'express';
const roteRouter = express.Router();
import rote from "../model/rote.js";


roteRouter.get('/planets', async (req, res) => {

    const planets = await rote.getPlanets();
    res.json(planets);
  
});

roteRouter.get('/export', async (req, res) => {

   
    const excel = await rote.getExcel(req.user.user_name);

    res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "rote.xlsx"
    );

    return excel.xlsx.write(res).then(function () {
    res.status(200).end();
    });
  
});

roteRouter.get('/keyunits', async (req, res) => {

    const keyunits = await rote.getKeyUnits();
    res.json(keyunits);
  
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

roteRouter.post('/operations/swap/:path/:planet/:operation/:unit_index/:ally_code', async (req, res) => {

    const path = req.params.path;
    const planet = req.params.planet;
    const operation = req.params.operation;
    const unit_index = req.params.unit_index;
    const ally_code = req.params.ally_code;
    
    await rote.swapOperations(path, planet, operation, unit_index, ally_code);
    
    const ops = await rote.getOperations(path, planet);
    res.json(ops);
  
});

roteRouter.post('/operations/working/:path/:planet/:operation/:unit_index/:ally_code', async (req, res) => {

    const path = req.params.path;
    const planet = req.params.planet;
    const operation = req.params.operation;
    const unit_index = req.params.unit_index;
    const ally_code = req.params.ally_code;
    
    await rote.workingOperations(path, planet, operation, unit_index, ally_code);
    
    const ops = await rote.getOperations(path, planet);
    res.json(ops);
  
});


export default roteRouter;
