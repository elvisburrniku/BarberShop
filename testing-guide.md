# RestaurantX App Testing Guide

## Testing Methods Available in Replit

### 1. Web Browser Testing (Current)
- **URL**: The app is accessible at the Replit webview on port 5000
- **Status**: Metro bundler is running and serving the app
- **How to test**: The app should display directly in your Replit webview panel

### 2. Mobile Testing with Expo Go
- **Download Expo Go**: Install from App Store (iOS) or Google Play (Android)
- **Scan QR Code**: Use the QR code shown in the console logs
- **Direct URL**: `exp://172.31.128.33:5000`

### 3. Development Tools
- **Browser DevTools**: Right-click → Inspect Element to check console
- **Expo Debugger**: Press `j` in the terminal to open debugger
- **Reload**: Press `r` in terminal to reload the app

### 4. Testing Different Screens
Once the app loads, you can test:
- **Home Screen**: Featured restaurants and quick actions
- **Discovery**: Search and filter restaurants by cuisine/price
- **Restaurant Detail**: View menu, photos, make reservations
- **Reservations**: Manage your bookings

## Current Status
- Metro bundler: ✓ Running on port 5000
- Web bundle: ✓ Compiled successfully (797 modules)
- QR Code: ✓ Available for mobile testing

## Troubleshooting
If you see a white screen:
1. Check browser console for errors
2. Try refreshing the page
3. Clear browser cache
4. Test on mobile using Expo Go

## Features to Test
- Restaurant search and filtering
- Menu browsing
- Reservation booking flow
- Navigation between screens
- Location services (if enabled)