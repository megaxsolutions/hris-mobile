import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import attendanceService, { ClockState, TodayShiftAttendance } from '../services/attendanceService';
import { LocationService } from '../services/locationService';

interface SwipeSliderProps {
  onSuccess?: () => void;
  isInsideWorkingSite?: boolean;
}

export const SwipeSlider: React.FC<SwipeSliderProps> = ({
  onSuccess,
  isInsideWorkingSite,
}) => {
  const [clockState, setClockState] = useState<ClockState | null>(null);
  const clockStateRef = useRef<ClockState | null>(null);
  const [todayShiftAttendance, setTodayShiftAttendance] = useState<TodayShiftAttendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [sliderLoading, setSliderLoading] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(300);
  const pan = useRef(new Animated.ValueXY()).current;
  const circleSize = 60;
  const knobStartLeft = 8;
  const maxTravel = Math.max(0, sliderWidth - circleSize - knobStartLeft);
  const isGeofenceBlocked = isInsideWorkingSite === false;
  const isGeofenceBlockedRef = useRef(isGeofenceBlocked);

  useEffect(() => {
    isGeofenceBlockedRef.current = isGeofenceBlocked;

    if (isGeofenceBlocked) {
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    }
  }, [isGeofenceBlocked, pan]);

  const fetchClockState = async () => {
    try {
      setLoading(true);
      const state = await attendanceService.getUserClockState();
      setClockState(state);
      clockStateRef.current = state;
    } catch (error) {
      console.error('Error fetching clock state:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayShiftAttendance = async () => {
    const data = await attendanceService.getTodayShiftAttendance();
    setTodayShiftAttendance(data);
  };

  useEffect(() => {
    fetchClockState();
    fetchTodayShiftAttendance();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isGeofenceBlockedRef.current,
      onMoveShouldSetPanResponder: () => !isGeofenceBlockedRef.current,
      onPanResponderMove: (e, { dx }) => {
        if (isGeofenceBlockedRef.current) {
          return;
        }
        const clampedDx = Math.max(0, Math.min(dx, maxTravel));
        pan.x.setValue(clampedDx);
      },
      onPanResponderRelease: async (e, { dx }) => {
        if (isGeofenceBlockedRef.current) {
          return;
        }

        const clampedDx = Math.max(0, Math.min(dx, maxTravel));
        if (clampedDx >= maxTravel) {
          const currentClockState = clockStateRef.current;

          try {
            setSliderLoading(true);
            if (currentClockState?.state === 0) {
              const currentLocation = await LocationService.getCurrentLocation();
              if (!currentLocation) {
                throw new Error('Unable to get your location. Please enable location and try again.');
              }

              await attendanceService.clockIn({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              });

              Alert.alert('Success', 'Clocked in successfully!');
            } else if (currentClockState?.emp_ID) {
              await attendanceService.clockOut(currentClockState.emp_ID.toString());
              Alert.alert('Success', 'Clocked out successfully!');
            }

            await fetchClockState();
            await fetchTodayShiftAttendance();
            onSuccess?.();
          } catch (error: any) {
            console.error('Clock action error:', error);
            Alert.alert('Error', error.message || 'Failed to process clock action');
          } finally {
            setSliderLoading(false);
          }

          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const parseLocalDate = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    const normalized = dateString.endsWith('Z') ? dateString.replace('Z', '') : dateString;
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const formatShiftRange = (shiftIn: string | null, shiftOut: string | null) => {
    const start = parseLocalDate(shiftIn);
    const end = parseLocalDate(shiftOut);

    if (!start || !end) return '--';

    const startDay = start.toLocaleDateString('en-US', { weekday: 'short' });
    const startTime = start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const endDay = end.toLocaleDateString('en-US', { weekday: 'short' });
    const endTime = end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return `${startDay} ${startTime} to ${endDay} ${endTime}`;
  };

  const formatClockLabel = (dateString: string | null) => {
    const date = parseLocalDate(dateString);
    if (!date) return '--';

    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return `${day} ${time}`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }

  const isClockedIn = clockState?.state === 1;
  const backgroundColor = isClockedIn ? '#FF9500' : '#34C759';
  const label = isGeofenceBlocked
    ? 'not inside the working site'
    : isClockedIn
      ? 'Slide to Clock Out'
      : 'Slide to Clock In';

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.shiftText}>
          {formatShiftRange(todayShiftAttendance?.shift_in || null, todayShiftAttendance?.shift_out || null)}
        </Text>

        <Text style={styles.statusLabel}>{isClockedIn ? 'Clocked In' : 'Clocked Out'}</Text>

        <View style={styles.timeRow}>
          <Text style={styles.timeText}>
            Clock In: {formatClockLabel(todayShiftAttendance?.latest_time_in || clockState?.time_in || null)}
          </Text>
          <Text style={styles.timeText}>
            Clock Out: {formatClockLabel(todayShiftAttendance?.latest_time_out || clockState?.time_out || null)}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.sliderContainer,
          { backgroundColor },
          isGeofenceBlocked && styles.sliderContainerDisabled,
        ]}
        onLayout={(event) => {
          const width = event.nativeEvent.layout.width;
          if (width > 0 && width !== sliderWidth) {
            setSliderWidth(width);
          }
        }}
        {...panResponder.panHandlers}
      >
        <Animated.View
          style={[
            styles.circle,
            isGeofenceBlocked && styles.circleDisabled,
            { transform: [{ translateX: pan.x }] },
          ]}
        >
          {sliderLoading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <MaterialIcons name="arrow-forward" size={28} color="#007AFF" />
          )}
        </Animated.View>

        <Text style={styles.sliderLabel}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 15,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  shiftText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  sliderContainer: {
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  sliderContainerDisabled: {
    opacity: 0.7,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  circleDisabled: {
    backgroundColor: '#f2f2f2',
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 80,
  },
});
