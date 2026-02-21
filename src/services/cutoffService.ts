import { apiClient } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Cutoff {
  id: number;
  cutoff_name: string;
  start_date?: string;
  end_date?: string;
}

interface UserData {
  emp_ID: string;
  [key: string]: any;
}

const cutoffService = {
  getAllCutoffs: async (): Promise<Cutoff[]> => {
    try {
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

      // Backend currently exposes only /cutoffs/get_latest_cutoff.
      // Normalize to Cutoff[] so existing screens can keep using the same flow.
      const response = await apiClient.get<{ data: Cutoff | Cutoff[] }>(
        '/cutoffs/get_latest_cutoff',
        { headers }
      );

      const cutoffData = response.data?.data;
      if (Array.isArray(cutoffData)) {
        return cutoffData;
      }

      if (cutoffData && typeof cutoffData === 'object') {
        return [cutoffData];
      }

      return [];
    } catch (error: any) {
      console.error('Error fetching cutoffs:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Unable to fetch cutoffs'
      );
    }
  },
};

export default cutoffService;