import { getAllBarbers, getBarberById, updateBarberStatus } from '../controllers/barberController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

export function registerBarberRoutes(app) {
  // Apply authentication middleware to all barber routes
  const router = app;
  
  // Get all barbers with pagination and filters
  router.get('/api/barbers', authenticate, adminOnly, getAllBarbers);
  
  // Get barber by ID
  router.get('/api/barbers/:id', authenticate, adminOnly, getBarberById);
  
  // Update barber status (approve/reject)
  router.patch('/api/barbers/:id/status', authenticate, adminOnly, updateBarberStatus);
}