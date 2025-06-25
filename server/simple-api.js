const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(cors({
  origin: ["http://localhost:5000", "http://localhost:3000", "https://8000-*.replit.dev", "https://5000-*.replit.dev"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mock restaurant data for testing
const mockRestaurants = [
  {
    id: 1,
    name: "Bella Italia",
    description: "Authentic Italian cuisine in the heart of downtown",
    cuisine: "Italian",
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    phone: "(415) 555-0123",
    email: "info@bellaitalia.com",
    website: "https://bellaitalia.com",
    lat: 37.7749,
    lng: -122.4194,
    rating: 4.5,
    priceLevel: 3,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    openingHours: {
      monday: { open: "11:00", close: "22:00" },
      tuesday: { open: "11:00", close: "22:00" },
      wednesday: { open: "11:00", close: "22:00" },
      thursday: { open: "11:00", close: "22:00" },
      friday: { open: "11:00", close: "23:00" },
      saturday: { open: "10:00", close: "23:00" },
      sunday: { open: "10:00", close: "21:00" }
    },
    isActive: true,
    approvalStatus: "approved",
  },
  {
    id: 2,
    name: "Sakura Sushi",
    description: "Fresh sushi and Japanese cuisine",
    cuisine: "Japanese",
    address: "456 California Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94108",
    phone: "(415) 555-0456",
    email: "orders@sakurasushi.com",
    website: "https://sakurasushi.com",
    lat: 37.7849,
    lng: -122.4094,
    rating: 4.7,
    priceLevel: 4,
    imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
    openingHours: {
      monday: { open: "17:00", close: "22:00" },
      tuesday: { open: "17:00", close: "22:00" },
      wednesday: { open: "17:00", close: "22:00" },
      thursday: { open: "17:00", close: "22:00" },
      friday: { open: "17:00", close: "23:00" },
      saturday: { open: "16:00", close: "23:00" },
      sunday: { open: "16:00", close: "21:00" }
    },
    isActive: true,
    approvalStatus: "approved",
  },
  {
    id: 3,
    name: "The Garden Café",
    description: "Farm-to-table dining with organic ingredients",
    cuisine: "American",
    address: "789 Market Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    phone: "(415) 555-0789",
    email: "hello@gardencafe.com",
    website: "https://gardencafe.com",
    lat: 37.7649,
    lng: -122.4194,
    rating: 4.3,
    priceLevel: 2,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    openingHours: {
      monday: { open: "08:00", close: "20:00" },
      tuesday: { open: "08:00", close: "20:00" },
      wednesday: { open: "08:00", close: "20:00" },
      thursday: { open: "08:00", close: "20:00" },
      friday: { open: "08:00", close: "21:00" },
      saturday: { open: "09:00", close: "21:00" },
      sunday: { open: "09:00", close: "20:00" }
    },
    isActive: true,
    approvalStatus: "approved",
  }
];

const mockMenuItems = [
  // Bella Italia menu
  {
    id: 1,
    restaurantId: 1,
    categoryId: 1,
    name: "Bruschetta al Pomodoro",
    description: "Grilled bread topped with fresh tomatoes, basil, and garlic",
    price: 12.95,
    imageUrl: "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400",
    category: "Appetizers",
    isAvailable: true,
  },
  {
    id: 2,
    restaurantId: 1,
    categoryId: 1,
    name: "Antipasto Classico",
    description: "Selection of cured meats, cheeses, olives, and roasted vegetables",
    price: 18.95,
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    category: "Appetizers",
    isAvailable: true,
  },
  {
    id: 3,
    restaurantId: 1,
    categoryId: 2,
    name: "Spaghetti Carbonara",
    description: "Classic Roman pasta with eggs, pecorino cheese, pancetta, and black pepper",
    price: 22.95,
    imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400",
    category: "Pasta",
    isAvailable: true,
  },
  {
    id: 4,
    restaurantId: 1,
    categoryId: 2,
    name: "Fettuccine Alfredo",
    description: "Fresh fettuccine in a rich parmesan cream sauce",
    price: 19.95,
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
    category: "Pasta",
    isAvailable: true,
  },
  {
    id: 5,
    restaurantId: 1,
    categoryId: 3,
    name: "Margherita",
    description: "San Marzano tomatoes, fresh mozzarella, basil, and extra virgin olive oil",
    price: 16.95,
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400",
    category: "Pizza",
    isAvailable: true,
  },
  {
    id: 6,
    restaurantId: 1,
    categoryId: 4,
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
    price: 8.95,
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
    category: "Desserts",
    isAvailable: true,
  }
];

const mockReviews = [
  {
    id: 1,
    restaurantId: 1,
    customerName: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    rating: 5,
    comment: "Absolutely amazing Italian food! The carbonara was perfection.",
    isApproved: true,
    createdAt: new Date('2024-12-20'),
  },
  {
    id: 2,
    restaurantId: 1,
    customerName: "Mike Chen",
    customerEmail: "mike@example.com",
    rating: 4,
    comment: "Great atmosphere and delicious food. Will definitely come back!",
    isApproved: true,
    createdAt: new Date('2024-12-18'),
  },
  {
    id: 3,
    restaurantId: 2,
    customerName: "Emily Davis",
    customerEmail: "emily@example.com",
    rating: 5,
    comment: "Best sushi in the city! Fresh ingredients and amazing presentation.",
    isApproved: true,
    createdAt: new Date('2024-12-19'),
  }
];

// In-memory storage for bookings (in production, use database)
let bookings = [];
let bookingIdCounter = 1;

// Restaurant discovery endpoints
app.get('/api/restaurants', (req, res) => {
  try {
    const { cuisine, city, search } = req.query;
    
    let filteredRestaurants = mockRestaurants.filter(r => r.isActive);
    
    if (cuisine) {
      filteredRestaurants = filteredRestaurants.filter(r => 
        r.cuisine.toLowerCase().includes(cuisine.toLowerCase())
      );
    }
    
    if (city) {
      filteredRestaurants = filteredRestaurants.filter(r => 
        r.city.toLowerCase().includes(city.toLowerCase())
      );
    }
    
    if (search) {
      filteredRestaurants = filteredRestaurants.filter(r => 
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.json(filteredRestaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get restaurant by ID with menu and reviews
app.get('/api/restaurants/:id', (req, res) => {
  try {
    const restaurantId = parseInt(req.params.id);
    const restaurant = mockRestaurants.find(r => r.id === restaurantId && r.isActive);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const menuItems = mockMenuItems.filter(item => item.restaurantId === restaurantId);
    const reviews = mockReviews.filter(review => review.restaurantId === restaurantId && review.isApproved);
    
    // Group menu items by category
    const menuCategories = {};
    menuItems.forEach(item => {
      if (!menuCategories[item.category]) {
        menuCategories[item.category] = [];
      }
      menuCategories[item.category].push(item);
    });

    res.json({
      ...restaurant,
      menuCategories,
      menuItems,
      reviews,
      tables: [
        { id: 1, tableNumber: 'T01', capacity: 2 },
        { id: 2, tableNumber: 'T02', capacity: 4 },
        { id: 3, tableNumber: 'T03', capacity: 6 },
        { id: 4, tableNumber: 'T04', capacity: 2 },
        { id: 5, tableNumber: 'T05', capacity: 4 },
      ]
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create booking
app.post('/api/restaurants/:id/bookings', (req, res) => {
  try {
    const restaurantId = parseInt(req.params.id);
    const restaurant = mockRestaurants.find(r => r.id === restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const {
      bookingDate,
      startTime,
      guestCount,
      customerName,
      customerEmail,
      customerPhone,
      specialRequests,
      tableId
    } = req.body;

    if (!bookingDate || !startTime || !guestCount || !customerName || !customerEmail) {
      return res.status(400).json({ 
        message: 'Missing required fields: bookingDate, startTime, guestCount, customerName, customerEmail' 
      });
    }

    const booking = {
      id: bookingIdCounter++,
      restaurantId,
      restaurantName: restaurant.name,
      bookingDate: new Date(bookingDate),
      startTime,
      endTime: null, // Will be calculated based on duration
      guestCount: parseInt(guestCount),
      customerName,
      customerEmail,
      customerPhone: customerPhone || null,
      specialRequests: specialRequests || null,
      tableId: tableId ? parseInt(tableId) : null,
      status: 'confirmed',
      createdAt: new Date(),
    };

    bookings.push(booking);

    console.log(`New booking created for ${customerName} at ${restaurant.name}`);

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get bookings by customer email
app.get('/api/bookings', (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email parameter is required' });
    }

    const customerBookings = bookings.filter(booking => 
      booking.customerEmail.toLowerCase() === email.toLowerCase()
    );

    res.json(customerBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Submit review
app.post('/api/restaurants/:id/reviews', (req, res) => {
  try {
    const restaurantId = parseInt(req.params.id);
    const { customerName, customerEmail, rating, comment } = req.body;

    if (!customerName || !customerEmail || !rating) {
      return res.status(400).json({ 
        message: 'Customer name, email, and rating are required' 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const review = {
      id: mockReviews.length + 1,
      restaurantId,
      customerName,
      customerEmail,
      rating: parseInt(rating),
      comment: comment || null,
      isApproved: false, // Reviews need approval
      createdAt: new Date(),
    };

    // In production, save to database
    console.log(`New review submitted for restaurant ${restaurantId} by ${customerName}`);

    res.status(201).json({
      message: 'Review submitted successfully and is pending approval',
      review: { id: review.id, rating: review.rating, comment: review.comment }
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get cuisines for filtering
app.get('/api/cuisines', (req, res) => {
  try {
    const cuisines = [...new Set(mockRestaurants.map(r => r.cuisine))].sort();
    res.json(cuisines);
  } catch (error) {
    console.error('Error fetching cuisines:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Test database connection
app.get('/api/db-test', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    
    res.json({ 
      status: 'Database connected successfully', 
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      status: 'Database connection failed', 
      error: error.message 
    });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Restaurant API server running on port ${port}`);
  console.log(`📱 Health check: http://localhost:${port}/api/health`);
  console.log(`🍽️  Restaurants: http://localhost:${port}/api/restaurants`);
  console.log(`📊 Database test: http://localhost:${port}/api/db-test`);
});

module.exports = app;