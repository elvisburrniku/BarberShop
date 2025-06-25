import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import RatingStars from './RatingStars';
import RippleEffect from './RippleEffect';

const RestaurantCard = ({ restaurant, onPress, style }) => {
  const theme = useTheme();

  const getPriceLevelText = (level) => {
    return '$'.repeat(level);
  };

  const getDistanceText = (distance) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)}m`;
    }
    return `${distance.toFixed(1)}mi`;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, style]}
      activeOpacity={0.9}
    >
      <RippleEffect>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: restaurant.coverImage }}
              style={styles.restaurantImage}
              resizeMode="cover"
            />
            
            {/* Status Badge */}
            <View style={[
              styles.statusBadge,
              {
                backgroundColor: restaurant.isOpen 
                  ? '#2ecc71' 
                  : theme.colors.error
              }
            ]}>
              <Text style={[styles.statusText, { color: '#ffffff' }]}>
                {restaurant.isOpen ? 'Open' : 'Closed'}
              </Text>
            </View>

            {/* Favorite Icon */}
            <TouchableOpacity
              style={[styles.favoriteButton, { backgroundColor: theme.colors.surface }]}
              onPress={(e) => {
                e.stopPropagation();
                // Handle favorite toggle
              }}
            >
              <MaterialIcons
                name={restaurant.isFavorite ? 'favorite' : 'favorite-border'}
                size={20}
                color={restaurant.isFavorite ? '#e74c3c' : theme.colors.onSurface}
              />
            </TouchableOpacity>

            {/* Distance Badge */}
            {restaurant.distance && (
              <View style={[styles.distanceBadge, { backgroundColor: theme.colors.primaryContainer }]}>
                <Text style={[styles.distanceText, { color: theme.colors.onPrimaryContainer }]}>
                  {getDistanceText(restaurant.distance)}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Text style={[styles.restaurantName, { color: theme.colors.onSurface }]} numberOfLines={1}>
                {restaurant.name}
              </Text>
              <Text style={[styles.priceLevel, { color: theme.colors.primary }]}>
                {getPriceLevelText(restaurant.priceLevel)}
              </Text>
            </View>

            <Text style={[styles.cuisine, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
              {restaurant.cuisine}
            </Text>

            <View style={styles.ratingContainer}>
              <RatingStars rating={restaurant.rating} size={14} />
              <Text style={[styles.ratingText, { color: theme.colors.onSurfaceVariant }]}>
                {restaurant.rating} ({restaurant.reviewCount})
              </Text>
            </View>

            {restaurant.specialties && restaurant.specialties.length > 0 && (
              <View style={styles.specialtiesContainer}>
                <Chip
                  style={[styles.specialtyChip, { backgroundColor: theme.colors.secondaryContainer }]}
                  textStyle={[styles.specialtyText, { color: theme.colors.onSecondaryContainer }]}
                  compact
                >
                  {restaurant.specialties[0]}
                </Chip>
                {restaurant.specialties.length > 1 && (
                  <Text style={[styles.moreSpecialties, { color: theme.colors.onSurfaceVariant }]}>
                    +{restaurant.specialties.length - 1} more
                  </Text>
                )}
              </View>
            )}

            <View style={styles.footer}>
              <View style={styles.locationContainer}>
                <MaterialIcons name="location-on" size={14} color={theme.colors.onSurfaceVariant} />
                <Text style={[styles.address, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
                  {restaurant.location.address.split(',')[0]}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </RippleEffect>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 160,
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  priceLevel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cuisine: {
    fontSize: 14,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 12,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  specialtyChip: {
    height: 24,
    marginRight: 8,
  },
  specialtyText: {
    fontSize: 11,
  },
  moreSpecialties: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  address: {
    marginLeft: 4,
    fontSize: 12,
    flex: 1,
  },
});

export default RestaurantCard;