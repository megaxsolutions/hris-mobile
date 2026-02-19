import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './api';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  provider?: string;
}
interface UserData {
  emp_ID: string;
  [key: string]: any;
}

export interface LocationWithAddress extends LocationData {
  address?: {
    street?: string;
    city?: string;
    region?: string;
    country?: string;
    postalCode?: string;
  };
}

let locationSubscription: Location.LocationSubscription | null = null;

export const LocationService = {
  /**
   * Request foreground location permissions
   */
  async requestForegroundPermissions() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Foreground location permission status:', status);
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting foreground location permissions:', error);
      return false;
    }
  },

  /**
   * Request background location permissions
   */
  async requestBackgroundPermissions() {
    try {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      console.log('Background location permission status:', status);
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting background location permissions:', error);
      return false;
    }
  },

  /**
   * Get the most accurate current location
   */
  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const hasPermission = await this.requestForegroundPermissions();
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      // Request high accuracy location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        altitude: location.coords.altitude,
        altitudeAccuracy: location.coords.altitudeAccuracy,
        heading: location.coords.heading,
        speed: location.coords.speed,
        provider: location.coords.heading !== undefined ? 'GPS' : 'NETWORK',
      };

      console.log('Current location:', locationData);
      return locationData;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  },

  /**
   * Get location with reverse geocoding (address)
   */
  async getCurrentLocationWithAddress(): Promise<LocationWithAddress | null> {
    try {
      const location = await this.getCurrentLocation();
      if (!location) return null;

      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude: location.latitude,
          longitude: location.longitude,
        });

        const address = addresses[0];
        const locationWithAddress: LocationWithAddress = {
          ...location,
          address: {
            street: address.street || undefined,
            city: address.city || undefined,
            region: address.region || undefined,
            country: address.country || undefined,
            postalCode: address.postalCode || undefined,
          },
        };

        console.log('Location with address:', locationWithAddress);
        return locationWithAddress;
      } catch (geocodeError) {
        console.warn('Geocoding failed, returning location without address:', geocodeError);
        return location;
      }
    } catch (error) {
      console.error('Error getting location with address:', error);
      return null;
    }
  },

  /**
   * Start watching location with updates
   */
  async startLocationTracking(
    userId: string,
    onLocationUpdate?: (location: LocationData) => void,
    intervalMs: number = 60000 // Default 1 minute
  ): Promise<boolean> {
    try {
      const hasPermission = await this.requestForegroundPermissions();
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      // Stop existing subscription
      if (locationSubscription) {
        locationSubscription.remove();
      }

      // Start watching location
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: intervalMs,
          distanceInterval: 10, // Update if moved 10+ meters
        },
        (location) => {
          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            altitude: location.coords.altitude,
            altitudeAccuracy: location.coords.altitudeAccuracy,
            heading: location.coords.heading,
            speed: location.coords.speed,
            provider: location.coords.heading !== undefined ? 'GPS' : 'NETWORK',
          };

          console.log('Location update:', locationData);

          // Call callback if provided
          if (onLocationUpdate) {
            onLocationUpdate(locationData);
          }

          // Save to database
          this.saveLocationToDatabase(userId, locationData);
        }
      );

      console.log('Location tracking started');
      return true;
    } catch (error) {
      console.error('Error starting location tracking:', error);
      return false;
    }
  },

  /**
   * Stop watching location
   */
  stopLocationTracking() {
    try {
      if (locationSubscription) {
        locationSubscription.remove();
        locationSubscription = null;
        console.log('Location tracking stopped');
      }
    } catch (error) {
      console.error('Error stopping location tracking:', error);
    }
  },

  /**
   * Save location to database
   */
  async saveLocationToDatabase(userId: string, locationData: LocationData) {
    try {
      // Get token and user data from storage
      const token = await AsyncStorage.getItem('userToken');
      const userDataStr = await AsyncStorage.getItem('user_data');
      const userData: UserData | null = userDataStr ? JSON.parse(userDataStr) : null;

      if (!token || !userData?.emp_ID) {
        throw new Error('Missing authentication credentials');
      }

      const headers = {
        'X-JWT-TOKEN': token,
        'X-EMP-ID': userData.emp_ID,
      };
      const response = await apiClient.post('/location/save', {
        emp_id: userId,
        ...locationData,
      }, { headers });
      console.log('Location saved to database');
      return response.data;
    } catch (error) {
      console.error('Error saving location to database:', error);
      return null;
    }
  },

  /**
   * Get location on app start (one-time)
   */
  async getLocationOnAppStart(userId: string): Promise<LocationData | null> {
    try {
      const location = await this.getCurrentLocationWithAddress();
      if (location) {
        await this.saveLocationToDatabase(userId, location);
        return location;
      }
      return null;
    } catch (error) {
      console.error('Error in getLocationOnAppStart:', error);
      return null;
    }
  },

  /**
   * Get location with retry logic for better accuracy
   */
  async getLocationWithRetry(
    userId: string,
    maxRetries: number = 3,
    retryDelayMs: number = 2000
  ): Promise<LocationData | null> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`Location request attempt ${attempt + 1}/${maxRetries}`);
        const location = await this.getCurrentLocation();

        if (
          location &&
          location.accuracy !== null &&
          location.accuracy <= 50 // If accuracy is better than 50 meters
        ) {
          await this.saveLocationToDatabase(userId, location);
          return location;
        }

        // If accuracy is not good enough, retry
        if (attempt < maxRetries - 1) {
          console.log(`Accuracy ${location?.accuracy}m, retrying...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        }
      } catch (error) {
        console.error(`Error on attempt ${attempt + 1}:`, error);
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        }
      }
    }

    console.warn('Failed to get accurate location after retries');
    return null;
  },

  /**
   * Get cached location
   */
  async getCachedLocation(): Promise<LocationData | null> {
    try {
      const cached = await AsyncStorage.getItem('lastLocation');
      if (cached) {
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      console.error('Error getting cached location:', error);
      return null;
    }
  },

  /**
   * Cache location locally
   */
  async cacheLocation(locationData: LocationData): Promise<boolean> {
    try {
      await AsyncStorage.setItem('lastLocation', JSON.stringify(locationData));
      return true;
    } catch (error) {
      console.error('Error caching location:', error);
      return false;
    }
  },
};
