import React, { useState } from 'react';
import { StyleSheet, Pressable, Animated, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Google Material Design 3 Floating Action Button (FAB)
 * 
 * @param {Object} props - Component props
 * @param {string} props.iconName - Material icon name
 * @param {Function} props.onPress - Callback function for press event
 * @param {string} props.label - Optional label text for extended FAB
 * @param {string} props.color - Button color (defaults to primary)
 * @param {string} props.size - 'small', 'regular', or 'large'
 * @param {boolean} props.extended - Whether to show an extended FAB with label
 * @param {Object} props.style - Additional styles
 * @param {boolean} props.disabled - Disable the FAB
 */
const FloatingActionButton = ({
  iconName = 'add',
  onPress,
  label,
  color,
  size = 'regular',
  extended = false,
  style,
  disabled = false,
}) => {
  const theme = useTheme();
  const [scale] = useState(new Animated.Value(1));
  
  // Get FAB size based on prop
  const getFabSize = () => {
    switch (size) {
      case 'small': return 40;
      case 'large': return 96;
      default: return 56;
    }
  };
  
  // Get icon size based on FAB size
  const getIconSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'large': return 36;
      default: return 24;
    }
  };
  
  // Handle press animations
  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  // Default colors
  const fabColor = color || theme.colors.primary;
  const iconColor = '#FFFFFF';
  
  // Dynamic styles based on props
  const containerStyle = {
    backgroundColor: disabled ? theme.colors.disabled : fabColor,
    width: extended ? 'auto' : getFabSize(),
    height: getFabSize(),
    borderRadius: extended ? getFabSize() / 2 : getFabSize() / 2,
    paddingHorizontal: extended ? 16 : 0,
    ...theme.shadows.large,
  };
  
  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        { transform: [{ scale }] },
        style,
      ]}
    >
      <Pressable
        onPress={disabled ? null : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={styles.button}
        android_ripple={{ 
          color: 'rgba(255, 255, 255, 0.2)',
          borderless: true,
        }}
      >
        <View style={styles.content}>
          <MaterialIcons 
            name={iconName} 
            size={getIconSize()} 
            color={iconColor} 
          />
          
          {extended && label && (
            <Text 
              style={[
                styles.label, 
                { 
                  color: iconColor,
                  marginLeft: 8,
                  fontSize: size === 'small' ? 14 : 16,
                }
              ]}
            >
              {label}
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

export default FloatingActionButton;