import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';

/**
 * Material Design 3 inspired card component with elevation
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {Object} props.style - Additional styles for the card
 * @param {Function} props.onPress - Callback for press action
 * @param {number} props.elevation - Card elevation level (1-5)
 * @param {boolean} props.outlined - Use outlined style instead of elevated
 * @param {boolean} props.filled - Use filled style (with background color)
 * @returns {React.ReactNode}
 */
const MaterialCard = ({ 
  children, 
  style, 
  onPress, 
  elevation = 1, 
  outlined = false,
  filled = false,
  ripple = true
}) => {
  const theme = useTheme();
  
  // Get shadow based on elevation
  const getShadow = () => {
    if (outlined) return {};
    
    switch(elevation) {
      case 0: return {};
      case 1: return theme.shadows.small;
      case 2: return theme.shadows.medium;
      case 3: 
      case 4: return theme.shadows.large;
      case 5: return theme.shadows.extraLarge;
      default: return theme.shadows.medium;
    }
  };
  
  // Get border style if outlined
  const getBorder = () => {
    return outlined ? { 
      borderWidth: 1, 
      borderColor: 'rgba(0, 0, 0, 0.12)' 
    } : {};
  };
  
  // Get background color based on type
  const getBackground = () => {
    if (outlined) return { backgroundColor: theme.colors.surface };
    if (filled) return { backgroundColor: `${theme.colors.primary}15` }; // 15% opacity
    return { backgroundColor: theme.colors.surface };
  };
  
  // Combine styles
  const cardStyle = {
    ...styles.card,
    ...getShadow(),
    ...getBorder(),
    ...getBackground(),
    borderRadius: theme.borderRadius.m,
  };
  
  // Interaction states
  const [pressed, setPressed] = React.useState(false);
  
  // Handle press states for ripple-like effect
  const handlePressIn = () => setPressed(true);
  const handlePressOut = () => setPressed(false);
  
  // Get press state style
  const getStateStyle = () => {
    if (!onPress) return {};
    return {
      opacity: pressed ? theme.states.pressed : 1,
      transform: [{ scale: pressed ? 0.98 : 1 }],
    };
  };
  
  // If card is pressable
  if (onPress) {
    return (
      <View style={[cardStyle, style]}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.surfaceInner, getStateStyle()]}
          android_ripple={ripple ? { color: `${theme.colors.primary}30`, borderless: false } : null}
        >
          <View style={styles.contentContainer}>
            {children}
          </View>
        </Pressable>
      </View>
    );
  }
  
  // If card is not pressable
  return (
    <View style={[cardStyle, style]}>
      <Surface style={styles.surfaceInner}>
        <View style={styles.contentContainer}>
          {children}
        </View>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    borderRadius: 12,
  },
  surfaceInner: {
    borderRadius: 12,
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 16,
  },
});

export default MaterialCard;