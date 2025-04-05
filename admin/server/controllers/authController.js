import bcrypt from 'bcrypt';
import { db } from '../db.js';
import { users } from '../../../shared/schema.js';
import { eq } from 'drizzle-orm';
import { generateToken } from '../middleware/auth.js';

// Login with username and password
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }
    
    // Find user by username
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
    
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = generateToken(user.id);
    
    // Return user info without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user information
export const getCurrentUser = async (req, res) => {
  try {
    // User is already set in req by the authenticate middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error('Get current user error:', error.message);
    res.status(500).json({ message: 'Server error retrieving user information' });
  }
};

// Change password for current user
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }
    
    // Get the full user record including password
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id));
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    await db
      .update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, req.user.id));
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ message: 'Server error updating password' });
  }
};