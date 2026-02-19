import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TextInput,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import timeAdjustmentService, {
  AdjustmentReason,
  TimeAdjustmentRequest,
  AttendanceRecord,
} from '../services/timeAdjustmentService';

export const TimeAdjustmentRequestScreen: React.FC = () => {
  const [reasons, setReasons] = useState<AdjustmentReason[]>([]);
  const [requests, setRequests] = useState<TimeAdjustmentRequest[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [timeIn, setTimeIn] = useState<Date | null>(null);
  const [timeOut, setTimeOut] = useState<Date | null>(null);
  const [reasonId, setReasonId] = useState<string>('');
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [isOvernight, setIsOvernight] = useState(false);
  const [details, setDetails] = useState('');
  const [attendanceRecord, setAttendanceRecord] = useState<AttendanceRecord | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimeInPicker, setShowTimeInPicker] = useState(false);
  const [showTimeOutPicker, setShowTimeOutPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reasonData, requestData] = await Promise.all([
        timeAdjustmentService.getAdjustmentReasons(),
        timeAdjustmentService.getAllUserAdjustmentRequests(),
      ]);
      setReasons(reasonData);
      setRequests(requestData);
      if (reasonData.length > 0) {
        setReasonId(String(reasonData[0].id));
        setSelectedReason(reasonData[0].reason);
      }
    } catch (error) {
      console.error('Error loading adjustment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleDateChange = async (event: DateTimePickerEvent, selected?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selected) {
      setDate(selected);
      // Fetch attendance record for selected date
      try {
        const dateStr = formatDateForApi(selected);
        const record = await timeAdjustmentService.getAttendanceByDate(dateStr);
        setAttendanceRecord(record);
        if (record) {
          // Pre-fill times from attendance record
          if (record.time_in) {
            setTimeIn(new Date(`${record.date}T${record.time_in}`));
          }
          if (record.time_out) {
            setTimeOut(new Date(`${record.date}T${record.time_out}`));
          }
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    }
  };

  const handleReasonChange = (itemValue: string) => {
    setReasonId(itemValue);
    const selectedReason = reasons.find((r) => String(r.id) === itemValue);
    if (selectedReason) {
      setSelectedReason(selectedReason.reason);
    }
  };

  const requiresFile = (reason: string) => {
    return reason === 'Field Work';
  };

  const submitRequest = async () => {
    if (!date || !timeIn || !timeOut || !reasonId) {
      Alert.alert('Missing Fields', 'Please fill out all required fields.');
      return;
    }

    if (requiresFile(selectedReason)) {
      Alert.alert('File Required', 'Field Work requires file attachment.');
      return;
    }

    try {
      setSubmitting(true);
      await timeAdjustmentService.addTimeAdjustmentRequest({
        date: formatDateForApi(date),
        time_in: formatTimeForApi(timeIn),
        time_out: formatTimeForApi(timeOut),
        reason_id: Number(reasonId),
        reason: selectedReason,
        is_overnight: isOvernight,
        details,
      });
      Alert.alert('Success', 'Time adjustment request submitted.');
      setDate(null);
      setTimeIn(null);
      setTimeOut(null);
      setDetails('');
      setIsOvernight(false);
      setAttendanceRecord(null);
      await fetchData();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateForApi = (value: Date) => {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const formatTimeForApi = (value: Date) => {
    const hh = String(value.getHours()).padStart(2, '0');
    const mm = String(value.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const formatDateForDisplay = (value: Date | null) => {
    if (!value) return 'Select date';
    return value.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTimeForDisplay = (value: Date | null) => {
    if (!value) return 'Select time';
    return value.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const onTimeInChange = (event: DateTimePickerEvent, selected?: Date) => {
    setShowTimeInPicker(false);
    if (event.type === 'set' && selected) {
      const baseDate = date || new Date();
      const combined = new Date(baseDate);
      combined.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      setTimeIn(combined);
    }
  };

  const onTimeOutChange = (event: DateTimePickerEvent, selected?: Date) => {
    setShowTimeOutPicker(false);
    if (event.type === 'set' && selected) {
      const baseDate = date || new Date();
      const combined = new Date(baseDate);
      combined.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      setTimeOut(combined);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Date Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.buttonText}>{formatDateForDisplay(date)}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="calendar"
            onChange={handleDateChange}
          />
        )}
      </View>

      {/* Attendance Record Display */}
      {attendanceRecord && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendance Record</Text>
          <View style={styles.recordCard}>
            <Text style={styles.recordText}>
              Time In: {attendanceRecord.time_in || 'Not recorded'}
            </Text>
            <Text style={styles.recordText}>
              Time Out: {attendanceRecord.time_out || 'Not recorded'}
            </Text>
            {attendanceRecord.break_in && (
              <Text style={styles.recordText}>Break In: {attendanceRecord.break_in}</Text>
            )}
            {attendanceRecord.break_out && (
              <Text style={styles.recordText}>Break Out: {attendanceRecord.break_out}</Text>
            )}
          </View>
        </View>
      )}

      {/* Time In */}
      <View style={styles.section}>
        <Text style={styles.label}>Time In</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowTimeInPicker(true)}
        >
          <Text style={styles.buttonText}>{formatTimeForDisplay(timeIn)}</Text>
        </TouchableOpacity>
        {showTimeInPicker && (
          <DateTimePicker
            value={timeIn || new Date()}
            mode="time"
            display="spinner"
            onChange={onTimeInChange}
          />
        )}
      </View>

      {/* Time Out */}
      <View style={styles.section}>
        <Text style={styles.label}>Time Out</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowTimeOutPicker(true)}
        >
          <Text style={styles.buttonText}>{formatTimeForDisplay(timeOut)}</Text>
        </TouchableOpacity>
        {showTimeOutPicker && (
          <DateTimePicker
            value={timeOut || new Date()}
            mode="time"
            display="spinner"
            onChange={onTimeOutChange}
          />
        )}
      </View>

      {/* Reason Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Reason</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={reasonId}
            onValueChange={handleReasonChange}
            style={styles.picker}
          >
            {reasons.map((reason) => (
              <Picker.Item key={reason.id} label={reason.reason} value={String(reason.id)} />
            ))}
          </Picker>
        </View>
        {requiresFile(selectedReason) && (
          <Text style={styles.helperText}>This reason requires file attachment.</Text>
        )}
      </View>

      {/* Is Overnight Toggle */}
      <View style={styles.section}>
        <View style={styles.toggleContainer}>
          <Text style={styles.label}>Is Overnight</Text>
          <Switch
            value={isOvernight}
            onValueChange={setIsOvernight}
            trackColor={{ false: '#767577', true: '#81c784' }}
            thumbColor={isOvernight ? '#4caf50' : '#f1f1f1'}
          />
        </View>
      </View>

      {/* Details */}
      <View style={styles.section}>
        <Text style={styles.label}>Details</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter additional details..."
          value={details}
          onChangeText={setDetails}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={submitRequest}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Request</Text>
        )}
      </TouchableOpacity>

      {/* Requests List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Time Adjustment Requests</Text>
        {requests.length === 0 ? (
          <Text style={styles.emptyText}>No adjustment requests yet</Text>
        ) : (
          requests.map((request) => (
            <View key={request.id} style={styles.card}>
              <Text style={styles.cardTitle}>{request.reason}</Text>
              <Text style={styles.cardText}>Date: {request.date}</Text>
              <Text style={styles.cardText}>
                Time: {request.time_in} - {request.time_out}
              </Text>
              {request.details && <Text style={styles.cardText}>Details: {request.details}</Text>}
              {request.is_overnight && <Text style={styles.cardText}>Overnight: Yes</Text>}
              <Text style={[styles.cardText, styles.statusText(request.status)]}>
                Status: {request.status}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  button: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  helperText: {
    fontSize: 12,
    color: '#ff6b6b',
    marginTop: 8,
    fontStyle: 'italic',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
  },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  recordText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statusText: (status: string) => ({
    color: status === 'Approved' ? '#28a745' : status === 'Rejected' ? '#dc3545' : '#ffc107',
    fontWeight: '600',
  }),
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
