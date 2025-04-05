import bcrypt from 'bcrypt';
import { db } from './db.js';
import { users, userRoleEnum } from '../../shared/schema.js';
import { eq } from 'drizzle-orm';

export async function setupDb() {
  try {
    console.log('Checking database connection...');
    
    // Test database connection
    await db.execute('SELECT NOW()');
    console.log('Database connection successful');
    
    // Check if admin user exists, if not create one
    await createAdminUser();
    
    return true;
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
}

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await db.select()
      .from(users)
      .where(eq(users.role, userRoleEnum.enumValues[0])) // 'admin'
      .limit(1);
    
    if (existingAdmin.length > 0) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create default admin user
    const defaultPassword = 'adminpassword';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
    
    await db.insert(users).values({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@barberx.com',
      name: 'Admin User',
      role: userRoleEnum.enumValues[0], // 'admin'
    });
    
    console.log('Default admin user created');
  } catch (error) {
    console.error('Failed to create admin user:', error);
    throw error;
  }
}