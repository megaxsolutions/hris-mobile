# Employee Management App - React Native

A comprehensive React Native application for employee management with facial recognition authentication, location tracking, and an extensive menu-driven interface.

## Features

### Authentication
- **Facial Recognition Login**: Advanced face detection and authentication using expo-face-detector
- **Email/Password Authentication**: Traditional login method
- **Token Management**: JWT-based authentication with automatic token refresh
- **Secure Storage**: Uses AsyncStorage for secure token management

### Location Tracking
- **Real-time GPS**: Captures user's exact latitude and longitude on app startup
- **Automatic Logging**: Location data is automatically saved to the database when opening the app
- **High Accuracy**: Uses the highest accuracy setting for location detection

### Navigation
- **Side Drawer Navigation**: Easy-to-use side menu with all sections
- **Organized Screens**: Separate screens for each feature

### Screens & Modules

1. **Dashboard** - Main overview and summary screen
2. **Attendance** - Track employee attendance
3. **DTR (Daily Time Record)** - View daily time records
4. **Payslip** - Access salary and payslip information
5. **Overtime Request** - Submit and manage overtime requests
6. **Leave Request** - Request and track leave applications
7. **Time Adjustment Request** - Request time adjustments
8. **Profile** - View and manage user profile

## Project Structure

```
EmployeeApp/
├── src/
│   ├── screens/           # All application screens
│   ├── services/          # API and location services
│   │   ├── api.ts         # Axios HTTP client with interceptors
│   │   ├── authService.ts # Authentication logic
│   │   └── locationService.ts # Location tracking
│   ├── context/           # React Context for state management
│   │   └── AuthContext.tsx # Authentication state management
│   ├── navigation/        # Navigation configuration
│   │   └── RootNavigator.tsx # Main navigation setup
│   └── utils/             # Utility functions
├── App.tsx                # Main App component
├── app.json              # Expo configuration
├── .env                  # Environment variables
└── package.json          # Dependencies
```

## Installation

1. **Install Node.js and npm** if not already installed

2. **Install dependencies**:
```bash
cd EmployeeApp
npm install
```

3. **Install Expo CLI** (if not installed):
```bash
npm install -g expo-cli
```

4. **Configure Environment Variables**:
Update `.env` file with your API endpoint:
```env
EXPO_PUBLIC_API_URL=http://your-backend-api.com/api
```

## Running the App

### Start the development server:
```bash
npm start
```

### Run on Android:
```bash
npm run android
```

### Run on iOS (macOS only):
```bash
npm run ios
```

### Run on Web:
```bash
npm run web
```

## Configuration

### Environment Variables (.env)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_APP_NAME=Employee Management App
EXPO_PUBLIC_VERSION=1.0.0
```

## API Integration

The app communicates with a backend API for:

### Authentication Endpoints
- `POST /auth/login` - Email/password login
- `POST /auth/face-authenticate` - Facial recognition login
- `POST /auth/register-face` - Register face data
- `POST /auth/refresh-token` - Refresh JWT token

### Location Endpoints
- `POST /location/save` - Save user location

### Required Request Body for Face Authentication
```json
{
  "faceImage": "base64_face_data",
  "timestamp": "ISO_timestamp"
}
```

### Required Request Body for Location
```json
{
  "userId": "user_id",
  "latitude": 10.123456,
  "longitude": 121.654321,
  "accuracy": 5,
  "timestamp": "ISO_timestamp"
}
```

## Dependencies

Key packages used:
- **@react-navigation/native** - Navigation
- **@react-navigation/drawer** - Drawer navigation
- **expo-camera** - Camera access
- **expo-face-detector** - Facial detection
- **expo-location** - GPS location
- **axios** - HTTP client
- **@react-native-async-storage/async-storage** - Secure storage
- **react-native-gesture-handler** - Gesture handling

## Authentication Flow

1. User launches app
2. AuthContext checks if user is authenticated
3. If authenticated, app navigates to main drawer navigation
4. If not, user is directed to login screen
5. User can choose:
   - Email/Password login
   - Facial recognition login
6. Upon successful login:
   - User data and tokens are stored
   - Location is captured and saved
   - User is navigated to Dashboard

## Permissions Required

- **Camera**: For facial recognition authentication
- **Location**: For GPS tracking

Users will be prompted to grant permissions on first use.

## Security Features

- JWT token-based authentication
- Automatic token refresh on expiration
- Secure token storage in AsyncStorage
- Request interceptors for adding auth headers
- Response interceptors for handling auth errors

## Future Enhancements

- Push notifications
- Offline mode with sync
- Advanced analytics dashboard
- Biometric authentication options
- Real-time data synchronization
- Enhanced security features

## Troubleshooting

### Camera not working
- Ensure camera permissions are granted
- Check that the device has a camera
- Restart the Expo app

### Location not updating
- Verify location permissions are granted
- Check GPS is enabled on device
- Ensure backend API is running

### API connection issues
- Verify `.env` has correct API URL
- Check backend server is running
- Review API endpoint configuration

## Support

For issues or questions, please contact the development team.

## License

Proprietary - All rights reserved
