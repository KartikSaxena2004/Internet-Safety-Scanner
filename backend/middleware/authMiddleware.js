const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const defaultSecret = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';
    const decoded = jwt.verify(token, defaultSecret);
    
    // Add user from payload to request object
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
