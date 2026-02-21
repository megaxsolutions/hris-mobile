# Development Quick Reference

## 🚀 Common Tasks

### Add New Feature
```bash
# 1. Create component/screen
touch src/screens/NewScreen.tsx

# 2. Add to navigation
# Edit: src/navigation/RootNavigator.tsx
# Add import and <Stack.Screen /> component

# 3. Build
npm run android
```

### Update Backend Endpoints
```typescript
// In src/services/apiService.ts or similar
const apiClient = axios.create({
  baseURL: 'https://your-backend.com/api',
  // Automatically includes auth token via interceptor
});

// Use it in other services:
await apiClient.post('/endpoint', data);
```

### Add Environment Variable
```json
// In app.json under "extra" or "env":
"googleMapsApiKey": "YOUR_KEY",
"backendUrl": "https://api.example.com"

// Access in code:
import Constants from 'expo-constants';
const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
```

### Create New Service
```typescript
// src/services/newService.ts
import axios from 'axios';
import { apiClient } from './apiService';

export const newService = {
  method1: async (param) => {
    return await apiClient.get('/endpoint', { params: { param } });
  },
  method2: async (data) => {
    return await apiClient.post('/endpoint', data);
  }
};

// Use in component:
import { newService } from '../services/newService';
const result = await newService.method1(value);
```

### Navigate to Screen
```typescript
// Inside component with useNavigation hook:
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// Navigate with params:
navigation.navigate('ScreenName', { param1: 'value' });

// Go back:
navigation.goBack();

// Reset to home:
navigation.reset({
  index: 0,
  routes: [{ name: 'Home' }],
});
```

---

## 📁 File Structure Quick Guide

```
src/
├── screens/           # Full-page components
│   ├── LoginScreen.tsx
│   ├── DashboardScreen.tsx
│   └── SettingsScreen.tsx
├── components/        # Reusable UI components
│   ├── LocationMap.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Card.tsx
├── services/          # API & business logic
│   ├── authService.ts
│   ├── locationService.ts
│   └── apiService.ts
├── navigation/        # Navigation config
│   └── RootNavigator.tsx
├── utils/             # Helpers & utilities
│   ├── validators.ts
│   └── formatters.ts
├── hooks/             # Custom React hooks
│   └── useLocation.ts
└── constants/         # Constants & config
    └── theme.ts
```

---

## 🔑 Key Files for Common Changes

| Change Type | File(s) |
|-------------|---------|
| Add new screen | `src/screens/Name.tsx` + `src/navigation/RootNavigator.tsx` |
| Modify API calls | `src/services/` |
| Update styling | `src/css/` or component's StyleSheet |
| Add theme colors | `src/constants/theme.ts` |
| Change navigation | `src/navigation/RootNavigator.tsx` |
| Auth-related | `src/services/authService.ts` + `src/context/AuthContext.tsx` |
| Location features | `src/services/locationService.ts` + `src/components/LocationMap.tsx` |

---

## 🧪 Testing Commands

```bash
# Type check
npm run type-check

# Lint check
npm run lint

# Format code
npm run format

# Build for Android
npm run android

# Build for iOS
npm run ios

# Start expo server
npm start

# Run on specific emulator
npm run android -- --device <device-id>
```

---

## 📱 Debugging

### VS Code Debugging
```json
// .vscode/launch.json
{
  "type": "node",
  "request": "attach",
  "name": "Attach Debugger",
  "skipFiles": ["<node_internals>/**"]
}
```

### React Native Debugger
```bash
# Find logs
adb logcat | grep "ExpoScreens"

# Clear logs
adb logcat -c

# Shake device (Android emulator)
Ctrl+M (Windows/Linux)  or  Cmd+M (Mac)
```

### Console Errors
```typescript
// Add error boundary
import React from 'react';

export class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Caught error:', error, errorInfo);
  }
  
  render() {
    return <View><Text>Error occurred</Text></View>;
  }
}
```

---

## 🔐 Security Checklist

- [ ] API keys in `app.json` (not hardcoded)
- [ ] Sensitive data in AsyncStorage encrypted
- [ ] Never log passwords or tokens
- [ ] Use HTTPS only for API calls
- [ ] Validate user inputs server-side
- [ ] Implement token refresh on expiry
- [ ] Clear AsyncStorage on logout
- [ ] Use Android/iOS secure auth tokens

---

## 🎨 Styling Guide

### Colors
```typescript
// From theme.ts
const colors = {
  primary: '#007AFF',      // Apple blue
  success: '#34C759',      // Green
  warning: '#FF9500',      // Orange
  danger: '#FF3B30',       // Red
  background: '#F2F2F7',   // Light gray
  text: '#000000',         // Black
  textSecondary: '#666666' // Gray
};
```

### Create Styled Component
```typescript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF'
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#007AFF'
  },
  text: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500'
  }
});
```

---

## 📦 Version Notes

- **React Native (Expo)**: v54.0.32
- **React Navigation**: v6.x
- **TypeScript**: v5.x
- **Gradle**: 8.14.3 (Android)
- **Node**: 18+ recommended

---

## 🚨 Emergency Commands

```bash
# Clear all caches and reinstall
rm -rf node_modules
npm install
expo prebuild --clean

# Kill existing emulator processes
adb devices
adb kill-server
adb start-server

# Reset expo
expo--clear

# Hard reset all
npm run clean
npm install
npm run android
```

---

## 📞 Quick Problem Solving

| Problem | Solution |
|---------|----------|
| "Module not found" | `npm install`, clear cache: `npm cache clean --force` |
| App won't start | Check `expo doctor`, verify `eas.json` config |
| GPS not working | Enable device location services, grant app permission |
| API calls fail | Check backend URL in `app.json`, verify token validity |
| Styling breaks | Check device rotation settings, use `Dimensions` hook |
| Hot reload not working | Save file again, or run `npm start` |

---

## 🔗 Important Links

- **Google Maps Setup**: See `GOOGLE_MAPS_SETUP.md`
- **Android Build**: See `ANDROID_BUILD_SETUP.md`
- **API Docs**: See `API_DOCUMENTATION.md`
- **EAS Build**: See `EAS_BUILD_SETUP.md`
- **Expo Docs**: https://docs.expo.dev/
- **React Native**: https://reactnative.dev/
- **TypeScript**: https://www.typescriptlang.org/

---

**Last Updated**: February 20, 2026  
**For Questions**: Check related documentation files first
