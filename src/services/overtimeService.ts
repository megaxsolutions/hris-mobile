import { apiClient } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OvertimeType {
  id: number;
  type: string;
}

export interface OvertimeRequest {
  id: number;
  emp_ID: number;
  ot_type: number;
  date: string;
  startSpec: string;
  endSpec: string;
  status?: string;
  hrs?: number;
  created_at?: string;
  updated_at?: string;
}
interface UserData {
  emp_ID: string;
  [key: string]: any;
}

const overtimeService = {
  getAllOvertimeTypes: async (): Promise<OvertimeType[]> => {
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

      const response = await apiClient.get<{ data: OvertimeType[] }>(
        '/overtime_types/get_all_overtime_type',
        { headers }
      );

      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      return [];
    } catch (error: any) {
      console.error('Error fetching overtime types:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Unable to fetch overtime types'
      );
    }
  },

  getAllUserOvertimeRequests: async (): Promise<OvertimeRequest[]> => {
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

      const response = await apiClient.get<{ data: OvertimeRequest[] }>(
        `/overtime_requests/get_all_user_overtime_request/${userData.emp_ID}`,
        { headers }
      );

      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      return [];
    } catch (error: any) {
      console.error('Error fetching overtime requests:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Unable to fetch overtime requests'
      );
    }
  },

  addOvertimeRequest: async (payload: {
    ot_type: number;
    date: string;
    startSpec: string;
    endSpec: string;
    hrs: number;
    status: string;
  }): Promise<any> => {
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

      const response = await apiClient.post(
        '/overtime_requests/add_overtime_request',
        {
          emp_ID: userData.emp_ID,
          ot_type: payload.ot_type,
          date: payload.date,
          startSpec: payload.startSpec,
          endSpec: payload.endSpec,
          hrs: payload.hrs,
          status: payload.status,
        },
        { headers }
      );

      if (response.data) {
        return response.data;
      }

      throw new Error('Failed to submit overtime request');
    } catch (error: any) {
      console.error('Error submitting overtime request:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Unable to submit overtime request'
      );
    }
  },
};

export default overtimeService;