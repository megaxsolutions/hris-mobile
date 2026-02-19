import { apiClient } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PayslipRecord {
  id: number;
  emp_ID: number;
  cutoff_ID: number;
  gross_pay?: number;
  net_pay?: number;
  total_deductions?: number;
  generated_at?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

interface UserData {
  emp_ID: string;
  [key: string]: any;
}

const payslipService = {
  getAllUserPayslip: async (cutoffId: string): Promise<PayslipRecord[]> => {
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

      const response = await apiClient.get<{ data: PayslipRecord[] }>(
        `/payslips/get_all_user_payslip/${userData.emp_ID}/${cutoffId}`,
        { headers }
      );

      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      return [];
    } catch (error: any) {
      console.error('Error fetching payslips:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Unable to fetch payslips'
      );
    }
  },
};

export default payslipService;