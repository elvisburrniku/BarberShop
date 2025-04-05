import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Google Material Design 3 inspired button component
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Button text
 * @param {Function} props.onPress - Callback function for press event
 * @param {string} props.mode - Button style: 'filled', 'outlined', 'text', 'elevated', 'tonal'
 * @param {string} props.iconName - Material icon name (optional)
 * @param {boolean} props.iconRight - Position icon to the right (optional)
 * @param {string} props.color - Button color, defaults to theme primary
 * @param {boolean} props.compact - Use compact size
 * @param {boolean} props.disabled - Disable the button
 * @param {Object} props.style - Additional container styles
 * @param {Object} props.labelStyle - Additional label styles
 */
const MaterialButton = ({
  label,
  onPress,
  mode = 'filled',
  iconName,
  iconRight = false,
  color,
  compact = false,
  disabled = false,
  style,
  labelStyle,
}) => {
  const theme = useTheme();
  const [pressed, setPressed] = React.useState(false);
  
  // Get button background color based on mode and state
  const getBackgroundColor = () => {
    if (disabled) return theme.colors.disabled;
    
    if (mode === 'filled') return color || theme.colors.primary;
    if (mode === 'elevated') return theme.colors.surface;
    if (mode === 'tonal') return `${color || theme.colors.primary}20`; // 20% opacity
    
    return 'transparent';
  };
  
  // Get text color based on mode and state
  const getTextColor = () => {
    if (disabled) return '#FFFFFF';
    
    if (mode === 'filled') return '#FFFFFF';
    if (mode === 'elevated' || mode === 'outlined' || mode === 'text' || mode === 'tonal') {
      return color || theme.colors.primary;
    }
    
    return color || theme.colors.primary;
  };
  
  // Get border style for outlined mode
  const getBorderStyle = () => {
    if (mode === 'outlined') {
      return {
        borderWidth: 1,
        borderColor: disabled ? theme.colors.disabled : color || theme.colors.primary,
      };
    }
    
    return {};
  };
  
  // Get elevation/shadow for elevated mode
  const getElevation = () => {
    if (disabled) return {};
    
    if (mode === 'elevated') {
      return pressed ? theme.shadows.small : theme.shadows.medium;
    }
    
    return {};
  };
  
  // Get border radius - pill shape for Material Design 3
  const getBorderRadius = () => {
    return compact ? theme.borderRadius.m : theme.borderRadius.pill;
  };
  
  // Handle press states
  const handlePressIn = () => setPressed(true);
  const handlePressOut = () => setPressed(false);
  
  // Get animation state style
  const getStateStyle = () => {
    if (disabled) return {};
    
    return {
      transform: [{ scale: pressed ? 0.98 : 1 }],
      opacity: pressed ? 0.9 : 1,
    };
  };
  
  // Icon component if specified
  const IconComponent = iconName ? (
    <MaterialIcons
      name={iconName}
      size={18}
      color={getTextColor()}
      style={[styles.icon, iconRight ? styles.iconRight : styles.iconLeft]}
    />
  ) : null;
  
  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderRadius: getBorderRadius(),
          paddingVertical: compact ? 8 : 12,
          paddingHorizontal: compact ? 12 : 24,
          ...getBorderStyle(),
          ...getElevation(),
        },
        getStateStyle(),
        style,
      ]}
      android_ripple={{ 
        color: `${getTextColor()}20`,
        borderless: false,
      }}
    >
      <View style={styles.content}>
        {iconName && !iconRight && IconComponent}
        <Text
          style={[
            styles.label,
            {
              color: getTextColor(),
              marginLeft: iconName && !iconRight ? 8 : 0,
              marginRight: iconName && iconRight ? 8 : 0,
              fontSize: compact ? 14 : 16,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
        {iconName && iconRight && IconComponent}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  icon: {
    width: 18,
    height: 18,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default MaterialButton;