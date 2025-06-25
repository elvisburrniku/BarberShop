import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage.js";
import {
  insertUserSchema,
  loginSchema,
  insertBookingSchema,
  insertCustomerSchema,
  insertSubscriptionPlanSchema,
  insertUserSubscriptionSchema,
  insertCompanyRegistrationSchema,
} from "../shared/schema.js";
import { z } from "zod";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  users,
  tenants,
  tenantUsers,
  restaurants,
  subscriptionPlans,
} from "../shared/schema.js";
import { eq, and } from "drizzle-orm";

// WebSocket connections store
const wsConnections = new Map<string, Set<WebSocket>>();

// Broadcast notification to all connected clients for a restaurant
function broadcastNotification(restaurantId: number, notification: any) {
  const restaurantKey = `restaurant_${restaurantId}`;
  const connections = wsConnections.get(restaurantKey);

  if (connections && connections.size > 0) {
    const message = JSON.stringify({
      type: "notification",
      notification: notification,
    });
    connections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to extract and validate tenant ID
  const validateTenant = async (req: any, res: any, next: any) => {
    const tenantId =
      req.params.tenantId ||
      req.headers["x-tenant-id"] ||
      req.query.tenantId ||
      req.body.tenantId;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    req.tenantId = parseInt(tenantId as string);
    next();
  };

  // Middleware to attach user from session to request
  const attachUser = (req: any, res: any, next: any) => {
    if (req.session && req.session.user) {
      req.user = req.session.user;
    }
    next();
  };

  // Apply session middleware to all routes
  app.use(attachUser);

  // Helper function to log activities
  const logActivity = async (params: {
    restaurantId?: number;
    tenantId?: number;
    eventType: string;
    description: string;
    source: string;
    userEmail?: string;
    userLogin?: string;
    guestEmail?: string;
    ipAddress?: string;
    userAgent?: string;
    bookingId?: number;
    customerId?: number;
    details?: any;
  }) => {
    try {
      await storage.createActivityLog({
        restaurantId: params.restaurantId,
        tenantId: params.tenantId,
        eventType: params.eventType,
        description: params.description,
        source: params.source,
        userEmail: params.userEmail,
        userLogin: params.userLogin,
        guestEmail: params.guestEmail,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        bookingId: params.bookingId,
        customerId: params.customerId,
        details: params.details,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  };

  // Company Registration route
  app.post("/api/auth/register-company", async (req, res) => {
    try {
      const { companyName, email, password, name, restaurantName, planId } =
        insertCompanyRegistrationSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Get free trial plan if no plan specified
      const plan = planId
        ? await storage.getSubscriptionPlan(planId)
        : (await storage.getSubscriptionPlans()).find(
            (p) => p.name === "Free Trial",
          );

      if (!plan) {
        return res.status(400).json({ message: "Invalid subscription plan" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create tenant with trial period
      const slug = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 50);
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + plan.trialDays);

      const tenant = await storage.createTenant({
        name: companyName,
        slug,
        subscriptionPlanId: plan.id,
        subscriptionStatus: "trial",
        trialEndDate,
        maxRestaurants: plan.maxRestaurants,
      });

      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        name,
        restaurantName,
      });

      // Link user to tenant
      await storage.createTenantUser({
        tenantId: tenant.id,
        userId: user.id,
        role: "administrator",
      });

      // Create first restaurant
      const restaurant = await storage.createRestaurant({
        tenantId: tenant.id,
        name: restaurantName,
        userId: user.id,
        emailSettings: JSON.stringify({}),
      });

      // Log company registration
      await logActivity({
        restaurantId: restaurant.id,
        tenantId: tenant.id,
        eventType: "company_registration",
        description: `New company "${companyName}" registered with restaurant "${restaurantName}"`,
        source: "registration",
        userEmail: email,
        userLogin: email,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: {
          companyName,
          restaurantName,
          planName: plan.name,
          subscriptionStatus: "trial"
        }
      });

      // For free plans, complete registration immediately and create session
      (req as any).session.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        restaurantName: user.restaurantName,
        createdAt: user.createdAt,
      };
      (req as any).session.tenant = tenant;
      (req as any).session.restaurant = restaurant;

      res.status(201).json({
        message: "Company created successfully",
        user: { id: user.id, email: user.email, name: user.name },
        tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug },
        restaurant: { id: restaurant.id, name: restaurant.name },
        trialEndsAt: trialEndDate,
        requiresPayment: false,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Registration failed" });
    }
  });

  // Session validation endpoint
  app.get("/api/auth/validate", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user;
      if (sessionUser) {
        res.json({
          valid: true,
          message: "Session valid",
          user: sessionUser,
          tenant: (req as any).session.tenant,
          restaurant: (req as any).session.restaurant,
        });
      } else {
        res.status(401).json({ valid: false, message: "No valid session" });
      }
    } catch (error) {
      res.status(401).json({ valid: false, message: "Invalid session" });
    }
  });

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validationResult = loginSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid input format",
          errors: validationResult.error.errors,
        });
      }

      const { email, password } = validationResult.data;
      const { rememberMe } = req.body;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password with bcrypt
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Get user's tenant information
      const tenantUser = await storage.getTenantByUserId(user.id);
      if (!tenantUser) {
        return res
          .status(401)
          .json({ message: "No restaurant found for this user" });
      }

      // Get user's restaurant
      const userRestaurants = await storage.getRestaurantsByTenant(tenantUser.id);
      const restaurant = userRestaurants.find(r => r.userId === user.id) || userRestaurants[0];

      // Store user in session for persistent authentication
      (req as any).session.user = { ...user, password: undefined };
      (req as any).session.tenant = tenantUser;
      (req as any).session.restaurant = restaurant;
      (req as any).session.rememberMe = rememberMe;

      // Log successful login
      await logActivity({
        restaurantId: restaurant?.id,
        tenantId: tenantUser.id,
        eventType: "login",
        description: `User logged in successfully`,
        source: "manual",
        userEmail: user.email,
        userLogin: user.email,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: {
          rememberMe,
          sessionDuration: rememberMe ? "30 days" : "24 hours"
        }
      });

      res.json({
        user: { ...user, password: undefined },
        tenant: tenantUser,
        restaurant: restaurant
          ? { ...restaurant, tenantId: restaurant.tenantId || tenantUser.id }
          : null,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  });

  // Logout route
  app.post("/api/auth/logout", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user;
      const sessionTenant = (req as any).session?.tenant;
      const sessionRestaurant = (req as any).session?.restaurant;

      // Log logout before destroying session
      if (sessionUser && sessionTenant) {
        await logActivity({
          restaurantId: sessionRestaurant?.id,
          tenantId: sessionTenant.id,
          eventType: "logout",
          description: `User logged out`,
          source: "manual",
          userEmail: sessionUser.email,
          userLogin: sessionUser.email,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        });
      }

      // Destroy session
      (req as any).session.destroy((err: any) => {
        if (err) {
          console.error("Session destruction error:", err);
          return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out successfully" });
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Restaurant discovery endpoints for mobile app
  app.get("/api/restaurants", async (req, res) => {
    try {
      const { cuisine, city, lat, lng, radius = 10 } = req.query;
      
      // Basic restaurant search - can be enhanced with location/filtering logic
      let query = storage.db.select().from(restaurants).where(eq(restaurants.isActive, true));
      
      // For now, return all active restaurants
      const allRestaurants = await query;
      
      res.json(allRestaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/restaurants/:id", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const restaurant = await storage.getRestaurantById(restaurantId);
      
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Get menu categories and items
      const menuCategories = await storage.getMenuCategoriesByRestaurant(restaurantId);
      const menuItems = await storage.getMenuItemsByRestaurant(restaurantId);
      const reviews = await storage.getReviewsByRestaurant(restaurantId);
      const tables = await storage.getTablesByRestaurant(restaurantId);

      res.json({
        ...restaurant,
        menuCategories,
        menuItems,
        reviews,
        tables,
      });
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Public booking endpoint for mobile app
  app.post("/api/restaurants/:id/bookings", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const restaurant = await storage.getRestaurantById(restaurantId);
      
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Get or create customer
      const customer = await storage.getOrCreateCustomer(
        restaurantId,
        restaurant.tenantId || 0,
        {
          name: req.body.customerName,
          email: req.body.customerEmail,
          phone: req.body.customerPhone,
        },
      );

      const bookingData = insertBookingSchema.parse({
        ...req.body,
        restaurantId,
        tenantId: restaurant.tenantId || 0,
        customerId: customer.id,
        bookingDate: new Date(req.body.bookingDate),
      });

      const booking = await storage.createBooking(bookingData);

      // Log booking creation
      await logActivity({
        restaurantId: booking.restaurantId,
        tenantId: booking.tenantId,
        eventType: "new_booking",
        description: `New booking created for ${booking.customerName}`,
        source: "mobile_app",
        guestEmail: booking.customerEmail,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        bookingId: booking.id,
        customerId: booking.customerId,
        details: {
          bookingDate: booking.bookingDate,
          startTime: booking.startTime,
          endTime: booking.endTime,
          guestCount: booking.guestCount,
          tableId: booking.tableId,
          status: booking.status
        }
      });

      res.status(201).json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Customer booking management
  app.get("/api/bookings", async (req, res) => {
    try {
      const { email } = req.query;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Find customer by email across all restaurants
      const customers = await storage.db
        .select()
        .from(storage.db.schema.customers)
        .where(eq(storage.db.schema.customers.email, email as string));

      if (customers.length === 0) {
        return res.json([]);
      }

      // Get all bookings for these customers
      const allBookings = [];
      for (const customer of customers) {
        const bookings = await storage.db
          .select()
          .from(storage.db.schema.bookings)
          .where(eq(storage.db.schema.bookings.customerId, customer.id));
        allBookings.push(...bookings);
      }

      res.json(allBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Review submission
  app.post("/api/restaurants/:id/reviews", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const { customerName, customerEmail, rating, comment } = req.body;

      if (!customerName || !customerEmail || !rating) {
        return res.status(400).json({ message: "Customer name, email, and rating are required" });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }

      const review = await storage.createReview({
        restaurantId,
        customerName,
        customerEmail,
        rating,
        comment,
        isApproved: false, // Reviews need approval
      });

      res.status(201).json({
        message: "Review submitted successfully and is pending approval",
        review: { ...review, id: review.id }
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Register endpoint
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: result.error.flatten().fieldErrors,
        });
      }

      const { email, password, name, restaurantName } = result.data;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create tenant for the new user with unique slug generation
      const baseSlug = (restaurantName || "restaurant")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 50);

      let slug = baseSlug;
      let counter = 1;
      let tenant;

      // Try to create tenant with unique slug
      while (true) {
        try {
          tenant = await storage.createTenant({
            name: restaurantName || "New Restaurant",
            slug,
            subscriptionStatus: "trial",
          });
          break;
        } catch (error: any) {
          if (error.code === "23505" && error.constraint === "tenants_slug_unique") {
            slug = `${baseSlug}-${counter}`;
            counter++;
            if (counter > 100) {
              throw new Error("Unable to generate unique slug");
            }
          } else {
            throw error;
          }
        }
      }

      // Create user using storage method
      const newUser = await storage.createUser({
        email,
        password: hashedPassword,
        name,
        restaurantName,
      });

      // Link user to tenant
      await storage.createTenantUser({
        tenantId: tenant.id,
        userId: newUser.id,
        role: "administrator",
      });

      // Create restaurant for the user
      const newRestaurant = await storage.createRestaurant({
        name: restaurantName || "New Restaurant",
        userId: newUser.id,
        tenantId: tenant.id,
        emailSettings: JSON.stringify({}),
        address: null,
        phone: null,
        email: null,
        description: null,
      });

      // Create session for the new user
      (req as any).session.user = { ...newUser, password: undefined };
      (req as any).session.tenant = tenant;
      (req as any).session.restaurant = newRestaurant;

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          restaurantName: newUser.restaurantName,
        },
        restaurant: newRestaurant,
        tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug },
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create HTTP server
  const server = createServer(app);

  // Setup WebSocket server
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    console.log("New WebSocket connection");

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === "subscribe" && data.restaurantId) {
          const restaurantKey = `restaurant_${data.restaurantId}`;
          
          if (!wsConnections.has(restaurantKey)) {
            wsConnections.set(restaurantKey, new Set());
          }
          
          wsConnections.get(restaurantKey)!.add(ws);
          console.log(`Client subscribed to restaurant ${data.restaurantId}`);
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    ws.on("close", () => {
      // Remove this connection from all restaurant subscriptions
      wsConnections.forEach((connections, key) => {
        connections.delete(ws);
        if (connections.size === 0) {
          wsConnections.delete(key);
        }
      });
      console.log("WebSocket connection closed");
    });
  });

  return server;
}