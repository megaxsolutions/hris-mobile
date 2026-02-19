# Quick Reference Guide

## 🚀 Start Development in 3 Steps

```bash
# 1. Install dependencies
npm install

# 2. Update .env with your API URL
# EXPO_PUBLIC_API_URL=http://your-backend.com/api

# 3. Start development server
npm start

# Then press:
# a - for Android
# i - for iOS
# w - for web
```

---

## 📱 Common Code Snippets

### Use Authentication
```typescript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, signIn, signOut } = useAuth();
  
  return (
    <View>
      <Text>Welcome {user?.name}</Text>
      <TouchableOpacity onPress={signOut}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Make API Calls
```typescript
import { apiClient } from '../services/api';

const fetchData = async () => {
  try {
    const response = await apiClient.get('/endpoint');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
```

### Use Location
```typescript
import { LocationService } from '../services/locationService';

const getLocation = async (userId: string) => {
  const location = await LocationService.getLocationOnAppStart(userId);
  console.log(location); // { latitude, longitude, accuracy, timestamp }
};
```

### Navigate Between Screens
```typescript
import { useNavigation } from '@react-navigation/native';

const MyComponent = () => {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
      <Text>Go to Dashboard</Text>
    </TouchableOpacity>
  );
};
```

---

## 📂 File Locations

| File Type | Location |
|-----------|----------|
| Screens | `src/screens/` |
| Services | `src/services/` |
| Components | `src/components/` |
| Hooks | `src/hooks/` |
| Types | `src/utils/types.ts` |
| Config | `src/utils/config.ts` |
| Helpers | `src/utils/helpers.ts` |
| Navigation | `src/navigation/` |
| Context | `src/context/` |

---

## 🔌 API Endpoints Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/login` | User login |
| POST | `/auth/face-authenticate` | Face recognition |
| POST | `/location/save` | Save location |
| POST | `/auth/refresh-token` | Refresh JWT |
| GET | `/user/profile` | Get user info |

See `API_DOCUMENTATION.md` for full details.

---

## 🎨 Styling Quick Tips

### Colors
- Primary: `#007AFF` (Blue)
- Success: `#34C759` (Green)
- Danger: `#FF3B30` (Red)
- Background: `#f5f5f5` (Light Gray)
- Text: `#333` (Dark Gray)

### Common Styles
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
});
```

---

## 🔐 Authentication Flow

1. **App Starts** → Check if token exists
2. **No Token** → Show LoginScreen
3. **Login** → Call `/auth/login` or `/auth/face-authenticate`
4. **Save Token** → Store in AsyncStorage
5. **Get Location** → Capture and save GPS
6. **Navigate** → Go to Dashboard
7. **Logout** → Clear data and return to login

---

## 📍 Location Tracking Flow

1. **User Logs In** → `AuthContext` calls `getLocationOnAppStart`
2. **Request Permission** → User grants location access
3. **Get GPS** → Capture latitude & longitude
4. **Save to DB** → Send to backend API
5. **Store Timestamp** → Record when captured

---

## 🧪 Testing

### Test Login
```
Email: test@example.com
Password: password123
```

### Test Face Recognition
- Good lighting
- Face clearly visible
- Keep steady for 2-3 seconds

### Test Location
- Ensure location permission is granted
- GPS must be enabled on device
- Check backend API is running

---

## 🐛 Common Issues & Solutions

### Camera Not Working
```
✓ Check Settings > Apps > EmployeeApp > Permissions > Camera
✓ Ensure good lighting
✓ Restart app
```

### Location Not Saving
```
✓ Check location permissions granted
✓ Enable GPS on device
✓ Check backend API running
✓ Verify .env API URL is correct
```

### API Connection Error
```
✓ Check internet connection
✓ Verify API URL in .env
✓ Check backend server status
✓ Check CORS configuration
```

### Token Not Refreshing
```
✓ Ensure refresh token is stored
✓ Check backend token endpoint
✓ Verify token expiration time
```

---

## 📦 Key Dependencies

```json
{
  "@react-navigation/native": "Navigation",
  "@react-navigation/drawer": "Side menu",
  "expo-camera": "Camera access",
  "expo-face-detector": "Face detection",
  "expo-location": "GPS",
  "axios": "API calls",
  "@react-native-async-storage/async-storage": "Storage"
}
```

---

## 🔄 State Management (AuthContext)

**Available in any component:**
```typescript
const { user, isLoading, signIn, signOut } = useAuth();
```

**Properties:**
- `user` - Current user object
- `isLoading` - Loading state
- `signIn(email, password)` - Login function
- `signInWithFace(image)` - Face login
- `signOut()` - Logout function

---

## 📝 Adding a New Screen

1. **Create file** in `src/screens/NewScreen.tsx`:
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const NewScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>New Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});
```

2. **Import in** `src/navigation/RootNavigator.tsx`:
```typescript
import { NewScreen } from '../screens/NewScreen';

// Add to Drawer.Navigator
<Drawer.Screen
  name="NewFeature"
  component={NewScreen}
  options={{ title: 'New Feature' }}
/>
```

---

## 🌐 Environment Configuration

**.env file:**
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_APP_NAME=Employee Management App
EXPO_PUBLIC_VERSION=1.0.0
```

**Access in code:**
```typescript
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

---

## 📚 Documentation Files

- `README.md` - Overview and features
- `SETUP_GUIDE.md` - Installation steps
- `API_DOCUMENTATION.md` - Backend API specs
- `DEVELOPMENT_GUIDE.md` - Development practices
- `IMPLEMENTATION_CHECKLIST.md` - What's included
- `QUICK_REFERENCE.md` - This file

---

## 🎯 Development Checklist

- [ ] Backend API created and running
- [ ] .env updated with correct API URL
- [ ] Database created and configured
- [ ] Authentication endpoints tested
- [ ] Location endpoint tested
- [ ] Screens populated with content
- [ ] Form validations added
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Testing completed

---

## 💡 Pro Tips

1. **Use TypeScript** - All files should be `.tsx` or `.ts`
2. **Check Types** - Use types from `src/utils/types.ts`
3. **Error Handling** - Always use try-catch in services
4. **Logging** - Use `console` for debugging
5. **Performance** - Memoize expensive components
6. **Caching** - Use AsyncStorage for user preferences

---

## 🔗 Useful Links

- [React Navigation Docs](https://reactnavigation.org)
- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Axios Documentation](https://axios-http.com)

---

## 📞 Getting Help

1. Check documentation files
2. Review similar existing code
3. Check error messages carefully
4. Test with simpler code first
5. Consult team members

---

**Last Updated**: January 30, 2026
**Version**: 1.0.0
**Quick Ref**: For development speed
