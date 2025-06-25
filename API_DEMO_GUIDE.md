# RestaurantX API Demo Guide

## API Server Status
✅ **Running on port 3001**
- Health check: http://localhost:3001/api/health
- Base URL: http://localhost:3001/api

## Available Endpoints

### 🍽️ Restaurant Discovery
```bash
# Get all restaurants
curl http://localhost:3001/api/restaurants

# Search restaurants
curl "http://localhost:3001/api/restaurants?search=Italian"
curl "http://localhost:3001/api/restaurants?cuisine=Japanese"
curl "http://localhost:3001/api/restaurants?city=San Francisco"

# Get restaurant details with menu
curl http://localhost:3001/api/restaurants/1
```

### 📅 Booking Management
```bash
# Create a booking
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "bookingDate": "2025-06-26",
    "startTime": "19:00",
    "guestCount": 2,
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "555-0123",
    "specialRequests": "Window table please"
  }' \
  http://localhost:3001/api/restaurants/1/bookings

# Get bookings by email
curl "http://localhost:3001/api/bookings?email=john@example.com"
```

### ⭐ Reviews
```bash
# Submit a review
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "customerName": "Jane Smith",
    "customerEmail": "jane@example.com",
    "rating": 5,
    "comment": "Amazing food and service!"
  }' \
  http://localhost:3001/api/restaurants/1/reviews
```

### 🔧 Utility Endpoints
```bash
# Get cuisine types
curl http://localhost:3001/api/cuisines

# Test database connection
curl http://localhost:3001/api/db-test
```

## Sample Data Available

### Restaurants (3 available)
1. **Bella Italia** (ID: 1)
   - Cuisine: Italian
   - Price Level: 3
   - Rating: 4.5
   - Full menu with appetizers, pasta, pizza, desserts

2. **Sakura Sushi** (ID: 2)
   - Cuisine: Japanese
   - Price Level: 4
   - Rating: 4.7

3. **The Garden Café** (ID: 3)
   - Cuisine: American
   - Price Level: 2
   - Rating: 4.3

## Mobile App Integration

### Testing the App
1. **Mobile (Recommended)**
   - Download Expo Go
   - Scan QR code in terminal
   - Test restaurant search, booking, reviews

2. **Web Browser**
   - Visit http://localhost:5000
   - Navigate through all screens

### API Integration Features
- ✅ Restaurant discovery with live data
- ✅ Real booking creation and retrieval
- ✅ Review submission
- ✅ Error handling with fallback to mock data
- ✅ Loading states and user feedback

## Database Schema Ready
The API includes a complete PostgreSQL schema for:
- Multi-tenant restaurant management
- User authentication and sessions
- Booking system with table management
- Menu categories and items
- Customer reviews and ratings
- Activity logging and analytics

## Next Steps for Production
1. Connect to PostgreSQL database (schema ready)
2. Add user authentication endpoints
3. Implement email notifications
4. Add payment processing integration
5. Set up admin dashboard for restaurant owners

## Testing Scenarios

### Scenario 1: New Customer Booking
1. Browse restaurants → GET /api/restaurants
2. View restaurant details → GET /api/restaurants/1
3. Make reservation → POST /api/restaurants/1/bookings
4. Check booking status → GET /api/bookings?email=customer@email.com

### Scenario 2: Restaurant Discovery
1. Search by cuisine → GET /api/restaurants?cuisine=Italian
2. Filter by location → GET /api/restaurants?city=San Francisco
3. Search by name → GET /api/restaurants?search=Bella

### Scenario 3: Customer Review
1. Visit restaurant details
2. Submit review → POST /api/restaurants/1/reviews
3. Review appears in restaurant details (after approval)