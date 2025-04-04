import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const RatingStars = ({ rating, size = 16, style }) => {
  // Round rating to nearest half star
  const roundedRating = Math.round(rating * 2) / 2;
  
  // Create array of 5 stars
  const stars = [];
  
  // Add full stars
  for (let i = 1; i <= Math.floor(roundedRating); i++) {
    stars.push({ id: i, type: 'full' });
  }
  
  // Add half star if needed
  if (roundedRating % 1 !== 0) {
    stars.push({ id: stars.length + 1, type: 'half' });
  }
  
  // Add empty stars
  while (stars.length < 5) {
    stars.push({ id: stars.length + 1, type: 'empty' });
  }

  return (
    <View style={[styles.container, style]}>
      {stars.map((star) => {
        if (star.type === 'full') {
          return <Icon key={star.id} name="star" size={size} color="#FFC107" style={styles.star} />;
        } else if (star.type === 'half') {
          return <Icon key={star.id} name="star" size={size} color="#FFC107" style={styles.star} />;
        } else {
          return <Icon key={star.id} name="star" size={size} color="#E0E0E0" style={styles.star} />;
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
});

export default RatingStars;
