import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from 'Authorization: Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = decoded; // Add decoded user info to request object
    next(); // Proceed to the next middleware/route handler
  });
};

export default authenticateToken;
