import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiRouter from './routes.js'
import cookieParser from 'cookie-parser';

const app = express();

//cors set up
app.use(cors({
  origin: process.env.FRONTEND_DOMAIN,
  credentials: true, 
}));

//header set up
app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use(express.json({ limit: '10mb' }));


app.use(cookieParser());
app.use('/api',apiRouter);

const PORT = process.env.PORT || 8443;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});