import { apiClient } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LeaveType {
  id: number;
  type: string;
}

export interface LeaveRequest {
  id: number;
  emp_ID: number;
  leave_type_id: number;
  leave_type: string;
  details: string;
  date: string;
  date_end: string;
  status: string;
  file_uploaded: string | null;
  created_at?: string;
  updated_at?: string;
}

interface UserData {
  emp_ID: string;
  [key: string]: any;
}

const leaveRequestService = {
  getAllLeaveTypes: async (): Promise<LeaveType[]> => {
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

      const response = await apiClient.get<{ data: LeaveType[] }>(
        '/leave_types/get_all_leave_type',
        { headers }
      );

      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      return [];
    } catch (error: any) {
      console.error('Error fetching leave types:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Unable to fetch leave types'
      );
    }
  },

  getAllUserLeaveRequests: async (): Promise<LeaveRequest[]> => {
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

      const response = await apiClient.get<{ data: LeaveRequest[] }>(
        `/leave_requests/get_all_user_leave_request/${userData.emp_ID}`,
        { headers }
      );

      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      return [];
    } catch (error: any) {
      console.error('Error fetching leave requests:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Unable to fetch leave requests'
      );
    }
  },

  addLeaveRequest: async (payload: {
    leave_type_id: number;
    leave_type: string;
    details: string;
    date: string;
    date_end: string;
    file_uploaded?: string | null;
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
        '/leave_requests/add_leave_request',
        {
          emp_ID: userData.emp_ID,
          leave_type_id: payload.leave_type_id,
          leave_type: payload.leave_type,
          details: payload.details,
          date: payload.date,
          date_end: payload.date_end,
          status: 'Pending',
          file_uploaded: payload.file_uploaded || null,
        },
        { headers }
      );

      if (response.data) {
        return response.data;
      }

      throw new Error('Failed to submit leave request');
    } catch (error: any) {
      console.error('Error submitting leave request:', error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Unable to submit leave request'
      );
    }
  },
};

export default leaveRequestService;
