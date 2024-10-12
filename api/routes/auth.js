//auth api
import express from 'express';
const authRouter = express.Router();
import auth from "../model/auth.js";
import jwt from 'jsonwebtoken';

//login function
authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // check password
  const passwordMatch = await auth.checkPassword(username, password);

  // reject if failure
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // get token
  const authToken = await auth.getAuthToken(username);

  //set cookie
  res.cookie('token', authToken.token, {
    httpOnly: true,
    secure:false, //app is not https in prod
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 168, // 1 week
    path: '/'
  })

  //return basic user data
  res.json({ user:{ally_code: authToken.ally_code, access: authToken.access}});
});

//logout function
authRouter.post('/logout', async (req, res) => {

  // get token and invalidate
  const authToken = req.cookies.token

  //set maxAge to the past
  res.cookie('token', authToken.token, {
    httpOnly: true,
    secure:false, //app is not https in prod 
    sameSite: 'lax',
    maxAge: new Date(0),
    path: '/'
  })
  
  //nothing to return
  res.json({ message:"User logged out!"});
});

//check cookie/token
authRouter.get('/check', async (req, res) => {

  //get the token from the cookie
  const authToken = req.cookies.token; 

  //if no token then not logged in
  if (!authToken) {
    return res.json({ auth:false, message: 'No Token' });
  }

  //verify the token
  return jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ auth:false, message: 'Token expired or invalid' });
    }
    return res.json({ auth:true, user:{ally_code: decoded.username, access: decoded.access}});
  });
 
  
});

export default authRouter;