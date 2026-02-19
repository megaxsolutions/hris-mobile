import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, AuthUser } from '../services/authService';
import { LocationService } from '../services/locationService';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isSignout: boolean;
  signIn: (employeeId: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  bootstrapAsync: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useState<{
    isLoading: boolean;
    isSignout: boolean;
    user: AuthUser | null;
  }>({
    isLoading: true,
    isSignout: false,
    user: null,
  });

  const bootstrapAsync = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        dispatch({
          type: 'RESTORE_TOKEN',
          token: user.token,
          user,
        } as any);
        
        // Get location in background (don't block app startup)
        LocationService.getLocationWithRetry(user.id, 3, 2000).catch((error) => {
          console.warn('Background location capture failed:', error);
        });
      } else {
        dispatch({
          type: 'SIGN_OUT',
        } as any);
      }
    } catch (e) {
      console.error('Error bootstrapping app:', e);
      dispatch({
        type: 'SIGN_OUT',
      } as any);
    }
  };

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const authContext: AuthContextType = {
    user: state.user,
    isLoading: state.isLoading,
    isSignout: state.isSignout,
    signIn: async (emp_ID: string, password: string) => {
      try {
        const user = await AuthService.login(emp_ID, password);
        if (user) {
          dispatch({
            type: 'SIGN_IN',
            user,
          } as any);
          
          // Get location in background (don't block navigation)
          LocationService.getLocationWithRetry(user.id, 3, 2000).catch((error) => {
            console.warn('Location capture failed after login:', error);
          });
        } else {
          throw new Error('Failed to sign in');
        }
      } catch (error) {
        console.error('Error signing in:', error);
        throw error;
      }
    },
    signOut: async () => {
      try {
        await AuthService.logout();
        dispatch({
          type: 'SIGN_OUT',
        } as any);
      } catch (error) {
        console.error('Error signing out:', error);
        throw error;
      }
    },
    bootstrapAsync,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
