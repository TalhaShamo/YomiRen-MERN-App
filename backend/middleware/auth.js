const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  // Get token from the header
  const authHeader = req.header('Authorization');

  // Check if token exists
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // The header format is "Bearer TOKEN"
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload to the request object
    req.user = decoded.user;
    
    // Pass control to the next function (our route handler)
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
}

module.exports = auth;