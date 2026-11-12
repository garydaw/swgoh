import { timingSafeEqual } from 'node:crypto';

const botAuthMiddleware = async (req, res, next) => {

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : '';

  const expectedToken = process.env.DISCORD_BACKEND_API_SECRET;
  
  if (!token || !expectedToken) {
    return res.status(401).json({
      message: 'Unauthorised'
    });
  }

  const supplied = Buffer.from(token);
  const expected = Buffer.from(expectedToken);

  if (
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  ) {
    return res.status(401).json({
      message: 'Unauthorised'
    });
  }

  next();
};

export default botAuthMiddleware;

