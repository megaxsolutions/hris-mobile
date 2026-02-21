// Removed face detection imports
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './api';

export interface AuthUser {
  id: string;
  emp_ID?: string;
  name?: string;
  email?: string;
  token?: string;
  refreshToken?: string;
  avatar?: string | null;
  position?: string | null;
  department?: string | null;
}



// Removed face detector availability check

export const AuthService = {
  async requestCameraPermissions() {
    try {
      // Camera permissions are handled by useCameraPermissions hook
      return true;
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return false;
    }
  },


  async login(emp_ID: string, password: string): Promise<AuthUser | null> {
    try {
      const response = await apiClient.post('/employees/login_employee', {
        emp_ID,
        password,
      });
      console.log('Login response:', response.data);
      if (response.data) {
        const responseData = response.data;
        const userData = responseData.user_data || responseData.login?.[0] || null;

        const firstName = userData?.fName || userData?.first_name || '';
        const lastName = userData?.lName || userData?.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim();
        const userId = String(responseData.emp_id || userData?.emp_ID || emp_ID);

        const user: AuthUser = {
          id: userId,
          emp_ID: userId,
          token: responseData.data,
          refreshToken: responseData.refreshToken,
          name: fullName || `Employee ${userId}`,
          email: userData?.email || '',
        };

        await AsyncStorage.setItem('authUser', JSON.stringify(user));
        await AsyncStorage.setItem('userToken', user.token ?? '');
        await AsyncStorage.setItem('refreshToken', user.refreshToken ?? '');
        await AsyncStorage.setItem(
          'user_data',
          JSON.stringify(
            userData || {
              emp_ID: userId,
              first_name: firstName,
              last_name: lastName,
              email: user.email,
            }
          )
        );

        return user;
      }
      return null;
    } catch (error) {
      console.error('Error logging in:', error);
      return null;
    }
  },

  async logout() {
    try {
      await AsyncStorage.removeItem('authUser');
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('refreshToken');
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const userData = await AsyncStorage.getItem('authUser');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) {
        return null;
      }

      const response = await apiClient.post('/auth/refresh-token', {
        refreshToken,
      });

      if (response.data && response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        return response.data.token;
      }
      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  },

  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      const response = await apiClient.post('/employees/request-password-reset', {
        email,
      });

      if (response.data) {
        // Store email for later use in verification
        await AsyncStorage.setItem('resetEmail', email);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  },

  async verifyResetCode(email: string, code: string): Promise<boolean> {
    try {
      const response = await apiClient.post('/employees/verify-reset-code', {
        email,
        code,
      });

      if (response.data) {
        // Store verification token for password change
        await AsyncStorage.setItem('resetToken', response.data.resetToken || '');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying reset code:', error);
      throw error;
    }
  },

  async resetPassword(email: string, code: string, newPassword: string): Promise<boolean> {
    try {
      const response = await apiClient.post('/employees/reset-password', {
        email,
        code,
        newPassword,
      });

      if (response.data) {
        // Clear reset-related storage
        await AsyncStorage.removeItem('resetEmail');
        await AsyncStorage.removeItem('resetToken');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },
};
