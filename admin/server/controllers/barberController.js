import { db } from '../db.js';
import { barberProfiles, users } from '../../../shared/schema.js';
import { eq, and, desc, asc, or, like, sql } from 'drizzle-orm';

// Get all barbers with pagination and filters
export const getAllBarbers = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sortBy, sortOrder } = req.query;
    const offset = (page - 1) * limit;
    
    // Build the query with filters
    let query = db
      .select({
        id: barberProfiles.id,
        userId: barberProfiles.userId,
        shopName: barberProfiles.shopName,
        description: barberProfiles.description,
        address: barberProfiles.address,
        city: barberProfiles.city,
        state: barberProfiles.state,
        zipCode: barberProfiles.zipCode,
        approvalStatus: barberProfiles.approvalStatus,
        rating: barberProfiles.rating,
        createdAt: barberProfiles.createdAt,
        updatedAt: barberProfiles.updatedAt,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone
      })
      .from(barberProfiles)
      .innerJoin(users, eq(barberProfiles.userId, users.id));
    
    // Add status filter if provided
    if (status) {
      query = query.where(eq(barberProfiles.approvalStatus, status));
    }
    
    // Add search filter if provided
    if (search) {
      query = query.where(
        or(
          like(barberProfiles.shopName, `%${search}%`),
          like(users.firstName, `%${search}%`),
          like(users.lastName, `%${search}%`),
          like(users.email, `%${search}%`),
          like(barberProfiles.city, `%${search}%`),
          like(barberProfiles.state, `%${search}%`)
        )
      );
    }
    
    // Add sorting
    const sortField = sortBy || 'createdAt';
    const order = sortOrder === 'asc' ? asc : desc;
    
    // Get the total count for pagination
    const [countResult] = await db
      .select({ count: sql`count(*)` })
      .from(barberProfiles)
      .innerJoin(users, eq(barberProfiles.userId, users.id));
    
    const total = parseInt(countResult.count);
    
    // Execute the final query with pagination
    const barbers = await query
      .orderBy(order(barberProfiles[sortField]))
      .limit(parseInt(limit))
      .offset(parseInt(offset));
    
    res.status(200).json({
      barbers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching barbers:', error);
    res.status(500).json({ message: 'Internal server error fetching barbers' });
  }
};

// Get a single barber by ID
export const getBarberById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [barber] = await db
      .select({
        id: barberProfiles.id,
        userId: barberProfiles.userId,
        shopName: barberProfiles.shopName,
        description: barberProfiles.description,
        address: barberProfiles.address,
        city: barberProfiles.city,
        state: barberProfiles.state,
        zipCode: barberProfiles.zipCode,
        lat: barberProfiles.lat,
        lng: barberProfiles.lng,
        approvalStatus: barberProfiles.approvalStatus,
        rating: barberProfiles.rating,
        createdAt: barberProfiles.createdAt,
        updatedAt: barberProfiles.updatedAt,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone
      })
      .from(barberProfiles)
      .innerJoin(users, eq(barberProfiles.userId, users.id))
      .where(eq(barberProfiles.id, id));
    
    if (!barber) {
      return res.status(404).json({ message: 'Barber not found' });
    }
    
    res.status(200).json({ barber });
  } catch (error) {
    console.error('Error fetching barber by ID:', error);
    res.status(500).json({ message: 'Internal server error fetching barber details' });
  }
};

// Update barber approval status
export const updateBarberStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalStatus } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(approvalStatus)) {
      return res.status(400).json({ message: 'Invalid status. Must be pending, approved, or rejected.' });
    }
    
    const [barber] = await db
      .select()
      .from(barberProfiles)
      .where(eq(barberProfiles.id, id));
    
    if (!barber) {
      return res.status(404).json({ message: 'Barber not found' });
    }
    
    // Update the barber's approval status
    const [updatedBarber] = await db
      .update(barberProfiles)
      .set({ 
        approvalStatus,
        updatedAt: new Date()
      })
      .where(eq(barberProfiles.id, id))
      .returning();
    
    // If the barber is approved, update the user role to barber
    if (approvalStatus === 'approved') {
      await db
        .update(users)
        .set({ role: 'barber' })
        .where(eq(users.id, barber.userId));
    }
    
    res.status(200).json({ 
      message: `Barber status updated to ${approvalStatus}`,
      barber: updatedBarber
    });
  } catch (error) {
    console.error('Error updating barber status:', error);
    res.status(500).json({ message: 'Internal server error updating barber status' });
  }
};