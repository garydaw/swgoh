import express from 'express';
const apiRouter = express.Router();
import authRouter from "./routes/auth.js";
import charactersRouter from "./routes/characters.js";
import shipsRouter from "./routes/ships.js";
import authMiddleware from "./middleware/auth.js"
import generalRouter from './routes/general.js';

apiRouter.use(authMiddleware);

apiRouter.use("/auth", authRouter);
apiRouter.use("/characters", charactersRouter);
apiRouter.use("/ships", shipsRouter);
apiRouter.use("/general", generalRouter);

export default apiRouter;
