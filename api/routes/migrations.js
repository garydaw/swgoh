import express from 'express';
const migrationRouter = express.Router();
import migration from "../model/migrations.js";

//db structure set up
migrationRouter.get('/:version', async (req, res) => {

    //call migration
    const version = req.params.version;
    await migration.run(version);
    res.status(200).json("finished");
  
  });

  export default migrationRouter;