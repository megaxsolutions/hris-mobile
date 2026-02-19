# Employee Management App

A comprehensive React Native application for employee management with facial recognition authentication, GPS location tracking, and an extensive menu-driven interface.

## 🚀 Features

### Authentication & Security
- ✅ Facial Recognition Login (using expo-face-detector)
- ✅ Email/Password Authentication
- ✅ JWT Token-based Security
- ✅ Automatic Token Refresh
- ✅ Secure Token Storage

### Location Tracking
- ✅ Real-time GPS Coordinates (Latitude & Longitude)
- ✅ Automatic Location Capture on App Start
- ✅ High-Accuracy Location Detection
- ✅ Database Integration

### User Interface
- ✅ Side Navigation Drawer Menu
- ✅ 8 Menu Options
- ✅ Clean and Modern Design
- ✅ TypeScript Support

### Menu Features
1. **Dashboard** - Employee overview
2. **Attendance** - Track attendance
3. **DTR** - Daily Time Records
4. **Payslip** - Salary information
5. **Overtime Request** - Submit overtime
6. **Leave Request** - Request leave days
7. **Time Adjustment** - Adjust time records
8. **Profile** - User profile management

## 📋 Requirements

- Node.js v16 or higher
- npm or yarn
- Expo CLI
- Mobile device or emulator

## 🎯 Quick Start

### 1. Installation
```bash
cd EmployeeApp
npm install
```

### 2. Environment Setup
Update `.env` file:
```env
EXPO_PUBLIC_API_URL=http://your-backend-api.com/api
EXPO_PUBLIC_APP_NAME=Employee Management App
EXPO_PUBLIC_VERSION=1.0.0
```

### 3. Start Development Server
```bash
npm start
```

### 4. Run on Device
```bash
# Android
npm run android

# iOS (macOS only)
npm run ios

# Web
npm run web
```

## 📁 Project Structure

```
EmployeeApp/
├── src/
│   ├── screens/              # All application screens
│   ├── services/             # API & business logic
│   ├── context/              # Global state management
│   ├── navigation/           # Navigation configuration
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   └── utils/                # Helper functions & types
├── App.tsx                   # Main entry point
├── app.json                  # Expo configuration
├── .env                      # Environment variables
└── package.json              # Dependencies
```

## 🔐 Authentication Flow

1. **App Launch** → AuthContext checks stored token
2. **No Token** → Display login screens
3. **Token Valid** → Load user data and navigate to dashboard
4. **Location Capture** → GPS coordinates saved with user ID
5. **Token Expiry** → Auto-refresh with refresh token
6. **Logout** → Clear all stored data

## 📍 Location Tracking

The app automatically:
- Requests location permissions on app start
- Captures device GPS coordinates (latitude & longitude)
- Records accurate location data
- Saves location to backend database
- Includes timestamp for tracking

## 📱 Screens Overview

### Login Screens
- **LoginScreen**: Email and password authentication
- **FaceLoginScreen**: Facial recognition with camera

### Main Menu Screens (Empty - Ready to Develop)
- **DashboardScreen**: Main overview
- **AttendanceScreen**: Attendance management
- **DTRScreen**: Daily time records
- **PayslipScreen**: Salary information
- **OvertimeRequestScreen**: Overtime requests
- **LeaveRequestScreen**: Leave management
- **TimeAdjustmentRequestScreen**: Time adjustments
- **ProfileScreen**: User profile

## 🔄 API Integration

All API endpoints and integration details are in `API_DOCUMENTATION.md`.

### Required Backend Endpoints
- `POST /auth/login` - User login
- `POST /auth/face-authenticate` - Facial recognition
- `POST /location/save` - Save user location
- `POST /auth/refresh-token` - Refresh JWT token

## 🛠️ Development

### Adding New Features

1. **Create new screen** in `src/screens/`
2. **Add to navigation** in `src/navigation/RootNavigator.tsx`
3. **Create services** in `src/services/` if needed
4. **Update types** in `src/utils/types.ts`

### API Calls
```typescript
import { apiClient } from '../services/api';

const response = await apiClient.get('/endpoint');
```

### Authentication
```typescript
import { useAuth } from '../context/AuthContext';

const { user, signIn, signOut } = useAuth();
```

## 📚 Documentation

- **Setup Guide**: `SETUP_GUIDE.md` - Initial setup instructions
- **API Documentation**: `API_DOCUMENTATION.md` - API endpoints & integration
- **Development Guide**: `DEVELOPMENT_GUIDE.md` - Development best practices

## 🔧 Dependencies

Key packages:
- **@react-navigation/native** - Navigation framework
- **@react-navigation/drawer** - Drawer navigation
- **expo-camera** - Camera access
- **expo-face-detector** - Face detection
- **expo-location** - GPS location
- **axios** - HTTP client
- **AsyncStorage** - Secure storage

## ⚙️ Configuration

### Permissions
The app requests:
- Camera (for facial recognition)
- Location (for GPS tracking)

### Environment Variables
```env
EXPO_PUBLIC_API_URL      # Backend API URL
EXPO_PUBLIC_APP_NAME     # Application name
EXPO_PUBLIC_VERSION      # App version
```

## 🐛 Troubleshooting

### Camera Not Working
- Check camera permissions in device settings
- Ensure proper lighting for face detection
- Restart Expo development app

### Location Not Captured
- Verify location permissions are granted
- Enable GPS on device
- Check backend API connectivity

### API Connection Issues
- Verify `.env` has correct API URL
- Check backend server is running
- Review network connectivity

## 📈 Performance

- Optimized component rendering
- Lazy loading of screens
- Efficient API caching
- Image compression
- Memory management

## 🔒 Security Features

- JWT token-based authentication
- Automatic token refresh
- Secure AsyncStorage
- Request/response interceptors
- Protected API calls
- Face data encryption

## 📦 Building for Production

### Android
```bash
eas build --platform android
```

### iOS
```bash
eas build --platform ios
```

Requires EAS account and CLI.

## 🤝 Contributing

When contributing:
1. Follow TypeScript best practices
2. Add proper error handling
3. Test on Android and iOS
4. Update documentation
5. Use descriptive commit messages

## 📝 Version History

- **v1.0.0** (Jan 30, 2026) - Initial release
  - Facial recognition authentication
  - GPS location tracking
  - 8-menu drawer navigation
  - JWT authentication
  - Location auto-save

## 📧 Support

For issues or questions, contact the development team.

## 📄 License

Proprietary - All rights reserved

---

**Status**: Development Ready ✅
**Last Updated**: January 30, 2026
**Platform**: React Native (Expo)
**Type**: Mobile Employee Management System
