import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  
  // Check if the current route should be excluded
  if (
        req.path === '/auth/login'
        || req.path === '/auth/check'
        || req.path.slice(0, 18) === '/database/migrate/' 
        || req.path.slice(0, 13) === '/swgoh/guild/' 
      ) {
    return next(); // Skip middleware for excluded routes
  }

  //get the token from the cookie
  const authToken = req.cookies.token; 

  //if no token then not logged in
  if (!authToken) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  //verify the token
  return jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token expired or invalid' });
    }
    req.user = {user_name:decoded.username};
    if(!req.query.hasOwnProperty("ally_code")){
      req.query.ally_code = decoded.username;
    }
    
    //verify user is an admin for these routes
    return next();
  });  
  
  
  //verify the token
  /*const valid = await auth.verifyAuthToken(authToken);

  jwt.verify(token.replace('Bearer ', ''), process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ message: 'Session Expired' });
    }
    //must have access
    if (
        req.path === '/swgoh/units' 
        || req.path === '/swgoh/bestmods'
        || (req.method === "DELETE" && req.path.slice(0, 6) === '/team/')
        || (req.method === "POST" && req.path.slice(0, 6) === '/team/')
        || req.path.slice(0, 7) === '/users/' 
        || req.path.slice(0, 25) === '/rote/operation/allocate/' 
        || req.path.slice(0, 20) === '/rote/operation/swap'
        || (req.method === "POST" && req.path.slice(0, 6) === '/journeyGuide/')
        
      ) {
      if (decoded.access === 0) {
        return res.status(401).json({ message: 'Insuffient access' });
      }
    }
  });*/
   
  
};

export default authMiddleware;