// In a real app, this would use the Google Maps API or similar
// For this MVP, we'll use mock data

// Mock location search results
const mockLocations = [
  {
    id: 'loc1',
    name: 'New York, NY',
    description: 'New York City, New York, USA',
    placeId: 'ChIJOwg_06VPwokRYv534QaPC8g',
    lat: 40.7128,
    lng: -74.0060
  },
  {
    id: 'loc2',
    name: 'Brooklyn, NY',
    description: 'Brooklyn, New York, USA',
    placeId: 'ChIJCSF8lBZEwokRhngABHRcdoI',
    lat: 40.6782,
    lng: -73.9442
  },
  {
    id: 'loc3',
    name: 'Manhattan, NY',
    description: 'Manhattan, New York, USA',
    placeId: 'ChIJYeZuBI9YwokRjMDs_IEyCwo',
    lat: 40.7831,
    lng: -73.9712
  },
  {
    id: 'loc4',
    name: 'Newark, NJ',
    description: 'Newark, New Jersey, USA',
    placeId: 'ChIJHQ6aMnBTwokRc-T-3CrcvOE',
    lat: 40.7357,
    lng: -74.1724
  },
  {
    id: 'loc5',
    name: 'New Orleans, LA',
    description: 'New Orleans, Louisiana, USA',
    placeId: 'ChIJZYIRslSkIIYRtNMiXuhbBts',
    lat: 29.9511,
    lng: -90.0715
  }
];

/**
 * Search for locations based on query
 * @param {string} query - The search query
 * @returns {Promise<Array>} - Array of location results
 */
export const searchLocations = async (query) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter mock locations that match the query
  const results = mockLocations.filter(location => 
    location.name.toLowerCase().includes(query.toLowerCase()) ||
    location.description.toLowerCase().includes(query.toLowerCase())
  );
  
  return results;
};

/**
 * Get barbers near a specific location
 * @param {Object} location - Location object with lat and lng
 * @param {number} radius - Search radius in miles
 * @returns {Promise<Array>} - Array of barber shops near the location
 */
export const getBarbersByLocation = async (location, radius = 5) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real app, we would use the Google Places API or similar
  // For this MVP, we'll return all barber shops with calculated distances
  // from mockData.js
  
  // Import would be done at the top of the file in a real app
  // For demonstration purposes, assuming barberShops is available from context
  return [];
};

/**
 * Get the current user's location
 * @returns {Promise<Object>} - Object with lat and lng
 */
export const getCurrentLocation = async () => {
  // This would use the device's GPS in a real app
  // For this MVP, we'll return a default location (NYC)
  return {
    lat: 40.7128,
    lng: -74.0060
  };
};

/**
 * Calculate distance between two coordinates (in miles)
 * Uses the Haversine formula
 * @param {Object} coord1 - First coordinate {lat, lng}
 * @param {Object} coord2 - Second coordinate {lat, lng}
 * @returns {number} - Distance in miles
 */
export const calculateDistance = (coord1, coord2) => {
  const toRad = (x) => x * Math.PI / 180;
  const R = 3958.8; // Earth's radius in miles
  
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};
