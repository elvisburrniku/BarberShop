import { db } from "./db.js";
import {
  users,
  tenants,
  tenantUsers,
  restaurants,
  bookings,
  customers,
  tables,
  subscriptionPlans,
  activityLogs,
  menuCategories,
  menuItems,
  reviews,
} from "../shared/schema.js";
import { eq, and, gte, lte, desc, asc, count } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<any | undefined>;
  getUserByEmail(email: string): Promise<any | undefined>;
  getUserById(id: number): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  updateUser(id: number, updates: any): Promise<any | undefined>;

  // Tenant methods
  createTenant(tenant: any): Promise<any>;
  getTenantById(id: number): Promise<any | undefined>;
  getTenantByUserId(userId: number): Promise<any | undefined>;
  createTenantUser(tenantUser: { tenantId: number; userId: number; role: string }): Promise<void>;

  // Restaurant methods
  createRestaurant(restaurant: any): Promise<any>;
  getRestaurantById(id: number): Promise<any | undefined>;
  getRestaurantsByTenant(tenantId: number): Promise<any[]>;
  updateRestaurant(id: number, updates: any): Promise<any | undefined>;

  // Booking methods
  createBooking(booking: any): Promise<any>;
  getBookingById(id: number): Promise<any | undefined>;
  getBookingsByRestaurant(restaurantId: number): Promise<any[]>;
  getBookingsByDate(restaurantId: number, date: string): Promise<any[]>;
  updateBooking(id: number, updates: any): Promise<any | undefined>;
  deleteBooking(id: number): Promise<boolean>;
  getBookingCountForTenantThisMonth(tenantId: number): Promise<number>;
  isBookingAllowed(restaurantId: number, date: Date, time: string): Promise<boolean>;

  // Customer methods
  createCustomer(customer: any): Promise<any>;
  getCustomerById(id: number): Promise<any | undefined>;
  getCustomersByRestaurant(restaurantId: number): Promise<any[]>;
  updateCustomer(id: number, updates: any): Promise<any | undefined>;
  deleteCustomer(id: number): Promise<boolean>;
  getOrCreateCustomer(restaurantId: number, tenantId: number, customerData: { name: string; email: string; phone?: string }): Promise<any>;

  // Table methods
  createTable(table: any): Promise<any>;
  getTableById(id: number): Promise<any | undefined>;
  getTablesByRestaurant(restaurantId: number): Promise<any[]>;
  updateTable(id: number, updates: any): Promise<any | undefined>;
  deleteTable(id: number): Promise<boolean>;

  // Subscription methods
  getSubscriptionPlans(): Promise<any[]>;
  getSubscriptionPlan(id: number): Promise<any | undefined>;
  getSubscriptionPlanById(id: number): Promise<any | undefined>;

  // Activity logging
  createActivityLog(log: any): Promise<any>;
  getActivityLogsByRestaurant(restaurantId: number, limit?: number): Promise<any[]>;

  // Menu methods
  getMenuCategoriesByRestaurant(restaurantId: number): Promise<any[]>;
  getMenuItemsByRestaurant(restaurantId: number): Promise<any[]>;
  getMenuItemsByCategory(categoryId: number): Promise<any[]>;

  // Review methods
  getReviewsByRestaurant(restaurantId: number): Promise<any[]>;
  createReview(review: any): Promise<any>;

  // Database access
  db: typeof db;
}

export class DatabaseStorage implements IStorage {
  db = db;

  // User methods
  async getUser(id: number): Promise<any | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<any | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserById(id: number): Promise<any | undefined> {
    return this.getUser(id);
  }

  async createUser(user: any): Promise<any> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, updates: any): Promise<any | undefined> {
    const [updatedUser] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return updatedUser || undefined;
  }

  // Tenant methods
  async createTenant(tenant: Partial<Tenant>): Promise<Tenant> {
    const [newTenant] = await db.insert(tenants).values(tenant).returning();
    return newTenant;
  }

  async getTenantById(id: number): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant || undefined;
  }

  async getTenantByUserId(userId: number): Promise<Tenant | undefined> {
    const [result] = await db
      .select({
        id: tenants.id,
        name: tenants.name,
        slug: tenants.slug,
        subscriptionPlanId: tenants.subscriptionPlanId,
        subscriptionStatus: tenants.subscriptionStatus,
        trialEndDate: tenants.trialEndDate,
        maxRestaurants: tenants.maxRestaurants,
        createdAt: tenants.createdAt,
        updatedAt: tenants.updatedAt,
      })
      .from(tenants)
      .innerJoin(tenantUsers, eq(tenants.id, tenantUsers.tenantId))
      .where(eq(tenantUsers.userId, userId));
    return result || undefined;
  }

  async createTenantUser(tenantUser: { tenantId: number; userId: number; role: string }): Promise<void> {
    await db.insert(tenantUsers).values(tenantUser);
  }

  // Restaurant methods
  async createRestaurant(restaurant: Partial<Restaurant>): Promise<Restaurant> {
    const [newRestaurant] = await db.insert(restaurants).values(restaurant).returning();
    return newRestaurant;
  }

  async getRestaurantById(id: number): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id));
    return restaurant || undefined;
  }

  async getRestaurantsByTenant(tenantId: number): Promise<Restaurant[]> {
    return await db.select().from(restaurants).where(eq(restaurants.tenantId, tenantId));
  }

  async updateRestaurant(id: number, updates: Partial<Restaurant>): Promise<Restaurant | undefined> {
    const [updatedRestaurant] = await db.update(restaurants).set(updates).where(eq(restaurants.id, id)).returning();
    return updatedRestaurant || undefined;
  }

  // Booking methods
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async getBookingById(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getBookingsByRestaurant(restaurantId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.restaurantId, restaurantId))
      .orderBy(desc(bookings.bookingDate));
  }

  async getBookingsByDate(restaurantId: number, date: string): Promise<Booking[]> {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    return await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.restaurantId, restaurantId),
          gte(bookings.bookingDate, startDate),
          lte(bookings.bookingDate, endDate)
        )
      )
      .orderBy(asc(bookings.startTime));
  }

  async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | undefined> {
    const [updatedBooking] = await db.update(bookings).set(updates).where(eq(bookings.id, id)).returning();
    return updatedBooking || undefined;
  }

  async deleteBooking(id: number): Promise<boolean> {
    const result = await db.delete(bookings).where(eq(bookings.id, id));
    return result.rowCount > 0;
  }

  async getBookingCountForTenantThisMonth(tenantId: number): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [result] = await db
      .select({ count: count() })
      .from(bookings)
      .where(
        and(
          eq(bookings.tenantId, tenantId),
          gte(bookings.createdAt, startOfMonth),
          lte(bookings.createdAt, endOfMonth)
        )
      );
    return result.count || 0;
  }

  async isBookingAllowed(restaurantId: number, date: Date, time: string): Promise<boolean> {
    // Basic implementation - can be enhanced with restaurant-specific rules
    const now = new Date();
    const bookingDateTime = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    bookingDateTime.setHours(hours, minutes);

    // Don't allow bookings in the past
    return bookingDateTime > now;
  }

  // Customer methods
  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async getCustomerById(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || undefined;
  }

  async getCustomersByRestaurant(restaurantId: number): Promise<Customer[]> {
    return await db.select().from(customers).where(eq(customers.restaurantId, restaurantId));
  }

  async updateCustomer(id: number, updates: Partial<Customer>): Promise<Customer | undefined> {
    const [updatedCustomer] = await db.update(customers).set(updates).where(eq(customers.id, id)).returning();
    return updatedCustomer || undefined;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    const result = await db.delete(customers).where(eq(customers.id, id));
    return result.rowCount > 0;
  }

  async getOrCreateCustomer(
    restaurantId: number,
    tenantId: number,
    customerData: { name: string; email: string; phone?: string }
  ): Promise<Customer> {
    // Try to find existing customer by email and restaurant
    const [existingCustomer] = await db
      .select()
      .from(customers)
      .where(
        and(
          eq(customers.restaurantId, restaurantId),
          eq(customers.email, customerData.email)
        )
      );

    if (existingCustomer) {
      return existingCustomer;
    }

    // Create new customer
    return await this.createCustomer({
      restaurantId,
      tenantId,
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
    });
  }

  // Table methods
  async createTable(table: Partial<Table>): Promise<Table> {
    const [newTable] = await db.insert(tables).values(table).returning();
    return newTable;
  }

  async getTableById(id: number): Promise<Table | undefined> {
    const [table] = await db.select().from(tables).where(eq(tables.id, id));
    return table || undefined;
  }

  async getTablesByRestaurant(restaurantId: number): Promise<Table[]> {
    return await db.select().from(tables).where(eq(tables.restaurantId, restaurantId));
  }

  async updateTable(id: number, updates: Partial<Table>): Promise<Table | undefined> {
    const [updatedTable] = await db.update(tables).set(updates).where(eq(tables.id, id)).returning();
    return updatedTable || undefined;
  }

  async deleteTable(id: number): Promise<boolean> {
    const result = await db.delete(tables).where(eq(tables.id, id));
    return result.rowCount > 0;
  }

  // Subscription methods
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
  }

  async getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return plan || undefined;
  }

  async getSubscriptionPlanById(id: number): Promise<SubscriptionPlan | undefined> {
    return this.getSubscriptionPlan(id);
  }

  // Activity logging
  async createActivityLog(log: Partial<ActivityLog>): Promise<ActivityLog> {
    const [newLog] = await db.insert(activityLogs).values(log).returning();
    return newLog;
  }

  async getActivityLogsByRestaurant(restaurantId: number, limit: number = 50): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.restaurantId, restaurantId))
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
  }

  // Menu methods
  async getMenuCategoriesByRestaurant(restaurantId: number): Promise<MenuCategory[]> {
    return await db
      .select()
      .from(menuCategories)
      .where(and(eq(menuCategories.restaurantId, restaurantId), eq(menuCategories.isActive, true)))
      .orderBy(asc(menuCategories.sortOrder));
  }

  async getMenuItemsByRestaurant(restaurantId: number): Promise<MenuItem[]> {
    return await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.restaurantId, restaurantId))
      .orderBy(asc(menuItems.sortOrder));
  }

  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return await db
      .select()
      .from(menuItems)
      .where(and(eq(menuItems.categoryId, categoryId), eq(menuItems.isAvailable, true)))
      .orderBy(asc(menuItems.sortOrder));
  }

  // Review methods
  async getReviewsByRestaurant(restaurantId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.restaurantId, restaurantId), eq(reviews.isApproved, true)))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: Partial<Review>): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }
}

export const storage = new DatabaseStorage();