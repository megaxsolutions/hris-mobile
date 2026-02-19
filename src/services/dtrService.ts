import { apiClient } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DtrRecord {
  id: number;
  emp_ID: number;
  date: string;
  time_in: string | null;
  time_out: string | null;
  break_in: string | null;
  break_out: string | null;
  coaching_start: string | null;
  coaching_end: string | null;
  lunch_in: string | null;
  lunch_out: string | null;
}

interface UserData {
  emp_ID: string;
  [key: string]: any;
}

const dtrService = {
  getAllUserDtr: async (cutoffId: string): Promise<DtrRecord[]> => {
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

      const response = await apiClient.get<{ data: DtrRecord[] }>(
        `/dtr/get_all_user_dtr/${userData.emp_ID}/${cutoffId}`,
        { headers }
      );
      console.log('DTR records response:', response.data);
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      return [];
    } catch (error: any) {
      console.error('Error fetching DTR records:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Unable to fetch DTR records'
      );
    }
  },
};

export default dtrService;