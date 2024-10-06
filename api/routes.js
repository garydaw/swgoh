import express from 'express';
const apiRouter = express.Router();

import authRouter from "./routes/auth.js";

apiRouter.use("/auth", authRouter);

export default apiRouter;
