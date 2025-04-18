import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const auth = async (req, res, next) => {
  try {
    // Get token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication failed: No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'alpha-beta');

    // Find user by ID from the decoded token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed: Invalid token.' });
    }

    // Attach the user object to the request for future routes to access
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(401).json({ message: 'Authentication failed: Invalid token.' });
  }
};

export default auth;