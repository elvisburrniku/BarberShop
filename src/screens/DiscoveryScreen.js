import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { 
  Searchbar, 
  Title, 
  Chip, 
  Text, 
  useTheme, 
  ActivityIndicator 
} from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import RestaurantCard from '../components/RestaurantCard';
import LocationSearch from '../components/LocationSearch';
import { getBarbersByLocation } from '../utils/LocationService';

const DiscoveryScreen = ({ navigation }) => {
  const theme = useTheme();
  const { barberShops, userLocation, locationError, loading } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBarbers, setFilteredBarbers] = useState(barberShops);
  const [selectedFilter, setSelectedFilter] = useState('nearest');
  const [locationSearchVisible, setLocationSearchVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Current Location');

  useEffect(() => {
    if (locationError) {
      Alert.alert(
        "Location Error",
        "We couldn't access your location. Some features may be limited.",
        [{ text: "OK" }]
      );
    }
  }, [locationError]);

  useEffect(() => {
    filterBarberShops();
  }, [selectedFilter, barberShops, searchQuery]);

  const filterBarberShops = () => {
    let filtered = [...barberShops];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(barber => 
        barber.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        barber.location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sort filter
    switch (selectedFilter) {
      case 'nearest':
        filtered = filtered.sort((a, b) => a.distance - b.distance);
        break;
      case 'rating':
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price':
        filtered = filtered.sort((a, b) => a.priceLevel - b.priceLevel);
        break;
      case 'favorites':
        filtered = filtered.filter(barber => barber.isFavorite);
        break;
      default:
        break;
    }
    
    setFilteredBarbers(filtered);
  };

  const handleLocationSelect = (location) => {
    setCurrentLocation(location.description || 'Selected Location');
    setLocationSearchVisible(false);
    // In a real app, we would call an API to get barbers near this location
  };

  const renderFilters = () => {
    const filters = [
      { id: 'nearest', label: 'Nearest' },
      { id: 'rating', label: 'Top Rated' },
      { id: 'price', label: 'Price ↓' },
      { id: 'favorites', label: 'Favorites' },
    ];

    return (
      <View style={styles.filtersContainer}>
        {filters.map(filter => (
          <Chip
            key={filter.id}
            selected={selectedFilter === filter.id}
            onPress={() => setSelectedFilter(filter.id)}
            style={[
              styles.filterChip,
              selectedFilter === filter.id && { backgroundColor: theme.colors.primary }
            ]}
            textStyle={selectedFilter === filter.id ? { color: '#fff' } : {}}
          >
            {filter.label}
          </Chip>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 10 }}>Finding barbers near you...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search barbers or services"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <Chip 
          icon="map-marker" 
          onPress={() => setLocationSearchVisible(true)}
          style={styles.locationChip}
        >
          {currentLocation}
        </Chip>
        
        {locationSearchVisible && (
          <LocationSearch
            visible={locationSearchVisible} 
            onDismiss={() => setLocationSearchVisible(false)}
            onSelectLocation={handleLocationSelect}
          />
        )}
      </View>

      {renderFilters()}

      <View style={styles.resultsContainer}>
        <Title style={styles.resultsTitle}>
          {filteredBarbers.length} {filteredBarbers.length === 1 ? 'Barber' : 'Barbers'} Found
        </Title>
        
        {filteredBarbers.length > 0 ? (
          <FlatList
            data={filteredBarbers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BarberCard 
                barber={item}
                onPress={() => navigation.navigate('BarberDetail', { barberId: item.id })}
                style={styles.barberCard}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No barbers found matching your criteria</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    marginBottom: 10,
    elevation: 2,
  },
  locationChip: {
    alignSelf: 'flex-start',
  },
  filtersContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterChip: {
    marginRight: 8,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsTitle: {
    marginBottom: 16,
    fontSize: 18,
  },
  barberCard: {
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default DiscoveryScreen;
