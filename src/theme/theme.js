import { DefaultTheme } from 'react-native-paper';

// Google Material Design inspired theme for BarberX app
const theme = {
  ...DefaultTheme,
  // More rounded corners, following Google Material Design 3
  roundness: 12,
  colors: {
    ...DefaultTheme.colors,
    // Google-inspired color palette
    primary: '#4285F4', // Google Blue
    accent: '#EA4335',  // Google Red
    secondary: '#34A853', // Google Green
    tertiary: '#FBBC05', // Google Yellow
    background: '#F8F9FA', // Light gray background (Google's background color)
    surface: '#FFFFFF',
    text: '#202124', // Google's primary text color
    error: '#EA4335', // Google Red for errors
    onSurface: '#202124',
    disabled: '#80868B', // Google's disabled color
    placeholder: '#5F6368', // Google's secondary text color
    backdrop: 'rgba(0, 0, 0, 0.4)',
    notification: '#EA4335',
    success: '#34A853', // Google Green for success
    warning: '#FBBC05', // Google Yellow for warnings
  },
  fonts: {
    ...DefaultTheme.fonts,
    // Google uses Roboto, but we'll use System as fallback
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
  animation: {
    // Slightly faster animations for more responsive feel
    scale: 1.1,
  },
  // Material Design spacing system
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  // Material Design 3 uses more rounded corners
  borderRadius: {
    s: 8,
    m: 12,
    l: 16,
    xl: 28,
    pill: 50, // For pill-shaped buttons
  },
  // Material Design elevation system
  shadows: {
    // Google Material Design uses 5 elevation levels
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
    // Added for floating action buttons and elevated cards
    extraLarge: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
  },
  // Material Design states
  states: {
    pressed: 0.9, // Scale/opacity for pressed elements
    hovered: 0.08, // Overlay opacity for hover state
    focused: 0.12, // Overlay opacity for focus state
  },
};

export default theme;
