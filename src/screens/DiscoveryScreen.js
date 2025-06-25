import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { 
  Searchbar, 
  Title, 
  Chip, 
  Text, 
  useTheme, 
  ActivityIndicator 
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import RestaurantCard from '../components/RestaurantCard';

const DiscoveryScreen = ({ navigation }) => {
  const theme = useTheme();
  const { 
    restaurants, 
    cuisineCategories,
    userLocation, 
    loading, 
    locationError,
    findNearbyRestaurants,
    searchRestaurants
  } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [sortBy, setSortBy] = useState('distance');
  const [priceFilter, setPriceFilter] = useState([]);

  useEffect(() => {
    findNearbyRestaurants();
  }, []);

  const getFilteredRestaurants = () => {
    let filtered = [...restaurants];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchRestaurants(searchQuery);
    }

    // Apply cuisine filter
    if (selectedCuisines.length > 0) {
      filtered = filtered.filter(restaurant => 
        selectedCuisines.includes(restaurant.cuisine.toLowerCase())
      );
    }

    // Apply price filter
    if (priceFilter.length > 0) {
      filtered = filtered.filter(restaurant => 
        priceFilter.includes(restaurant.priceLevel)
      );
    }

    // Sort results
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price':
        filtered.sort((a, b) => a.priceLevel - b.priceLevel);
        break;
      case 'distance':
      default:
        filtered.sort((a, b) => (a.distance || 999) - (b.distance || 999));
        break;
    }

    return filtered;
  };

  const filteredRestaurants = getFilteredRestaurants();

  const toggleCuisineFilter = (cuisine) => {
    setSelectedCuisines(prev => {
      if (prev.includes(cuisine)) {
        return prev.filter(c => c !== cuisine);
      } else {
        return [...prev, cuisine];
      }
    });
  };

  const togglePriceFilter = (price) => {
    setPriceFilter(prev => {
      if (prev.includes(price)) {
        return prev.filter(p => p !== price);
      } else {
        return [...prev, price];
      }
    });
  };

  const renderRestaurantItem = ({ item }) => (
    <RestaurantCard
      restaurant={item}
      onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: item.id })}
      style={styles.restaurantCard}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search restaurants, cuisine..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
        />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        <View style={styles.filtersRow}>
          {/* Sort Chips */}
          <Chip
            selected={sortBy === 'distance'}
            onPress={() => setSortBy('distance')}
            style={[styles.filterChip, sortBy === 'distance' && { backgroundColor: theme.colors.primary }]}
            textStyle={{ color: sortBy === 'distance' ? theme.colors.onPrimary : theme.colors.onSurface }}
          >
            Distance
          </Chip>
          <Chip
            selected={sortBy === 'rating'}
            onPress={() => setSortBy('rating')}
            style={[styles.filterChip, sortBy === 'rating' && { backgroundColor: theme.colors.primary }]}
            textStyle={{ color: sortBy === 'rating' ? theme.colors.onPrimary : theme.colors.onSurface }}
          >
            Rating
          </Chip>
          <Chip
            selected={sortBy === 'price'}
            onPress={() => setSortBy('price')}
            style={[styles.filterChip, sortBy === 'price' && { backgroundColor: theme.colors.primary }]}
            textStyle={{ color: sortBy === 'price' ? theme.colors.onPrimary : theme.colors.onSurface }}
          >
            Price
          </Chip>

          {/* Cuisine Filters */}
          {cuisineCategories.map((cuisine) => (
            <Chip
              key={cuisine.id}
              selected={selectedCuisines.includes(cuisine.id)}
              onPress={() => toggleCuisineFilter(cuisine.id)}
              style={[
                styles.filterChip,
                selectedCuisines.includes(cuisine.id) && { backgroundColor: theme.colors.secondary }
              ]}
              textStyle={{
                color: selectedCuisines.includes(cuisine.id) 
                  ? theme.colors.onSecondary 
                  : theme.colors.onSurface
              }}
            >
              {cuisine.icon} {cuisine.name}
            </Chip>
          ))}

          {/* Price Filters */}
          {[1, 2, 3, 4].map((price) => (
            <Chip
              key={price}
              selected={priceFilter.includes(price)}
              onPress={() => togglePriceFilter(price)}
              style={[
                styles.filterChip,
                priceFilter.includes(price) && { backgroundColor: theme.colors.tertiary }
              ]}
              textStyle={{
                color: priceFilter.includes(price) 
                  ? theme.colors.onTertiary 
                  : theme.colors.onSurface
              }}
            >
              {'$'.repeat(price)}
            </Chip>
          ))}
        </View>
      </ScrollView>

      {/* Results */}
      <View style={styles.resultsContainer}>
        <Text style={[styles.resultsText, { color: theme.colors.onSurfaceVariant }]}>
          {filteredRestaurants.length} restaurants found
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
              Finding restaurants...
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredRestaurants}
            renderItem={renderRestaurantItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  filtersContainer: {
    maxHeight: 50,
    marginBottom: 16,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChip: {
    marginRight: 8,
    height: 32,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultsText: {
    fontSize: 14,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  restaurantCard: {
    marginBottom: 16,
  },
});

export default DiscoveryScreen;