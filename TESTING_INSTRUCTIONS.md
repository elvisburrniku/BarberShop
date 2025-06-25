# RestaurantX App Testing Guide

## Current Status
✓ Metro bundler running on port 5000  
✓ Web bundle compiled successfully (67 modules)  
✓ QR code available for mobile testing  

## Testing Methods

### 1. Mobile Testing (Recommended - Most Reliable)
**Step 1:** Download "Expo Go" app
- iOS: App Store → Search "Expo Go"
- Android: Google Play → Search "Expo Go"

**Step 2:** Scan QR Code
- Open Expo Go app
- Tap "Scan QR Code"
- Point camera at QR code in terminal
- App will load directly on your phone

**Step 3:** Alternative - Manual URL
If QR scan doesn't work, manually enter:
```
exp://172.31.128.33:5000
```

### 2. Web Testing Options

**Option A: Replit Webview**
- Check the webview panel in Replit interface
- If blank, try refreshing (Ctrl+R)

**Option B: Browser Console Check**
- Press F12 to open developer tools
- Check Console tab for any errors
- Look for React/JavaScript errors

**Option C: Direct URL**
- Open new browser tab
- Navigate to: `http://localhost:5000`

### 3. Development Controls
In the terminal where Metro is running, press:
- `r` → Reload app
- `w` → Open in web browser  
- `j` → Open JavaScript debugger
- `m` → Toggle developer menu

### 4. What to Test
Once app loads, test these features:

**Navigation:**
- Home tab → Featured restaurants
- Discover tab → Search restaurants  
- Reservations tab → Booking management
- Profile tab → User settings

**Restaurant Discovery:**
- Search by restaurant name
- Filter by cuisine type (Italian, Japanese, etc.)
- Sort by distance, rating, price
- View restaurant details

**Reservation Flow:**
- Select restaurant → "Reserve Now"
- Choose date and time
- Select party size
- Add special requests
- Confirm booking

## Troubleshooting

**White Screen Issues:**
1. Wait 30-60 seconds for full load
2. Check browser console for errors
3. Try mobile Expo Go instead
4. Clear browser cache

**Mobile Testing Issues:**
- Ensure phone and computer on same network
- Try manual URL entry in Expo Go
- Check firewall isn't blocking port 5000

**Common Solutions:**
- Refresh browser page
- Restart Metro bundler (Ctrl+C, then restart)
- Try different browser
- Use mobile testing as backup

## App Features Overview
- Restaurant search and filtering
- Menu browsing with images and prices
- Table reservation system
- User profile management
- Location-based restaurant discovery