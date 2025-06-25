// Mock data for the RestaurantX app

// Mock user data
export const mockUser = {
  id: 'user1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '(123) 456-7890',
  profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
  favorites: ['restaurant1', 'restaurant3'],
  createdAt: '2023-01-15T12:00:00Z'
};

// Mock restaurants data
export const mockRestaurants = [
  {
    id: 'restaurant1',
    name: 'Bella Vista Italian',
    description: 'Authentic Italian cuisine with a modern twist. Fresh pasta made daily and wood-fired pizzas in a cozy atmosphere.',
    cuisine: 'Italian',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    logo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
    rating: 4.8,
    reviewCount: 127,
    priceLevel: 3, // 1-4 scale ($ to $$$$)
    isOpen: true,
    isFavorite: true,
    distance: 0.7, // miles
    location: {
      address: '123 Main Street, New York, NY 10001',
      lat: 40.7128,
      lng: -74.0060
    },
    phone: '(555) 123-4567',
    website: 'www.bellavistany.com',
    hours: {
      monday: '11:00 AM - 10:00 PM',
      tuesday: '11:00 AM - 10:00 PM',
      wednesday: '11:00 AM - 10:00 PM',
      thursday: '11:00 AM - 10:00 PM',
      friday: '11:00 AM - 11:00 PM',
      saturday: '10:00 AM - 11:00 PM',
      sunday: '10:00 AM - 9:00 PM'
    },
    specialties: ['Handmade Pasta', 'Wood-fired Pizza', 'Italian Wine']
  },
  {
    id: 'restaurant2',
    name: 'Tokyo Sushi House',
    description: 'Fresh sushi and traditional Japanese dishes prepared by master chefs. Premium ingredients and authentic flavors.',
    cuisine: 'Japanese',
    coverImage: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
    logo: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
    rating: 4.9,
    reviewCount: 89,
    priceLevel: 4,
    isOpen: true,
    isFavorite: false,
    distance: 1.2,
    location: {
      address: '456 Park Avenue, New York, NY 10016',
      lat: 40.7549,
      lng: -73.9840
    },
    phone: '(555) 987-6543',
    website: 'www.tokyosushihouse.com',
    hours: {
      monday: 'Closed',
      tuesday: '5:00 PM - 10:00 PM',
      wednesday: '5:00 PM - 10:00 PM',
      thursday: '5:00 PM - 10:00 PM',
      friday: '5:00 PM - 11:00 PM',
      saturday: '12:00 PM - 11:00 PM',
      sunday: '12:00 PM - 9:00 PM'
    },
    specialties: ['Omakase', 'Fresh Sashimi', 'Sake Selection']
  },
  {
    id: 'restaurant3',
    name: 'The Garden Bistro',
    description: 'Farm-to-table dining with seasonal menus. Locally sourced ingredients and creative contemporary dishes.',
    cuisine: 'American',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    rating: 4.6,
    reviewCount: 203,
    priceLevel: 2,
    isOpen: true,
    isFavorite: true,
    distance: 2.1,
    location: {
      address: '789 Garden Street, Brooklyn, NY 11201',
      lat: 40.6892,
      lng: -73.9442
    },
    phone: '(555) 456-7890',
    website: 'www.gardenbistro.com',
    hours: {
      monday: '8:00 AM - 9:00 PM',
      tuesday: '8:00 AM - 9:00 PM',
      wednesday: '8:00 AM - 9:00 PM',
      thursday: '8:00 AM - 9:00 PM',
      friday: '8:00 AM - 10:00 PM',
      saturday: '9:00 AM - 10:00 PM',
      sunday: '9:00 AM - 8:00 PM'
    },
    specialties: ['Seasonal Menu', 'Organic Ingredients', 'Craft Cocktails']
  }
];

// Mock menu items
export const mockMenuItems = [
  {
    id: 'menu1',
    restaurantId: 'restaurant1',
    category: 'Appetizers',
    name: 'Bruschetta al Pomodoro',
    description: 'Grilled bread topped with fresh tomatoes, basil, and mozzarella',
    price: 1200, // stored in cents
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f'
  },
  {
    id: 'menu2',
    restaurantId: 'restaurant1',
    category: 'Main Course',
    name: 'Spaghetti Carbonara',
    description: 'Classic Roman pasta with eggs, pecorino cheese, pancetta, and black pepper',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5'
  },
  {
    id: 'menu3',
    restaurantId: 'restaurant2',
    category: 'Sushi',
    name: 'Omakase Selection',
    description: "Chef's choice of 12 pieces of premium sushi with miso soup",
    price: 6500,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351'
  }
];

// Mock reservations data
export const mockReservations = [
  {
    id: 'res1',
    restaurantId: 'restaurant1',
    userId: 'user1',
    date: '2024-01-15T19:00:00Z',
    partySize: 4,
    status: 'confirmed',
    specialRequests: 'Window table preferred',
    createdAt: '2024-01-10T12:00:00Z'
  },
  {
    id: 'res2',
    restaurantId: 'restaurant2',
    userId: 'user1',
    date: '2024-01-20T20:00:00Z',
    partySize: 2,
    status: 'pending',
    specialRequests: '',
    createdAt: '2024-01-12T15:30:00Z'
  }
];

// Mock reviews data
export const mockReviews = [
  {
    id: 'review1',
    restaurantId: 'restaurant1',
    userId: 'user1',
    userName: 'John D.',
    rating: 5,
    comment: 'Amazing pasta and excellent service! The carbonara was perfect.',
    date: '2024-01-10T18:00:00Z',
    verified: true
  },
  {
    id: 'review2',
    restaurantId: 'restaurant1',
    userId: 'user2',
    userName: 'Sarah M.',
    rating: 4,
    comment: 'Great atmosphere and delicious food. Will definitely come back!',
    date: '2024-01-08T20:30:00Z',
    verified: true
  }
];

// Mock featured restaurants
export const mockFeaturedRestaurants = [
  mockRestaurants[0],
  mockRestaurants[2]
];

// Mock cuisine categories
export const mockCuisineCategories = [
  { id: 'italian', name: 'Italian', icon: '🍝' },
  { id: 'japanese', name: 'Japanese', icon: '🍣' },
  { id: 'american', name: 'American', icon: '🍔' },
  { id: 'mexican', name: 'Mexican', icon: '🌮' },
  { id: 'chinese', name: 'Chinese', icon: '🥟' },
  { id: 'indian', name: 'Indian', icon: '🍛' }
];