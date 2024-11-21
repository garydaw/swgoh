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
    if (req.path === '/auth/passwordReset'
      || req.path === '/auth/changeAdmin'
      || (req.method === "POST" && req.path.slice(0, 8) === '/journey')
      || (req.method === "POST" && req.path.slice(0, 5) === '/rote')
    ) {
      if(decoded.access !== 1){
        return res.status(403).json({ message: 'You dont have the required permissions' });
      }  
    }

    return next();
  }); 
};

export default authMiddleware;