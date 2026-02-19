# Employee Management App - Complete Setup & Development Guide

## Project Overview

This is a comprehensive React Native application built with Expo for managing employee operations. The app features:
- Facial recognition authentication
- Real-time GPS location tracking
- Side navigation drawer with 8 menu items
- JWT-based authentication with token refresh
- Modern UI with TypeScript support

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- A mobile device or emulator (Android/iOS)

### Installation Steps

1. **Navigate to project directory**:
```bash
cd C:\Users\JaimeCondes\megaxapp\EmployeeApp
```

2. **Install dependencies** (already done, but if needed):
```bash
npm install
```

3. **Configure environment variables**:
Create/update `.env` file:
```env
EXPO_PUBLIC_API_URL=http://your-backend-api.com/api
EXPO_PUBLIC_APP_NAME=Employee Management App
EXPO_PUBLIC_VERSION=1.0.0
```

4. **Start the development server**:
```bash
npm start
```

5. **Run on device/emulator**:
   - Android: `npm run android`
   - iOS: `npm run ios`
   - Web: `npm run web`

## Project Structure

```
EmployeeApp/
├── src/
│   ├── screens/                      # Application screens
│   │   ├── LoginScreen.tsx           # Email/password login
│   │   ├── FaceLoginScreen.tsx       # Facial recognition login
│   │   ├── DashboardScreen.tsx       # Main dashboard
│   │   ├── AttendanceScreen.tsx      # Attendance tracking
│   │   ├── DTRScreen.tsx             # Daily time records
│   │   ├── PayslipScreen.tsx         # Salary information
│   │   ├── OvertimeRequestScreen.tsx # Overtime requests
│   │   ├── LeaveRequestScreen.tsx    # Leave requests
│   │   ├── TimeAdjustmentRequestScreen.tsx  # Time adjustments
│   │   ├── ProfileScreen.tsx         # User profile
│   │   └── SplashScreen.tsx          # Loading screen
│   │
│   ├── services/                     # API & business logic
│   │   ├── api.ts                    # Axios HTTP client
│   │   ├── authService.ts            # Authentication logic
│   │   └── locationService.ts        # GPS tracking
│   │
│   ├── context/                      # Global state management
│   │   └── AuthContext.tsx           # Authentication provider
│   │
│   ├── navigation/                   # Navigation setup
│   │   └── RootNavigator.tsx         # Main navigation config
│   │
│   ├── components/                   # Reusable components
│   │   └── DrawerContent.tsx         # Custom drawer menu
│   │
│   ├── hooks/                        # Custom React hooks
│   │   └── useLocationOnAppStart.ts  # Location hook
│   │
│   └── utils/                        # Utility functions
│       ├── config.ts                 # App configuration
│       ├── types.ts                  # TypeScript types
│       └── helpers.ts                # Helper functions
│
├── app/                              # Expo Router files (legacy)
├── assets/                           # Images and icons
├── .env                              # Environment variables
├── .babelrc                          # Babel configuration
├── App.tsx                           # Main entry point
├── app.json                          # Expo configuration
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── SETUP_GUIDE.md                    # Initial setup guide
├── API_DOCUMENTATION.md              # API endpoint specs
└── README.md                         # Project documentation
```

## Key Features

### 1. Authentication System
- **Email/Password Login**: Traditional authentication
- **Facial Recognition**: Advanced face detection using expo-face-detector
- **JWT Tokens**: Secure token-based authentication
- **Auto Token Refresh**: Automatic token renewal on expiration
- **Secure Storage**: AsyncStorage for sensitive data

### 2. Location Tracking
- **Real-time GPS**: Captures exact coordinates
- **Auto-save**: Automatically saves location on app start
- **High Accuracy**: Uses finest available location accuracy
- **Timestamp**: Records exact time of location capture

### 3. Navigation
- **Drawer Navigation**: Side menu with all features
- **Stack Navigation**: Proper navigation hierarchy
- **Auth Flow**: Automatic redirect based on authentication state
- **Custom Drawer**: Styled drawer with user info

### 4. Menu Items
1. **Dashboard** - Overview and quick stats
2. **Attendance** - Track attendance records
3. **DTR** - Daily time records
4. **Payslip** - Salary information
5. **Overtime Request** - Submit overtime requests
6. **Leave Request** - Request leave days
7. **Time Adjustment** - Adjust time records
8. **Profile** - User profile management

## API Integration

All API endpoints are documented in `API_DOCUMENTATION.md`.

### Key Endpoints:
- `POST /auth/login` - Login
- `POST /auth/face-authenticate` - Facial recognition
- `POST /location/save` - Save location

### Authentication Header:
```
Authorization: Bearer <JWT_TOKEN>
```

## Development

### Adding New Screens

1. **Create screen file** in `src/screens/`:
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const NewScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>New Screen Content</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
```

2. **Add to navigation** in `src/navigation/RootNavigator.tsx`:
```typescript
<Drawer.Screen
  name="NewFeature"
  component={NewScreen}
  options={{ title: 'New Feature' }}
/>
```

### Adding API Calls

1. **Create service** in `src/services/` or use existing `api.ts`:
```typescript
export const MyService = {
  async getData() {
    try {
      const response = await apiClient.get('/endpoint');
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  },
};
```

2. **Use in component**:
```typescript
import { MyService } from '../services/myService';

useEffect(() => {
  const fetchData = async () => {
    const data = await MyService.getData();
  };
  fetchData();
}, []);
```

### Authentication Flow

1. **App starts** → `AuthContext` checks for token
2. **No token** → Show login screens
3. **Token exists** → Load user and navigate to drawer
4. **Location saved** on app start with user ID
5. **Token expires** → Auto-refresh with refresh token
6. **Logout** → Clear all data and return to login

## Important Files to Modify

### `.env` - Environment Configuration
```env
EXPO_PUBLIC_API_URL=your-api-url
```

### `app.json` - Expo Configuration
```json
{
  "expo": {
    "name": "EmployeeApp",
    "slug": "employee-app",
    "version": "1.0.0"
  }
}
```

### `src/context/AuthContext.tsx` - Authentication Logic
Central place for managing authentication state and actions.

### `src/services/api.ts` - HTTP Client
Configured with request/response interceptors for automatic token handling.

## Permissions Required

The app requires these permissions:
- **Camera** - For facial recognition
- **Location** - For GPS tracking
- **Photos** - For avatar/image selection (optional)

Users will be prompted to grant permissions on first use.

## Troubleshooting

### Camera Permission Denied
```
Solution: Go to device settings > EmployeeApp > Permissions > Camera > Allow
```

### Location Not Captured
```
Solution: 
1. Ensure location permissions are granted
2. Check GPS is enabled on device
3. Verify backend API is running
```

### API Connection Error
```
Solution:
1. Check .env has correct API URL
2. Verify backend server is running
3. Check network connectivity
4. Review browser console for details
```

### Token Expiration Issues
```
Solution: Token refresh is automatic. If still failing:
1. Clear app cache
2. Re-login with credentials
3. Check backend token expiration settings
```

## Testing

### Manual Testing Checklist

- [ ] App launches and shows splash screen
- [ ] Login screen displays
- [ ] Email/password login works
- [ ] Face recognition login works
- [ ] Location is captured on login
- [ ] All menu items are accessible
- [ ] Navigation between screens works
- [ ] User can logout
- [ ] User data persists across app restarts
- [ ] API calls are successful

### Testing Face Recognition

1. Ensure good lighting
2. Face should be clearly visible
3. Position face within the detection box
4. Keep face steady for 2-3 seconds

## Performance Optimization

- Lazy load screens with navigation
- Memoize expensive components with `React.memo`
- Use `useMemo` and `useCallback` hooks
- Compress images before upload
- Implement pagination for lists

## Security Best Practices

✓ JWT tokens stored securely in AsyncStorage
✓ Refresh tokens for extended sessions
✓ API request interceptors add auth headers
✓ Response interceptors handle auth errors
✓ Face data encrypted before transmission
✓ Location data timestamped for tracking
✓ HTTPS required for all API calls

## Deployment

### Build for Production

**iOS:**
```bash
eas build --platform ios --auto-submit
```

**Android:**
```bash
eas build --platform android --auto-submit
```

**Requires EAS CLI:**
```bash
npm install -g eas-cli
eas login
```

## Support & Documentation

- **API Docs**: See `API_DOCUMENTATION.md`
- **Setup Guide**: See `SETUP_GUIDE.md`
- **React Navigation**: https://reactnavigation.org
- **Expo**: https://docs.expo.dev
- **TypeScript**: https://www.typescriptlang.org/docs

## Contributing

When adding features:
1. Create a new branch for each feature
2. Follow TypeScript and React best practices
3. Add proper error handling
4. Test on both Android and iOS
5. Update documentation

## Future Enhancements

- Push notifications
- Offline mode with data sync
- Advanced analytics dashboard
- Real-time notifications
- Video call integration
- Document management
- Advanced reporting
- Mobile wallet integration

## License

Proprietary - All rights reserved

---

**Last Updated**: January 30, 2026
**Version**: 1.0.0
**Status**: Development Ready
