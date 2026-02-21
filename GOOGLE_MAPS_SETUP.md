# Google Maps Integration - Dashboard Location Tracking

## 📱 Features Implemented

### Dashboard Map with Real-Time Location Tracking
The dashboard now displays a **Google Map** with the following features:

✅ **Real-Time Location Updates**
- Automatically tracks user location as they move
- Updates map every 5 seconds or when user moves 10+ meters
- Shows current GPS coordinates with high accuracy

✅ **Visual Location Marker**
- Blue circle dot at user's current location
- Nested circles showing accuracy radius
- Interactive marker with location details

✅ **Live Tracking Toggle**
- GPS Fixed mode: Map follows user movement automatically
- GPS Off mode: Map stays centered, but still tracks position
- Visual indicator shows if tracking is active (green dot when active)

✅ **Map Controls**
- Center Location button: Tap to recenter map to current position
- Zoom in/out with MapView gestures
- Pan and rotate map freely

✅ **Location Information**
- Displays current latitude and longitude
- Shows GPS accuracy (±X meters)
- Shows altitude when available
- Live tracking status indicator

---

## 🔑 Setup: Add Google Maps API Key

### Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
4. Create an API key:
   - Click "Create Credentials" →  "API Key"
   - Choose "Restrict Key"
   - Add Android app SHA-1 fingerprint (see below)
   - Copy the API key

### Step 2: Get Android App Fingerprint

```bash
# For debug builds (development)
cd C:\Users\jcond\hris\hris-mobile\android\app
keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android

# Look for "SHA1:" in the output
```

### Step 3: Update app.json

Open [`../../../../../../c:/Users/jcond/hris/hris-mobile/app.json`](../../../../../../c:/Users/jcond/hris/hris-mobile/app.json):

```json
"android": {
  "googleMapsApiKey": "YOUR_ACTUAL_API_KEY_HERE"
}
```

For example:
```json
"android": {
  "googleMapsApiKey": "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### Step 4: Rebuild the App

```bash
npm run android
```

---

## 🗺️ Map Features in Detail

### Location Tracking Service

The `LocationService` in [`src/services/locationService.ts`](src/services/locationService.ts) provides:

```typescript
// Watch position with real-time updates
const watchId = await LocationService.watchPosition(
  (location) => {
    // Called whenever location changes
    console.log('New location:', location);
  },
  (error) => {
    // Handle errors
    console.error('Tracking error:', error);
  }
);

// Stop watching
LocationService.clearWatch(watchId);
```

### Location Data Structure

```typescript
interface LocationData {
  latitude: number;        // Current latitude
  longitude: number;       // Current longitude
  accuracy: number | null; // GPS accuracy in meters
  altitude: number | null; // Height above sea level
  altitudeAccuracy: number | null;
  heading: number | null;  // Direction of movement
  speed: number | null;    // Speed in m/s
  provider?: string;       // GPS or NETWORK
}
```

### Map Component Props

```typescript
interface LocationMapProps {
  height?: number; // Height in pixels (default: 300)
}

// Usage in DashboardScreen:
<LocationMap height={320} />
```

---

## 📍 How Location Tracking Works

1. **Permission Check**: App requests location permission on first load
2. **Initial Location**: Gets current position with high accuracy
3. **Start Watching**: Begins receiving location updates
4. **Real-Time Updates**: Map recenter follows user movement
5. **Visual Feedback**: Shows accuracy circle, tracks status, updates coordinates
6. **Cleanup**: Stops watching when component unmounts

---

## 🎨 Visual Elements

### Marker Design
- **Outer Circle**: Accuracy radius (blue color, semi-transparent)
- **Middle Circle**: GPS accuracy zone
- **Inner Dot**: Exact user position (solid blue)

### Status Indicators
- **Green Dot (●)**: Live tracking enabled
- **Grey Dot (○)**: Manual location mode

### Map Colors
- Blue: Current location and accuracy
- Light blue: Map background
- GPS indicator changes with tracking status

---

## ⚙️ Configuration

### Accuracy & Update Frequency

In [`src/services/locationService.ts`](src/services/locationService.ts) `watchPosition` method:

```typescript
accuracy: Location.Accuracy.Balanced,    // Can be: Lowest, Low, Balanced, High, Highest
timeInterval: 5000,           // Update every 5 seconds
distanceInterval: 10,         // OR when moved 10+ meters (whichever comes first)
```

### Dashboard Height

In [`src/screens/DashboardScreen.tsx`](src/screens/DashboardScreen.tsx):

```tsx
<LocationMap height={320} />  // Adjust height as needed
```

---

## 🔧 Troubleshooting

### Map not showing (blank white screen)
1. ❌ **API Key not set**: Update `app.json` with your Google Maps API key
2. ❌ **API not enabled**: Enable "Maps SDK for Android" in Google Cloud
3. ❌ **Wrong fingerprint**: Ensure Android app SHA1 fingerprint matches in Google Cloud
4. ✅ **Solution**: Rebuild app after adding API key

### Location not updating
1. ❌ **Permission denied**: Grant location permission in app settings
2. ❌ **GPS disabled**: Turn on device location services
3. ❌ **Poor signal**: Maps may not update if GPS signal is weak
4. ✅ **Solution**: Check device Settings > Apps > Permissions > Location

### High battery drain
1. **Tracking enabled**: Disable GPS Fixed mode when not needed
2. **Frequent updates**: App updates every 5 seconds (can be increased if needed)
3. **Solution**: Toggle tracking off when not actively tracking location

---

## 📊 Testing Location Tracking

### Test with Android Emulator

1. Open Android Studio AVD Manager
2. Select emulator, click "..." > Extended controls
3. In Location tab:
   - Set custom coordinates
   - Click "Send"
4. Watch map update in real-time

### Test with Real Device

1. Enable Developer Options: Settings > About > Tap "Build Number" 7x
2. Enable USB Debugging: Developer Options > USB Debugging
3. Connect device via USB
4. Run: `npm run android`
5. Walk around and watch map follow your location

---

## 🚀 Next Steps

### After Setup:
1. ✅ Add Google Maps API key to `app.json`
2. ✅ Rebuild app: `npm run android`
3. ✅ Test on device or emulator
4. ✅ Toggle tracking on/off in dashboard
5. ✅ Walk around to see map update

### Optional Enhancements:
- [ ] Add geofencing (set office boundaries)
- [ ] Add route history/breadcrumb trail
- [ ] Add location heatmap
- [ ] Add multiple location markers
- [ ] Add reverse geocoding (address lookup)
- [ ] Save location history with timestamps

---

## 📚 Documentation Files

- [`src/components/LocationMap.tsx`](src/components/LocationMap.tsx) - Map component
- [`src/services/locationService.ts`](src/services/locationService.ts) - Location service
- [`src/screens/DashboardScreen.tsx`](src/screens/DashboardScreen.tsx) - Dashboard integration
- [`app.json`](app.json) - App configuration

---

## 🔗 Useful Resources

- [React Native Maps Docs](https://github.com/react-native-maps/react-native-maps)
- [expo-location Documentation](https://docs.expo.dev/versions/latest/sdk/location/)
- [Google Maps API Console](https://console.cloud.google.com/)
- [Android App Signing](https://developer.android.com/studio/publish/app-signing)

---

## ☑️ Checklist

- [ ] Google Maps API key obtained
- [ ] API key added to `app.json`
- [ ] Android app SHA1 fingerprint registered in Google Cloud
- [ ] `npm install react-native-maps` completed
- [ ] `LocationService` has `watchPosition` and `clearWatch` methods
- [ ] `LocationMap` component uses MapView
- [ ] App rebuilt: `npm run android`
- [ ] Location permission granted in app
- [ ] Device location services enabled
- [ ] Map appears in dashboard
- [ ] Blue dot shows current location
- [ ] GPS tracking toggle works
- [ ] Coordinates update as you move

---

**Status**: ✅ Implemented and Ready for API Key Setup  
**Created**: February 20, 2026  
**Components**: LocationMap, LocationService, DashboardScreen
