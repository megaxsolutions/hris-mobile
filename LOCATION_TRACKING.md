# Location Tracking Implementation Guide

## Overview

The app now has comprehensive, accurate location tracking capabilities with multiple methods for capturing device location data.

## Features

### 1. **High-Accuracy GPS Capture**
- Uses `Location.Accuracy.Highest` for maximum precision
- Captures: latitude, longitude, altitude, heading, speed, accuracy
- 10-second timeout to prevent hanging
- No cached location data (always fresh)

### 2. **Reverse Geocoding**
- Converts GPS coordinates to readable address
- Gets: street, city, region, country, postal code
- Gracefully fallback if geocoding fails

### 3. **Automatic Retry Logic**
- Retries up to 3 times if accuracy is poor
- Waits for better accuracy (targets ≤50 meters)
- 2-second delay between retries
- Logs attempt progress

### 4. **Continuous Location Tracking**
- Watch location changes in real-time
- Updates on 1-minute intervals (configurable)
- Also updates if device moves 10+ meters
- Automatic database sync on each update

### 5. **Background Permissions**
- Requests foreground location access on first use
- Supports background location tracking (for future implementation)
- Handles permission denials gracefully

### 6. **Local Caching**
- Stores last known location in AsyncStorage
- Fallback if real-time location fails
- Useful for offline support

---

## LocationService API

### `requestForegroundPermissions()`
Request device location permissions for foreground use.

```typescript
const hasPermission = await LocationService.requestForegroundPermissions();
```

### `getCurrentLocation()`
Get the most accurate single location snapshot.

```typescript
const location = await LocationService.getCurrentLocation();
// Returns: { latitude, longitude, accuracy, altitude, heading, speed, timestamp, provider }
```

### `getCurrentLocationWithAddress()`
Get location with reverse-geocoded address information.

```typescript
const locationWithAddress = await LocationService.getCurrentLocationWithAddress();
// Returns: { ...LocationData, address: { street, city, region, country, postalCode } }
```

### `getLocationWithRetry(userId, maxRetries, retryDelayMs)`
Get location with automatic retries for better accuracy.

**Parameters:**
- `userId`: User ID for database saving
- `maxRetries`: Number of retry attempts (default: 3)
- `retryDelayMs`: Delay between retries in milliseconds (default: 2000)

```typescript
const accurateLocation = await LocationService.getLocationWithRetry(user.id, 3, 2000);
```

**Behavior:**
- Stops early if accuracy ≤ 50 meters
- Retries if accuracy is worse than 50 meters
- Saves to database after successful capture
- Returns null if max retries exceeded

### `startLocationTracking(userId, onLocationUpdate, intervalMs)`
Start continuous location monitoring.

**Parameters:**
- `userId`: User ID for database saving
- `onLocationUpdate`: Optional callback function for location updates
- `intervalMs`: Update interval in milliseconds (default: 60000 = 1 minute)

```typescript
const success = await LocationService.startLocationTracking(
  user.id,
  (location) => {
    console.log('Location updated:', location);
  },
  60000 // Update every minute
);
```

**Features:**
- Updates every 60 seconds OR when device moves 10+ meters
- Automatically saves to database
- Calls callback function on each update
- Returns true if tracking started successfully

### `stopLocationTracking()`
Stop continuous location monitoring.

```typescript
LocationService.stopLocationTracking();
```

### `saveLocationToDatabase(userId, locationData)`
Manually save location to backend.

```typescript
await LocationService.saveLocationToDatabase(user.id, locationData);
```

**API Endpoint:** `POST /location/save`

### `getLocationOnAppStart(userId)`
One-time location capture with address on app initialization.

```typescript
await LocationService.getLocationOnAppStart(user.id);
```

### `cacheLocation(locationData)` / `getCachedLocation()`
Local AsyncStorage caching for offline support.

```typescript
// Cache location
await LocationService.cacheLocation(location);

// Retrieve cached location
const cached = await LocationService.getCachedLocation();
```

---

## LocationData Interface

```typescript
export interface LocationData {
  latitude: number;           // Device latitude
  longitude: number;          // Device longitude
  accuracy: number | null;    // Accuracy in meters (lower is better)
  altitude: number | null;    // Altitude in meters above sea level
  altitudeAccuracy: number | null;  // Altitude accuracy in meters
  heading: number | null;     // Direction heading 0-360 degrees
  speed: number | null;       // Speed in meters per second
  timestamp: string;          // ISO 8601 timestamp
  provider?: string;          // 'GPS' or 'NETWORK'
}
```

---

## useLocationTracking Hook

Custom hook for easy location tracking in React components.

```typescript
const {
  location,           // Current LocationData
  isTracking,         // Boolean: tracking active?
  error,              // Error message if any
  startTracking,      // Function: start tracking
  stopTracking,       // Function: stop tracking
  getLocationNow,     // Function: get current location once
} = useLocationTracking(
  enabled = false,    // Auto-start tracking?
  intervalMs = 60000  // Update interval
);
```

### Example Usage

```tsx
import { useLocationTracking } from '../hooks/useLocationTracking';

export const MyScreen = () => {
  const { location, isTracking, startTracking, getLocationNow } = useLocationTracking();

  return (
    <View>
      {location && (
        <Text>
          Lat: {location.latitude}, Lon: {location.longitude}
          Accuracy: {location.accuracy}m
        </Text>
      )}

      <Button
        title={isTracking ? 'Stop Tracking' : 'Start Tracking'}
        onPress={isTracking ? () => {} : startTracking}
      />

      <Button title="Get Location Now" onPress={getLocationNow} />
    </View>
  );
};
```

---

## Integration in AuthContext

Location is automatically captured on:

1. **App Launch**: `bootstrapAsync()` uses `getLocationWithRetry()`
2. **Email Login**: `signIn()` uses `getLocationWithRetry()`
3. **Face Login**: `signInWithFace()` uses `getLocationWithRetry()`

All use 3 retries with 2-second delays for maximum accuracy.

---

## AttendanceScreen Example

The AttendanceScreen now demonstrates location tracking:

### Features:
- ✅ Display current location coordinates
- ✅ Show accuracy, altitude, speed, heading
- ✅ Manual "Get Current Location" button
- ✅ Toggle continuous tracking on/off
- ✅ Real-time location updates

### Usage:
```tsx
// Manual location capture
<Button title="Get Current Location" onPress={handleGetLocation} />

// Toggle continuous tracking
<Button title={isTracking ? 'Stop Tracking' : 'Start Tracking'} onPress={toggleTracking} />
```

---

## Backend API Expectations

### Save Location Endpoint

**POST** `/location/save`

**Request Body:**
```json
{
  "userId": "user123",
  "latitude": 14.5995,
  "longitude": 120.9842,
  "accuracy": 12.5,
  "altitude": 25.0,
  "altitudeAccuracy": 5.0,
  "heading": 45.5,
  "speed": 0.5,
  "timestamp": "2025-01-30T12:34:56.789Z",
  "provider": "GPS",
  "address": {
    "street": "123 Main St",
    "city": "Manila",
    "region": "NCR",
    "country": "Philippines",
    "postalCode": "1000"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "location123",
    "userId": "user123",
    "latitude": 14.5995,
    "longitude": 120.9842,
    "accuracy": 12.5,
    "savedAt": "2025-01-30T12:34:56.789Z"
  }
}
```

---

## Accuracy Interpretation

| Accuracy Range | Quality | Notes |
|---|---|---|
| 0-5m | Excellent | High precision GPS |
| 5-10m | Good | Strong GPS signal |
| 10-30m | Fair | Regular GPS |
| 30-100m | Poor | Weak signal, may need retry |
| >100m | Very Poor | Network-based location |
| null | Unknown | Location unavailable |

**The app targets accuracy ≤50m for automatic retries.**

---

## Android Emulator Considerations

### Getting Location in Emulator

1. **Via Android Studio**: 
   - Tools → Device Manager → Click three dots → Virtual Device Config
   - Select device → Edit → Show Advanced Options
   - Location section → Set latitude/longitude

2. **Via Extended Controls**:
   - Emulator window → More (⋯) → Extended Controls
   - Location tab → Enter coordinates

3. **Via ADB**:
   ```bash
   adb emu geo fix 14.5995 120.9842
   ```

### Accuracy in Emulator
- Emulator reports fixed accuracy values
- Real device provides actual GPS accuracy
- Network-based location typically less accurate

---

## Permissions Required

### Android (`app.json`)
```json
{
  "plugins": [
    ["expo-location", {
      "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location"
    }]
  ]
}
```

### iOS
```json
{
  "plugins": [
    ["expo-location", {
      "locationAlwaysAndWhenInUsePermission": "Allow app to access location",
      "locationWhenInUsePermission": "Allow app to use location"
    }]
  ]
}
```

---

## Privacy & Best Practices

1. ✅ Always request permissions explicitly
2. ✅ Store locations securely on backend
3. ✅ Implement user consent flows
4. ✅ Log location access for compliance
5. ✅ Allow users to disable tracking
6. ✅ Use location only when necessary
7. ✅ Implement rate limiting (not too frequent updates)
8. ✅ Encrypt location data in transit (HTTPS)

---

## Troubleshooting

### "Location permission not granted"
- User denied permissions in OS settings
- Request permissions again: `requestForegroundPermissions()`
- Suggest user enable in: Settings → App → Permissions

### "No location data available"
- Device doesn't have GPS/network location
- Location services disabled
- Weak GPS signal (wait longer or go outside)
- Use `getLocationWithRetry()` for better results

### "Accuracy too high (>100m)"
- Weak GPS signal
- Indoor location (try outdoors)
- Retry with `getLocationWithRetry()`
- Consider using network-based location as fallback

### Emulator Returns Null
- Ensure emulator has location permission
- Set location via Extended Controls
- Restart emulator
- Use `adb emu geo fix` command

---

## Future Enhancements

- [ ] Geofencing (alert when entering/leaving areas)
- [ ] Background location tracking
- [ ] Location history tracking
- [ ] Battery-efficient tracking modes
- [ ] Location sharing with team members
- [ ] Offline location caching
- [ ] Location-based check-in/check-out
- [ ] Map visualization
- [ ] Route tracking
- [ ] Location-based notifications

---

## References

- [Expo Location Documentation](https://docs.expo.dev/versions/latest/sdk/location/)
- [React Native Geolocation](https://reactnative.dev/docs/geolocation)
- [Android Location Services](https://developer.android.com/training/location)
- [iOS Core Location](https://developer.apple.com/documentation/corelocation)

