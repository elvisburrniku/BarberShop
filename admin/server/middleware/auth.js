import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { users } from '../../../shared/schema.js';
import { eq } from 'drizzle-orm';

// Authenticate middleware - validates JWT token and sets req.user
export const authenticate = async (req, res, next) => {
  try {
    // Get token from the header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'barberx-admin-jwt-secret');
    
    // Find the user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId));
      
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
    
    // Set req.user (without sensitive data)
    const { password, ...safeUser } = user;
    req.user = safeUser;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Admin only middleware - checks if authenticated user is an admin
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
  next();
};

// Generate JWT token for user
export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'barberx-admin-jwt-secret',
    { expiresIn: '24h' }
  );
};