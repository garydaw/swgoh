import express from 'express';
const roteRouter = express.Router();
import rote from "../../model/rote.js";

roteRouter.get('/ops', async (req, res) => {

    const ops = ['light', 'dark', 'neutral'];
    res.json(ops);
  
});



export default roteRouter;
