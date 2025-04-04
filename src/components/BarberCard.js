import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import RatingStars from './RatingStars';

const BarberCard = ({ barber, onPress, style }) => {
  const theme = useTheme();

  if (!barber) return null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={[styles.card, style]}>
        <Card.Cover 
          source={{ uri: barber.coverImage }}
          style={styles.cardImage}
        />
        {barber.isFavorite && (
          <View style={styles.favoriteIcon}>
            <Icon name="heart" size={16} color="#fff" />
          </View>
        )}
        <Card.Content style={styles.content}>
          <Title style={styles.title}>{barber.name}</Title>
          
          <View style={styles.ratingContainer}>
            <RatingStars rating={barber.rating} size={16} />
            <Text style={styles.reviewCount}>({barber.reviewCount})</Text>
          </View>
          
          <Paragraph style={styles.address} numberOfLines={1}>
            {barber.location.address}
          </Paragraph>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detail}>
              <Icon name="map-pin" size={14} color={theme.colors.primary} />
              <Text style={styles.detailText}>{barber.distance} mi</Text>
            </View>
            
            <View style={styles.detail}>
              <Icon 
                name="clock" 
                size={14} 
                color={barber.isOpen ? theme.colors.primary : '#999'} 
              />
              <Text 
                style={[
                  styles.detailText, 
                  { color: barber.isOpen ? '#000' : '#999' }
                ]}
              >
                {barber.isOpen ? 'Open Now' : 'Closed'}
              </Text>
            </View>
            
            <View style={styles.detail}>
              <Icon name="dollar-sign" size={14} color={theme.colors.primary} />
              <Text style={styles.detailText}>
                {'$'.repeat(barber.priceLevel)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardImage: {
    height: 150,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 4,
  },
  content: {
    paddingVertical: 12,
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
    color: '#666',
    marginLeft: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
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
