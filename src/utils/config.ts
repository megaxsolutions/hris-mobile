export const APP_CONFIG = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'Employee Management App',
  VERSION: process.env.EXPO_PUBLIC_VERSION || '1.0.0',
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      FACE_AUTH: '/auth/face-authenticate',
      REGISTER_FACE: '/auth/register-face',
      REFRESH_TOKEN: '/auth/refresh-token',
      LOGOUT: '/auth/logout',
    },
    LOCATION: {
      SAVE: '/location/save',
    },
    USER: {
      PROFILE: '/user/profile',
    },
  },
  
  // Timeouts
  API_TIMEOUT: 30000,
  LOCATION_TIMEOUT: 10000,
  
  // Location settings
  LOCATION: {
    MIN_ACCURACY: 20,
    MAX_ACCURACY: 0.0001,
  },
};
