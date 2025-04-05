import React, { useState } from 'react';
import { Pressable, Animated, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

/**
 * A Material Design inspired ripple effect component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to wrap with ripple effect
 * @param {Function} props.onPress - Press callback
 * @param {string} props.color - Ripple color (defaults to theme primary with opacity)
 * @param {Object} props.style - Additional styles for container
 * @param {boolean} props.disabled - Whether the ripple is disabled
 * @param {number} props.rippleOpacity - Opacity of the ripple effect (0-1)
 * @param {boolean} props.borderless - Whether the ripple extends beyond bounds
 */
const RippleEffect = ({
  children,
  onPress,
  color,
  style,
  disabled = false,
  rippleOpacity = 0.2,
  borderless = false,
}) => {
  const theme = useTheme();
  const [rippleScale] = useState(new Animated.Value(0));
  const [rippleOpacityAnim] = useState(new Animated.Value(0));
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });

  // Default ripple color from theme
  const rippleColor = color || `${theme.colors.primary}`;

  // Handle touch start to create ripple at touch position
  const handlePressIn = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    setRipplePosition({ x: locationX, y: locationY });
    
    // Reset and start animations
    rippleScale.setValue(0);
    rippleOpacityAnim.setValue(rippleOpacity);
    
    Animated.parallel([
      Animated.timing(rippleScale, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacityAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      disabled={disabled}
      style={[styles.container, style]}
      android_ripple={{ color: rippleColor, borderless }}
    >
      <View style={styles.content}>
        {children}
      </View>
      
      {/* Ripple effect (mainly for iOS) */}
      <Animated.View
        style={[
          styles.ripple,
          {
            backgroundColor: rippleColor,
            opacity: rippleOpacityAnim,
            transform: [
              { scale: rippleScale },
              { translateX: ripplePosition.x - 100 }, // Center ripple horizontally
              { translateY: ripplePosition.y - 100 }, // Center ripple vertically
            ],
          },
          borderless && styles.borderless,
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    zIndex: 1,
  },
  ripple: {
    position: 'absolute',
    width: 200, // Fixed ripple size
    height: 200, // Fixed ripple size
    borderRadius: 100, // Make it circular
    zIndex: 0,
  },
  borderless: {
    overflow: 'visible',
  },
});

export default RippleEffect;