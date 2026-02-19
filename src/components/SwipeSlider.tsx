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
import attendanceService, { ClockState } from '../services/attendanceService';

interface SwipeSliderProps {
  onSuccess?: () => void;
}

export const SwipeSlider: React.FC<SwipeSliderProps> = ({ onSuccess }) => {
  const [clockState, setClockState] = useState<ClockState | null>(null);
  const clockStateRef = useRef<ClockState | null>(null);
  const [loading, setLoading] = useState(true);
  const [sliderLoading, setSliderLoading] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const sliderWidth = 300;
  const circleSize = 60;
  const maxTravel = sliderWidth - circleSize - 16; // Full distance to reach end

  useEffect(() => {
    fetchClockState();
  }, []);

  const fetchClockState = async () => {
    try {
      setLoading(true);
      const state = await attendanceService.getUserClockState();
      console.log('Fetched clock state:', state);
      setClockState(state);
      clockStateRef.current = state; // Update ref
    } catch (error) {
      console.error('Error fetching clock state:', error);
    } finally {
      setLoading(false);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, { dx }) => {
        if (dx >= 0 && dx <= maxTravel) {
          pan.x.setValue(dx);
        }
      },
      onPanResponderRelease: async (e, { dx }) => {
        console.log('Swipe distance:', dx, 'Max travel:', maxTravel, 'Threshold:', maxTravel * 0.85);
        // Trigger when user swipes at least 85% of the way
        if (dx >= maxTravel * 0.85) {
          const currentClockState = clockStateRef.current;
          console.log('Threshold met! Clock state from ref:', currentClockState);
          // User swiped close enough to the end
          try {
            setSliderLoading(true);
            console.log('Current clock state:', currentClockState?.state);
            if (currentClockState?.state == 0) {
              // Clock in
              console.log('Attempting to clock in...');
              const response = await attendanceService.clockIn();
              console.log('Clock in response:', response);
              Alert.alert('Success', 'Clocked in successfully!');
              await fetchClockState();
            } else {
              // Clock out
              console.log('Attempting to clock out...');
              if (currentClockState?.emp_ID) {
                const response = await attendanceService.clockOut(currentClockState.emp_ID.toString());
                console.log('Clock out response:', response);
                Alert.alert('Success', 'Clocked out successfully!');
                await fetchClockState();
              }
            }
            onSuccess?.();
          } catch (error: any) {
            console.error('Clock action error:', error);
            Alert.alert('Error', error.message || 'Failed to process clock action');
          } finally {
            setSliderLoading(false);
          }
          // Reset slider
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        } else {
          console.log('Threshold not met, resetting slider');
          // Not swiped far enough, reset
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }

  const isClockedIn = clockState?.state === 1;
  const backgroundColor = isClockedIn ? '#FF9500' : '#34C759';
  const label = isClockedIn ? 'Slide to Clock Out' : 'Slide to Clock In';

  // Helper function to format time to 12-hour format (treat as PH local time)
  const formatTime12Hour = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      // The backend already returns PH time; strip timezone to avoid shifting.
      const normalized = dateString.endsWith('Z')
        ? dateString.replace('Z', '')
        : dateString;
      const date = new Date(normalized);

      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>
          {isClockedIn ? 'Clocked In' : 'Clocked Out'}
        </Text>

        <View style={styles.timeRow}>
          <Text style={styles.timeText}>
            Clock In: {clockState?.time_in ? formatTime12Hour(clockState?.time_in || null) : '--:--:--'}
          </Text>
          <Text style={styles.timeText}>
            Clock Out: {clockState?.time_out ? formatTime12Hour(clockState?.time_out || null) : '--:--:--'}
          </Text>
        </View>

        <View style={styles.timeRow}>
          <Text style={styles.timeText}>
            Break In: {clockState?.break_in ? formatTime12Hour(clockState?.break_in || null) : '--:--:--'}
          </Text>
          <Text style={styles.timeText}>
            Break Out: {clockState?.break_out ? formatTime12Hour(clockState?.break_out || null) : '--:--:--'}
          </Text>
        </View>

        
      </View>

      <View
        style={[styles.sliderContainer, { backgroundColor }]}
        {...panResponder.panHandlers}
      >
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [{ translateX: pan.x }],
            },
          ]}
        >
          {sliderLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialIcons
              name="arrow-forward"
              size={28}
              color="#007AFF"
            />
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
  sliderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 80,
  },
});
