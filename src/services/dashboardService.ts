import { apiClient } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';


export interface Bulletin {
  id: number;
  title?: string;
  content?: string;
  file_name?: string;
  created_at?: string;
  updated_at?: string;
}

interface BulletinResponse {
  success: boolean;
  data: Bulletin[];
  message: string;
}

interface UserData {
  emp_ID: string;
  [key: string]: any;
}

const dashboardService = {
  /**
   * Fetch all bulletins with photos
   */
  getAllBulletins: async (): Promise<Bulletin[]> => {
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

      const response = await apiClient.get<BulletinResponse>(
        '/bulletins/get_all_bulletin',
        { headers }
      );
      
      if (response.data) {
        return response.data.data;
      }
      
      throw new Error(response.data || 'Failed to fetch bulletins');
    } catch (error: any) {
      console.error('Error fetching bulletins:', error);
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Unable to fetch bulletins'
      );
    }
  },

  /**
   * Fetch a single bulletin by ID
   */
  getBulletinById: async (bulletinId: number): Promise<Bulletin> => {
    try {
      // Get token and user data from storage
      const token = await AsyncStorage.getItem('access_token');
      const userDataStr = await AsyncStorage.getItem('user_data');
      const userData: UserData | null = userDataStr ? JSON.parse(userDataStr) : null;

      if (!token || !userData?.emp_ID) {
        throw new Error('Missing authentication credentials');
      }

      const headers = {
        'X-JWT-TOKEN': token,
        'X-EMP-ID': userData.emp_ID,
      };

      const response = await apiClient.get<{ success: boolean; data: Bulletin }>(
        `/bulletin/get_bulletin/${bulletinId}`,
        { headers }
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error('Failed to fetch bulletin');
    } catch (error: any) {
      console.error('Error fetching bulletin:', error);
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Unable to fetch bulletin'
      );
    }
  },
};

export default dashboardService;
