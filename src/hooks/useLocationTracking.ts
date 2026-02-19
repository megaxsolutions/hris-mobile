import { useEffect, useState, useCallback } from 'react';
import { LocationService, LocationData } from '../services/locationService';
import { useAuth } from '../context/AuthContext';

export const useLocationTracking = (enabled: boolean = false, intervalMs: number = 60000) => {
  const { user } = useAuth();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startTracking = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      const success = await LocationService.startLocationTracking(
        user.id,
        (updatedLocation) => {
          setLocation(updatedLocation);
          // Cache location
          LocationService.cacheLocation(updatedLocation);
        },
        intervalMs
      );

      if (success) {
        setIsTracking(true);
        setError(null);
      } else {
        setError('Failed to start location tracking');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error starting location tracking:', err);
    }
  }, [user, intervalMs]);

  const stopTracking = useCallback(() => {
    LocationService.stopLocationTracking();
    setIsTracking(false);
  }, []);

  const getLocationNow = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    try {
      const currentLocation = await LocationService.getCurrentLocation();
      if (currentLocation) {
        setLocation(currentLocation);
        setError(null);
        return currentLocation;
      } else {
        setError('Failed to get current location');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    }
  }, [user]);

  useEffect(() => {
    if (enabled && user) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [enabled, user, startTracking, stopTracking]);

  return {
    location,
    isTracking,
    error,
    startTracking,
    stopTracking,
    getLocationNow,
  };
};
