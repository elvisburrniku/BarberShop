import { login, getCurrentUser, changePassword } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

export function registerAuthRoutes(app) {
  // Login route
  app.post('/api/auth/login', login);
  
  // Get current user
  app.get('/api/auth/me', authenticate, getCurrentUser);
  
  // Change password
  app.post('/api/auth/change-password', authenticate, changePassword);
}