import { apiClient } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ClockState {
 break_state: number;
 coaching_state: number;
 lunch_state: number;
 state: number;
 emp_ID: number;
 id: number;
 time_in: string | null;
 time_out: string | null;
 break_in: string | null;
 break_out: string | null;
 coaching_start: string | null;
 coaching_end: string | null;
}

export interface AttendanceRecord {
  id: number;
  emp_ID: number;
  timeIN: string | null;
  timeOUT: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

interface UserData {
  emp_ID: string;
  [key: string]: any;
}

const createDefaultClockState = (empId: string): ClockState => ({
  break_state: 0,
  coaching_state: 0,
  lunch_state: 0,
  state: 0,
  emp_ID: parseInt(empId, 10) || 0,
  id: 0,
  time_in: null,
  time_out: null,
  break_in: null,
  break_out: null,
  coaching_start: null,
  coaching_end: null,
});

interface ClockInPayload {
  latitude: number;
  longitude: number;
}

export interface AssignedGeofence {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
}

interface MobileGeofenceResponse {
  has_geofence: boolean;
  geofence: AssignedGeofence | null;
}

const attendanceService = {
  /**
   * Get the current clock state of the user
   */
  getUserClockState: async (): Promise<ClockState> => {
    let userData: UserData | null = null;
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userDataStr = await AsyncStorage.getItem('user_data');
      userData = userDataStr ? JSON.parse(userDataStr) : null;
      
      
      if (!token || !userData?.emp_ID) {
        throw new Error('Missing authentication credentials');
      }

      const headers = {
        'X-JWT-TOKEN': token,
        'X-EMP-ID': userData.emp_ID,
      };

      const response = await apiClient.get<{ data: ClockState[] }>(
        `/attendances/get_user_clock_state/${userData.emp_ID}`,
        { headers }
      );

      //console.log('Clock state response:', response.data);
      
      // Handle array response
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        const clockStates = response.data.data;
        //console.log('Clock states array:', clockStates);
        // Return the first item in the array (most recent)
        if (clockStates.length > 0) {
          return clockStates[0];
        }
        
        // If array is empty, return default clocked out state
        return {
          break_state: 0,
          coaching_state: 0,
          lunch_state: 0,
          state: 0,
          emp_ID: parseInt(userData.emp_ID),
          id: 0,
          time_in: null,
          time_out: null,
          break_in: null,
          break_out: null,
          coaching_start: null,
          coaching_end: null,
        };
      }

      return createDefaultClockState(userData.emp_ID);
    } catch (error: any) {
      console.error('Error fetching clock state:', error);
      return createDefaultClockState(userData?.emp_ID || '0');
    }
  },

  /**
   * Clock in the user
   */
  clockIn: async (payload: ClockInPayload): Promise<any> => {
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
        '/attendances/mobile/clock_in',
        {
          emp_id: userData.emp_ID,
          latitude: payload.latitude,
          longitude: payload.longitude,
        },
        { headers }
      );
      //console.log('Clock in response data:', response.data);
      if (response.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to clock in');
    } catch (error: any) {
      console.error('Error clocking in:', error);
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Unable to clock in'
      );
    }
  },

  /**
   * Clock out the user
   */
  clockOut: async (empId: string): Promise<any> => {
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

      const response = await apiClient.put(
        `/attendances/update_attendance_time_out/${empId}`,
        {},
        { headers }
      );

      if (response.data.success) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to clock out');
    } catch (error: any) {
      console.error('Error clocking out:', error);
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Unable to clock out'
      );
    }
  },
  
  /**
   * Get all attendance records for the user
   */
  getAllUserAttendance: async (): Promise<AttendanceRecord[]> => {
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
        `/attendances/get_all_user_attendance/${userData.emp_ID}`,
        { headers }
      );

      //console.log('Attendance records response:', response.data);
      
      if (response.data) {
        return response.data.data;
      }

      return [];
    } catch (error: any) {
      console.error('Error fetching attendance records:', error);
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Unable to fetch attendance records'
      );
    }
  },

  /**
   * Get assigned geofence for mobile clock-in map display
   */
  getMobileAssignedGeofence: async (): Promise<AssignedGeofence | null> => {
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

      const response = await apiClient.get<{ data: MobileGeofenceResponse }>(
        `/attendances/mobile/geofence/${userData.emp_ID}`,
        { headers }
      );

      if (response.data?.data?.has_geofence && response.data.data.geofence) {
        return response.data.data.geofence;
      }

      return null;
    } catch (error: any) {
      console.error('Error fetching mobile assigned geofence:', error);
      return null;
    }
  },
};

export default attendanceService;
