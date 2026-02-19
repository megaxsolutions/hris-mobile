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

      const response = await apiClient.get<{ data: Cutoff[] }>(
        '/cutoffs/get_all_cutoff',
        { headers }
      );

      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
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