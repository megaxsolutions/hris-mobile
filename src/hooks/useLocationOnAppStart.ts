import { useEffect } from 'react';
import { LocationService } from '../services/locationService';
import { useAuth } from '../context/AuthContext';

export const useLocationOnAppStart = () => {
  const { user } = useAuth();

  useEffect(() => {
    const initializeLocation = async () => {
      if (user?.id) {
        try {
          const location = await LocationService.getLocationOnAppStart(user.id);
          if (location) {
            console.log('Location captured and saved:', location);
          }
        } catch (error) {
          console.error('Error initializing location:', error);
        }
      }
    };

    initializeLocation();
  }, [user?.id]);
};
