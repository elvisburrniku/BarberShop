import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Title, Paragraph, Text, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import RatingStars from './RatingStars';
import MaterialCard from './MaterialCard';
import RippleEffect from './RippleEffect';

const BarberCard = ({ barber, onPress, style }) => {
  const theme = useTheme();
  const [scaleAnim] = useState(new Animated.Value(1));
  
  if (!barber) return null;
  
  // Handle elevation animation on press
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }]
        },
        style
      ]}
    >
      <MaterialCard 
        elevation={2}
        onPress={onPress}
        style={styles.card}
      >
        <View>
          {/* Card Image and Favorite Overlay */}
          <View style={styles.imageContainer}>
            <View style={styles.cardImage}>
              {barber.coverImage ? (
                <View style={styles.imageWrapper}>
                  <View style={styles.imagePlaceholder} />
                  <Animated.Image 
                    source={{ uri: barber.coverImage }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <View style={[styles.imagePlaceholder, { backgroundColor: `${theme.colors.primary}20` }]}>
                  <MaterialIcons name="content-cut" size={40} color={theme.colors.primary} />
                </View>
              )}
            </View>
            
            {/* Favorite icon */}
            {barber.isFavorite && (
              <View style={[styles.favoriteIcon, { backgroundColor: theme.colors.accent }]}>
                <MaterialIcons name="favorite" size={16} color="#fff" />
              </View>
            )}
          </View>

          <View style={styles.content}>
            <Title style={[styles.title, { color: theme.colors.text }]}>
              {barber.name}
            </Title>
            
            <View style={styles.ratingContainer}>
              <RatingStars rating={barber.rating} size={16} />
              <Text style={[styles.reviewCount, { color: theme.colors.placeholder }]}>
                ({barber.reviewCount})
              </Text>
            </View>
            
            <Paragraph style={[styles.address, { color: theme.colors.placeholder }]} numberOfLines={1}>
              {barber.location.address}
            </Paragraph>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detail}>
                <MaterialIcons 
                  name="place" 
                  size={14} 
                  color={theme.colors.primary} 
                />
                <Text style={[styles.detailText, { color: theme.colors.text }]}>
                  {barber.distance} mi
                </Text>
              </View>
              
              <View style={styles.detail}>
                <MaterialIcons 
                  name="access-time" 
                  size={14} 
                  color={barber.isOpen ? theme.colors.secondary : theme.colors.placeholder} 
                />
                <Text 
                  style={[
                    styles.detailText, 
                    { 
                      color: barber.isOpen ? theme.colors.secondary : theme.colors.placeholder 
                    }
                  ]}
                >
                  {barber.isOpen ? 'Open Now' : 'Closed'}
                </Text>
              </View>
              
              <View style={styles.detail}>
                <MaterialIcons 
                  name="attach-money" 
                  size={14} 
                  color={theme.colors.primary} 
                />
                <Text style={[styles.detailText, { color: theme.colors.text }]}>
                  {'$'.repeat(barber.priceLevel)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </MaterialCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 2,
    marginBottom: 16,
  },
  card: {
    padding: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  cardImage: {
    height: 150,
    position: 'relative',
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 12,
    padding: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewCount: {
    fontSize: 12,
    marginLeft: 4,
  },
  address: {
    fontSize: 14,
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default BarberCard;
