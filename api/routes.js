import express from 'express';
const apiRouter = express.Router();

import userRouter from "./routes/user.js";

apiRouter.use("/user", userRouter);

export default apiRouter;
