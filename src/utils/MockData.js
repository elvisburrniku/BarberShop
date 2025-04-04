// Mock data for the BarberX app

// Mock user data
export const mockUser = {
  id: 'user1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '(123) 456-7890',
  profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
  favorites: ['barber1', 'barber3'],
  createdAt: '2023-01-15T12:00:00Z'
};

// Mock barber shops data
export const mockBarberShops = [
  {
    id: 'barber1',
    name: 'Classic Cuts Barbershop',
    description: 'A traditional barbershop with modern style. Our experienced barbers provide quality haircuts and hot shaves in a relaxed atmosphere.',
    coverImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70',
    logo: 'https://logo.clearbit.com/classiccuts.com',
    rating: 4.8,
    reviewCount: 127,
    priceLevel: 2, // 1-3 scale ($ to $$$)
    isOpen: true,
    isFavorite: true,
    distance: 0.7, // miles
    location: {
      address: '123 Main Street, New York, NY 10001',
      lat: 40.7128,
      lng: -74.0060
    },
    serviceIds: ['service1', 'service2', 'service3', 'service5'],
    barbers: [
      {
        id: 'staff1',
        name: 'Mike Thompson',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 4.9,
        specialties: ['Fades', 'Classic Cuts']
      },
      {
        id: 'staff2',
        name: 'James Wilson',
        avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
        rating: 4.7,
        specialties: ['Beard Trims', 'Hot Towel Shaves']
      }
    ],
    reviews: [
      {
        userName: 'Robert B.',
        rating: 5,
        date: 'June 15, 2023',
        comment: 'Best haircut I\'ve had in years. Mike really knows what he\'s doing!'
      },
      {
        userName: 'Thomas K.',
        rating: 4,
        date: 'May 28, 2023',
        comment: 'Great atmosphere and good service. Prices are reasonable too.'
      },
      {
        userName: 'David M.',
        rating: 5,
        date: 'May 10, 2023',
        comment: 'I\'ve been coming here for over a year now. James always gives me the perfect fade.'
      }
    ]
  },
  {
    id: 'barber2',
    name: 'The Dapper Den',
    description: 'The Dapper Den combines traditional barber services with a modern twist. We focus on precision cuts, hot towel shaves, and great conversation.',
    coverImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1',
    logo: 'https://logo.clearbit.com/dapperden.com',
    rating: 4.5,
    reviewCount: 95,
    priceLevel: 3,
    isOpen: true,
    isFavorite: false,
    distance: 1.3,
    location: {
      address: '456 Broadway, New York, NY 10013',
      lat: 40.7234,
      lng: -74.0021
    },
    serviceIds: ['service1', 'service2', 'service4', 'service6'],
    barbers: [
      {
        id: 'staff3',
        name: 'Tony Stark',
        avatar: 'https://randomuser.me/api/portraits/men/83.jpg',
        rating: 4.6,
        specialties: ['Modern Styles', 'Beard Sculpting']
      },
      {
        id: 'staff4',
        name: 'Steve Rogers',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        rating: 4.8,
        specialties: ['Classic Cuts', 'Hot Towel Shaves']
      }
    ],
    reviews: [
      {
        userName: 'Mark L.',
        rating: 5,
        date: 'June 20, 2023',
        comment: 'Tony is a true artist with scissors. Love my new look!'
      },
      {
        userName: 'Brian J.',
        rating: 4,
        date: 'June 5, 2023',
        comment: 'Upscale place with great service. A bit pricey but worth it.'
      }
    ]
  },
  {
    id: 'barber3',
    name: 'Brooklyn Blades',
    description: 'Brooklyn Blades specializes in precision fades, beard trims, and straight razor shaves. Our barbers are trained in both classic and contemporary styles.',
    coverImage: 'https://images.unsplash.com/photo-1521490711625-7a2061430f26',
    logo: 'https://logo.clearbit.com/brooklynblades.com',
    rating: 4.9,
    reviewCount: 212,
    priceLevel: 2,
    isOpen: false,
    isFavorite: true,
    distance: 2.1,
    location: {
      address: '789 5th Ave, Brooklyn, NY 11215',
      lat: 40.6782,
      lng: -73.9442
    },
    serviceIds: ['service1', 'service2', 'service3', 'service5', 'service7'],
    barbers: [
      {
        id: 'staff5',
        name: 'Carlos Rodriguez',
        avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
        rating: 4.9,
        specialties: ['Fades', 'Hair Designs']
      },
      {
        id: 'staff6',
        name: 'Marcus Johnson',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        rating: 4.8,
        specialties: ['Beard Grooming', 'Skin Fades']
      }
    ],
    reviews: [
      {
        userName: 'Kevin T.',
        rating: 5,
        date: 'June 18, 2023',
        comment: 'Carlos gives the best fades in Brooklyn. Been going here for years!'
      },
      {
        userName: 'Michael P.',
        rating: 5,
        date: 'June 10, 2023',
        comment: 'Great vibes and even better haircuts. Highly recommend!'
      },
      {
        userName: 'Jason K.',
        rating: 4,
        date: 'May 30, 2023',
        comment: 'Marcus did an amazing job with my beard trim. Will definitely return.'
      }
    ]
  },
  {
    id: 'barber4',
    name: 'Sharp & Co.',
    description: 'Sharp & Co. is a premium barbershop offering quality haircuts, beard trims, and grooming products. We create a relaxed environment for our clients.',
    coverImage: 'https://images.unsplash.com/photo-1622288432450-277d0fef9f8a',
    logo: 'https://logo.clearbit.com/sharpandco.com',
    rating: 4.3,
    reviewCount: 78,
    priceLevel: 1,
    isOpen: true,
    isFavorite: false,
    distance: 3.5,
    location: {
      address: '321 Park Ave, New York, NY 10022',
      lat: 40.7581,
      lng: -73.9765
    },
    serviceIds: ['service1', 'service3', 'service4'],
    barbers: [
      {
        id: 'staff7',
        name: 'Ryan Cooper',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        rating: 4.3,
        specialties: ['Quick Cuts', 'Affordable Styles']
      },
      {
        id: 'staff8',
        name: 'Derek Mills',
        avatar: 'https://randomuser.me/api/portraits/men/39.jpg',
        rating: 4.4,
        specialties: ['Basic Cuts', 'Beard Trims']
      }
    ],
    reviews: [
      {
        userName: 'Paul R.',
        rating: 4,
        date: 'June 12, 2023',
        comment: 'Good budget option. Ryan is quick and does a decent job.'
      },
      {
        userName: 'Chris T.',
        rating: 3,
        date: 'May 25, 2023',
        comment: 'It\'s okay for the price. Sometimes there\'s a wait.'
      }
    ]
  }
];

// Mock services data
export const mockServices = [
  {
    id: 'service1',
    name: 'Haircut',
    description: 'Classic haircut with clippers and scissors, includes styling.',
    price: 35.00,
    duration: 30, // minutes
    image: 'https://images.unsplash.com/photo-1599351431613-18ef1fdd27e1'
  },
  {
    id: 'service2',
    name: 'Beard Trim',
    description: 'Shape and trim your beard to perfection.',
    price: 20.00,
    duration: 20,
    image: 'https://images.unsplash.com/photo-1590254667322-7c71b20c75c3'
  },
  {
    id: 'service3',
    name: 'Haircut & Beard Combo',
    description: 'Complete look refresh with a haircut and beard trim.',
    price: 50.00,
    duration: 45,
    image: 'https://images.unsplash.com/photo-1621369909828-558bb31f0312'
  },
  {
    id: 'service4',
    name: 'Hot Towel Shave',
    description: 'Traditional straight razor shave with hot towel treatment.',
    price: 40.00,
    duration: 30,
    image: 'https://images.unsplash.com/photo-1577467014381-6c1c7ce5baf3'
  },
  {
    id: 'service5',
    name: 'Kids Haircut',
    description: 'Haircut for children under 12 years old.',
    price: 25.00,
    duration: 20,
    image: 'https://images.unsplash.com/photo-1627211465866-d9e54dc5cd4e'
  },
  {
    id: 'service6',
    name: 'Executive Package',
    description: 'Premium haircut, hot towel shave, and facial treatment.',
    price: 75.00,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1588091210022-7a35885a823f'
  },
  {
    id: 'service7',
    name: 'Buzz Cut',
    description: 'Quick and easy all-over short cut with clippers.',
    price: 20.00,
    duration: 15,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033'
  }
];

// Mock appointments data
export const mockAppointments = [
  {
    id: 'app1',
    barberId: 'barber1',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    services: ['service1', 'service2'],
    status: 'upcoming',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: 'app2',
    barberId: 'barber3',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    services: ['service3'],
    status: 'completed',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() // 8 days ago
  },
  {
    id: 'app3',
    barberId: 'barber2',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    services: ['service6'],
    status: 'cancelled',
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString() // 11 days ago
  }
];
