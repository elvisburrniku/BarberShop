import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Image, TouchableOpacity, Animated, Dimensions, Linking } from 'react-native';
import { Title, Text, useTheme, Card, Button, Chip, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import RatingStars from '../components/RatingStars';
import MaterialButton from '../components/MaterialButton';

const { width } = Dimensions.get('window');

const RestaurantDetailScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { restaurants, menuItems, toggleFavoriteRestaurant } = useAppContext();
  const { restaurantId } = route.params;
  
  const restaurant = restaurants.find(r => r.id === restaurantId);
  const restaurantMenu = menuItems.filter(item => item.restaurantId === restaurantId);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Mock images for gallery
  const images = [
    restaurant?.coverImage,
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'
  ];

  const handleReserveNow = () => {
    navigation.navigate('Reservation', { restaurantId: restaurant.id });
  };

  const handleCallRestaurant = () => {
    if (restaurant?.phone) {
      Linking.openURL(`tel:${restaurant.phone}`);
    }
  };

  const handleToggleFavorite = () => {
    toggleFavoriteRestaurant(restaurant.id);
  };

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Restaurant not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setSelectedImageIndex(index);
            }}
          >
            {images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.restaurantImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          
          {/* Image indicators */}
          <View style={styles.imageIndicators}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  {
                    backgroundColor: index === selectedImageIndex 
                      ? theme.colors.primary 
                      : 'rgba(255,255,255,0.5)'
                  }
                ]}
              />
            ))}
          </View>

          {/* Favorite button */}
          <TouchableOpacity
            style={[styles.favoriteButton, { backgroundColor: theme.colors.surface }]}
            onPress={handleToggleFavorite}
          >
            <MaterialIcons
              name={restaurant.isFavorite ? 'favorite' : 'favorite-border'}
              size={24}
              color={restaurant.isFavorite ? '#e74c3c' : theme.colors.onSurface}
            />
          </TouchableOpacity>
        </View>

        {/* Restaurant Info */}
        <View style={[styles.infoContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Title style={[styles.restaurantName, { color: theme.colors.onSurface }]}>
                {restaurant.name}
              </Title>
              <Text style={[styles.cuisine, { color: theme.colors.onSurfaceVariant }]}>
                {restaurant.cuisine} • {'$'.repeat(restaurant.priceLevel)}
              </Text>
            </View>
            
            <View style={styles.ratingContainer}>
              <RatingStars rating={restaurant.rating} size={16} />
              <Text style={[styles.ratingText, { color: theme.colors.onSurfaceVariant }]}>
                {restaurant.rating} ({restaurant.reviewCount} reviews)
              </Text>
            </View>
          </View>

          <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            {restaurant.description}
          </Text>

          {/* Specialties */}
          <View style={styles.specialtiesContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Specialties
            </Text>
            <View style={styles.chipContainer}>
              {restaurant.specialties?.map((specialty, index) => (
                <Chip
                  key={index}
                  style={[styles.chip, { backgroundColor: theme.colors.primaryContainer }]}
                  textStyle={{ color: theme.colors.onPrimaryContainer }}
                >
                  {specialty}
                </Chip>
              ))}
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Contact Info */}
          <View style={styles.contactContainer}>
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleCallRestaurant}
            >
              <MaterialIcons name="phone" size={20} color={theme.colors.primary} />
              <Text style={[styles.contactText, { color: theme.colors.onSurface }]}>
                {restaurant.phone}
              </Text>
            </TouchableOpacity>

            <View style={styles.contactItem}>
              <MaterialIcons name="location-on" size={20} color={theme.colors.primary} />
              <Text style={[styles.contactText, { color: theme.colors.onSurface }]}>
                {restaurant.location.address}
              </Text>
            </View>

            <View style={styles.contactItem}>
              <MaterialIcons name="access-time" size={20} color={theme.colors.primary} />
              <Text style={[styles.contactText, { color: theme.colors.onSurface }]}>
                {restaurant.isOpen ? 'Open Now' : 'Closed'}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Menu Preview */}
          <View style={styles.menuContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Menu Highlights
            </Text>
            {restaurantMenu.slice(0, 3).map((item) => (
              <Card key={item.id} style={[styles.menuCard, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.menuItem}>
                  <Image source={{ uri: item.image }} style={styles.menuImage} />
                  <View style={styles.menuInfo}>
                    <Text style={[styles.menuName, { color: theme.colors.onSurface }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.menuDescription, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <Text style={[styles.menuPrice, { color: theme.colors.primary }]}>
                      ${(item.price / 100).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Fixed Bottom Button */}
      <View style={[styles.bottomContainer, { backgroundColor: theme.colors.surface }]}>
        <MaterialButton
          title="Reserve Now"
          onPress={handleReserveNow}
          style={styles.reserveButton}
          icon="restaurant"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  restaurantImage: {
    width,
    height: 300,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoContainer: {
    flex: 1,
    padding: 16,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cuisine: {
    fontSize: 16,
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  specialtiesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 20,
  },
  contactContainer: {
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    marginLeft: 12,
    fontSize: 16,
  },
  menuContainer: {
    marginBottom: 80,
  },
  menuCard: {
    marginBottom: 12,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    padding: 12,
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  menuInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  menuName: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuDescription: {
    fontSize: 14,
    marginVertical: 4,
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reserveButton: {
    width: '100%',
  },
});

export default RestaurantDetailScreen;