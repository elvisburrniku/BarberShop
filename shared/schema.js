import { pgTable, serial, text, boolean, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enum for user roles
export const userRoleEnum = pgEnum('user_role', ['admin', 'user', 'barber']);

// Enum for appointment status
export const appointmentStatusEnum = pgEnum('appointment_status', ['pending', 'confirmed', 'cancelled', 'completed']);

// Enum for barber approval status
export const approvalStatusEnum = pgEnum('approval_status', ['pending', 'approved', 'rejected']);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: userRoleEnum('role').default('user').notNull(),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User relations
export const usersRelations = relations(users, ({ one, many }) => ({
  barberProfile: one(barberProfiles, {
    fields: [users.id],
    references: [barberProfiles.userId],
  }),
  appointments: many(appointments),
}));

// Barber profiles table
export const barberProfiles = pgTable('barber_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  shopName: text('shop_name').notNull(),
  description: text('description'),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zip_code').notNull(),
  lat: text('lat'),
  lng: text('lng'),
  rating: integer('rating'),
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