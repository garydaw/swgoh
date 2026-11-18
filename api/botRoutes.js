import express from 'express';
import botAuthMiddleware from "./middleware/botAuth.js"
import roteRouter from './routes/bot/rote.js';
import generalRouter from './routes/bot/general.js';


const botRouter = express.Router();
botRouter.use(botAuthMiddleware);
botRouter.use("/general", generalRouter);

botRouter.use("/rote", roteRouter);


export default botRouter;
