const jwt = require('jsonwebtoken');

// Ensure a strong secret key in production
const SECRET_KEY = process.env.JWT_SECRET_KEY;

// Function to generate a JWT token
function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

// Authentication middleware
const authenticateJWT = (req, res, next) => {
  // Check header or cookie for token
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Authorization token required' });
  }
};

// Middleware function to verify JWT tokens
function verifyToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  let tokenArr = token.split(' ');

  jwt.verify(tokenArr[1], jwtSecretKey, (err) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    //req.user = decoded;
    next();
  });
}

// Middleware to check JWT token in cookie
const verifyTokenFromCookie = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = {
  generateToken,
  verifyToken,
  verifyTokenFromCookie,
  authenticateJWT
};
