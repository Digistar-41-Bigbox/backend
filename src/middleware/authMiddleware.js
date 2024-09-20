const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'You are unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // The decoded token contains userId and role
    next();
  } catch (error) {
    res.status(401).json({ message: 'You are unauthorized' });
  }
};

// Middleware to authorize by role
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have the necessary permissions' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole
};
