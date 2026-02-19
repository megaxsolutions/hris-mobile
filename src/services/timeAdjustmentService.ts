import { apiClient } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AdjustmentReason {
  id: number;
  reason: string;
  requires_file?: boolean;
}

export interface TimeAdjustmentRequest {
  id: number;
  emp_ID: number;
  date: string;
  time_in: string;
  time_out: string;
  reason: string;
  reason_id: number;
  is_overnight: boolean;
  status: string;
  details?: string;
  files?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceRecord {
  id: number;
  emp_ID: number;
  date: string;
  time_in: string | null;
  time_out: string | null;
  break_in: string | null;
  break_out: string | null;
  coaching_start: string | null;
  coaching_end: string | null;
  created_at?: string;
  updated_at?: string;
}

interface UserData {
  emp_ID: string;
  [key: string]: any;
}

const timeAdjustmentService = {
  getAdjustmentReasons: async (): Promise<AdjustmentReason[]> => {
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

      const response = await apiClient.get<{ data: AdjustmentReason[] }>(
        '/adjustments/get_reasons',
        { headers }
      );

      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      return [];
    } catch (error: any) {
      console.error('Error fetching adjustment reasons:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Unable to fetch adjustment reasons'
      );
    }
  },

  getAttendanceByDate: async (date: string): Promise<AttendanceRecord | null> => {
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

      const response = await apiClient.get<{ data: AttendanceRecord[] }>(
        `/attendances/get_all_attendance/${userData.emp_ID}`,
        { headers }
      );

      if (response.data && Array.isArray(response.data.data)) {
        // Filter by date
        const record = response.data.data.find(
          (r) => r.date.split('T')[0] === date
        );
        return record || null;
      }

      return null;
    } catch (error: any) {
      console.error('Error fetching attendance:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Unable to fetch attendance'
      );
    }
  },

  getAllUserAdjustmentRequests: async (): Promise<TimeAdjustmentRequest[]> => {
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

      const response = await apiClient.get<{ data: TimeAdjustmentRequest[] }>(
        `/adjustments/get_all_user_adjustment/${userData.emp_ID}`,
        { headers }
      );

      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      return [];
    } catch (error: any) {
      console.error('Error fetching adjustment requests:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Unable to fetch adjustment requests'
      );
    }
  },

  addTimeAdjustmentRequest: async (payload: {
    date: string;
    time_in: string;
    time_out: string;
    reason_id: number;
    reason: string;
    is_overnight: boolean;
    details?: string;
    files?: string | null;
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
        '/adjustments/add_time_adjustment',
        {
          emp_ID: userData.emp_ID,
          date: payload.date,
          time_in: payload.time_in,
          time_out: payload.time_out,
          reason_id: payload.reason_id,
          reason: payload.reason,
          is_overnight: payload.is_overnight,
          force_multiple: true,
          details: payload.details || '',
          files: payload.files || null,
          status: 'Pending',
        },
        { headers }
      );

      if (response.data) {
        return response.data;
      }

      throw new Error('Failed to submit time adjustment request');
    } catch (error: any) {
      console.error('Error submitting time adjustment request:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Unable to submit time adjustment request'
      );
    }
  },
};

export default timeAdjustmentService;
