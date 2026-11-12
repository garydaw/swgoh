import express from 'express';
const botRouter = express.Router();
import roteRouter from './routes/bot/rote.js';


botRouter.use("/rote", roteRouter);


export default botRouter;
