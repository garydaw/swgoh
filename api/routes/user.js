//user api
import express from 'express';
const userRouter = express.Router();
import user from "../model/user.js";

userRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // check password
  const passwordMatch = await user.checkPassword(username, password);

  // reject if failure
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // get token and return
  const userToken = await user.getUserToken(username);

  res.json({ token: userToken.token, user:{ally_code: userToken.ally_code, access: userToken.access}});
});

export default userRouter;