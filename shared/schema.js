import { pgTable, serial, text, boolean, timestamp, integer, pgEnum, decimal, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'user', 'restaurant_owner']);
export const reservationStatusEnum = pgEnum('reservation_status', ['pending', 'confirmed', 'cancelled', 'completed']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'cancelled', 'completed', 'no_show']);
export const approvalStatusEnum = pgEnum('approval_status', ['pending', 'approved', 'rejected']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['trial', 'active', 'cancelled', 'expired']);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  restaurantName: text('restaurant_name'),
  role: userRoleEnum('role').default('user').notNull(),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tenants table for multi-restaurant management
export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  subscriptionPlanId: integer('subscription_plan_id').references(() => subscriptionPlans.id),
  subscriptionStatus: subscriptionStatusEnum('subscription_status').default('trial').notNull(),
  trialEndDate: timestamp('trial_end_date'),
  maxRestaurants: integer('max_restaurants').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tenant Users relationship table
export const tenantUsers = pgTable('tenant_users', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  role: text('role').default('user').notNull(), // administrator, manager, user
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Subscription Plans table
export const subscriptionPlans = pgTable('subscription_plans', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(), // in cents
  maxRestaurants: integer('max_restaurants').default(1).notNull(),
  maxBookingsPerMonth: integer('max_bookings_per_month').default(100).notNull(),
  trialDays: integer('trial_days').default(14).notNull(),
  features: json('features'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Restaurants table
export const restaurants = pgTable('restaurants', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  cuisine: text('cuisine'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  zipCode: text('zip_code'),
  phone: text('phone'),
  email: text('email'),
  website: text('website'),
  lat: decimal('lat', { precision: 10, scale: 8 }),
  lng: decimal('lng', { precision: 11, scale: 8 }),
  rating: decimal('rating', { precision: 3, scale: 2 }),
  priceLevel: integer('price_level').default(2), // 1-4 scale
  imageUrl: text('image_url'),
  openingHours: json('opening_hours'),
  emailSettings: json('email_settings'),
  isActive: boolean('is_active').default(true).notNull(),
  approvalStatus: approvalStatusEnum('approval_status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tables (restaurant seating)
export const tables = pgTable('tables', {
  id: serial('id').primaryKey(),
  restaurantId: integer('restaurant_id').references(() => restaurants.id).notNull(),
  tenantId: integer('tenant_id').references(() => tenants.id),
  tableNumber: text('table_number').notNull(),
  capacity: integer('capacity').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Customers table
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  restaurantId: integer('restaurant_id').references(() => restaurants.id).notNull(),
  tenantId: integer('tenant_id').references(() => tenants.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Bookings table
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  restaurantId: integer('restaurant_id').references(() => restaurants.id).notNull(),
  tenantId: integer('tenant_id').references(() => tenants.id),
  customerId: integer('customer_id').references(() => customers.id).notNull(),
  tableId: integer('table_id').references(() => tables.id),
  bookingDate: timestamp('booking_date').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time'),
  guestCount: integer('guest_count').notNull(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone'),
  specialRequests: text('special_requests'),
  status: bookingStatusEnum('status').default('pending').notNull(),
  managementHash: text('management_hash'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Menu categories
export const menuCategories = pgTable('menu_categories', {
  id: serial('id').primaryKey(),
  restaurantId: integer('restaurant_id').references(() => restaurants.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Menu items
export const menuItems = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  restaurantId: integer('restaurant_id').references(() => restaurants.id).notNull(),
  categoryId: integer('category_id').references(() => menuCategories.id),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  isAvailable: boolean('is_available').default(true).notNull(),
  allergens: json('allergens'),
  nutritionalInfo: json('nutritional_info'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Reviews table
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  restaurantId: integer('restaurant_id').references(() => restaurants.id).notNull(),
  customerId: integer('customer_id').references(() => customers.id),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  rating: integer('rating').notNull(), // 1-5 scale
  comment: text('comment'),
  isApproved: boolean('is_approved').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Activity logs
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  restaurantId: integer('restaurant_id').references(() => restaurants.id),
  tenantId: integer('tenant_id').references(() => tenants.id),
  eventType: text('event_type').notNull(),
  description: text('description').notNull(),
  source: text('source').notNull(),
  userEmail: text('user_email'),
  userLogin: text('user_login'),
  guestEmail: text('guest_email'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  bookingId: integer('booking_id').references(() => bookings.id),
  customerId: integer('customer_id').references(() => customers.id),
  details: json('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  restaurantName: z.string().optional(),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const insertBookingSchema = z.object({
  restaurantId: z.number(),
  tenantId: z.number(),
  customerId: z.number(),
  tableId: z.number().optional(),
  bookingDate: z.date(),
  startTime: z.string(),
  endTime: z.string().optional(),
  guestCount: z.number().min(1),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  specialRequests: z.string().optional(),
});

export const insertCustomerSchema = z.object({
  restaurantId: z.number(),
  tenantId: z.number().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export const insertSubscriptionPlanSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  maxRestaurants: z.number().min(1),
  maxBookingsPerMonth: z.number().min(1),
  trialDays: z.number().min(0),
  features: z.any().optional(),
});

export const insertUserSubscriptionSchema = z.object({
  userId: z.number(),
  subscriptionPlanId: z.number(),
});

export const insertCompanyRegistrationSchema = z.object({
  companyName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  restaurantName: z.string().min(1),
  planId: z.number().optional(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  restaurants: many(restaurants),
  tenantUsers: many(tenantUsers),
}));

export const tenantsRelations = relations(tenants, ({ one, many }) => ({
  subscriptionPlan: one(subscriptionPlans, {
    fields: [tenants.subscriptionPlanId],
    references: [subscriptionPlans.id],
  }),
  restaurants: many(restaurants),
  tenantUsers: many(tenantUsers),
  customers: many(customers),
  bookings: many(bookings),
}));

export const restaurantsRelations = relations(restaurants, ({ one, many }) => ({
  user: one(users, {
    fields: [restaurants.userId],
    references: [users.id],
  }),
  tenant: one(tenants, {
    fields: [restaurants.tenantId],
    references: [tenants.id],
  }),
  bookings: many(bookings),
  customers: many(customers),
  tables: many(tables),
  menuCategories: many(menuCategories),
  menuItems: many(menuItems),
  reviews: many(reviews),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [bookings.restaurantId],
    references: [restaurants.id],
  }),
  customer: one(customers, {
    fields: [bookings.customerId],
    references: [customers.id],
  }),
  table: one(tables, {
    fields: [bookings.tableId],
    references: [tables.id],
  }),
  tenant: one(tenants, {
    fields: [bookings.tenantId],
    references: [tenants.id],
  }),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [customers.restaurantId],
    references: [restaurants.id],
  }),
  bookings: many(bookings),
  reviews: many(reviews),
}));

export const tablesRelations = relations(tables, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [tables.restaurantId],
    references: [restaurants.id],
  }),
  bookings: many(bookings),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [reviews.restaurantId],
    references: [restaurants.id],
  }),
  customer: one(customers, {
    fields: [reviews.customerId],
    references: [customers.id],
  }),
}));
  phone: text('phone'),
  website: text('website'),
  hours: text('hours'), // JSON string for operating hours
  approvalStatus: approvalStatusEnum('approval_status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Barber profile relations
export const barberProfilesRelations = relations(barberProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [barberProfiles.userId],
    references: [users.id],
  }),
  services: many(services),
  appointments: many(appointments, { relationName: 'barberAppointments' }),
}));

// Services table
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  barberId: integer('barber_id').references(() => barberProfiles.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(), // Stored in cents
  durationMinutes: integer('duration_minutes').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Service relations
export const servicesRelations = relations(services, ({ one, many }) => ({
  barber: one(barberProfiles, {
    fields: [services.barberId],
    references: [barberProfiles.id],
  }),
  appointments: many(appointments),
}));

// Appointments table
export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  barberId: integer('barber_id').references(() => barberProfiles.id).notNull(),
  serviceId: integer('service_id').references(() => services.id).notNull(),
  date: timestamp('date').notNull(),
  status: appointmentStatusEnum('status').default('pending').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Appointment relations
export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
  barber: one(barberProfiles, {
    fields: [appointments.barberId],
    references: [barberProfiles.id],
    relationName: 'barberAppointments',
  }),
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
}));

// Reviews table
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  barberId: integer('barber_id').references(() => barberProfiles.id).notNull(),
  appointmentId: integer('appointment_id').references(() => appointments.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Review relations
export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  barber: one(barberProfiles, {
    fields: [reviews.barberId],
    references: [barberProfiles.id],
  }),
  appointment: one(appointments, {
    fields: [reviews.appointmentId],
    references: [appointments.id],
  }),
}));