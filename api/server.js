import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiRouter from './routes.js'

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api',apiRouter);

const PORT = process.env.PORT || 8443;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});