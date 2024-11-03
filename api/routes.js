import express from 'express';
const apiRouter = express.Router();
import authRouter from "./routes/auth.js";
import charactersRouter from "./routes/characters.js";
import shipsRouter from "./routes/ships.js";
import authMiddleware from "./middleware/auth.js"
import generalRouter from './routes/general.js';
import swgohRouter from './routes/swgoh.js';
import journeyRouter from './routes/journey.js';
import gacRouter from './routes/gac.js';
import twRouter from './routes/tw.js';
import migrationRouter from './routes/migrations.js';

apiRouter.use(authMiddleware);

apiRouter.use("/auth", authRouter);
apiRouter.use("/characters", charactersRouter);
apiRouter.use("/ships", shipsRouter);
apiRouter.use("/general", generalRouter);
apiRouter.use("/swgoh", swgohRouter);
apiRouter.use("/journey", journeyRouter);
apiRouter.use("/gac", gacRouter);
apiRouter.use("/tw", twRouter);
apiRouter.use("/migrations", migrationRouter);

export default apiRouter;
