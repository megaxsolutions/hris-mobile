import React, { useEffect, useMemo, useState } from 'react';
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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import leaveRequestService, { LeaveRequest, LeaveType } from '../services/leaveRequestService';

const getStatusColor = (status: string): string => {
  if (status === 'Approved') return '#28a745';
  if (status === 'Rejected') return '#dc3545';
  return '#ffc107'; // Pending
};

export const LeaveRequestScreen: React.FC = () => {
  const [types, setTypes] = useState<LeaveType[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [leaveTypeId, setLeaveTypeId] = useState<string>('');
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>('');
  const [date, setDate] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);
  const [details, setDetails] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDateEndPicker, setShowDateEndPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [typeData, requestData] = await Promise.all([
        leaveRequestService.getAllLeaveTypes(),
        leaveRequestService.getAllUserLeaveRequests(),
      ]);
      setTypes(typeData);
      setRequests(requestData);
      if (typeData.length > 0) {
        setLeaveTypeId(String(typeData[0].id));
        setSelectedLeaveType(typeData[0].type);
      }
    } catch (error) {
      console.error('Error loading leave data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const requiresFile = (leaveType: string) => {
    return leaveType === 'SL' || leaveType === 'Medical Leave';
  };

  const handleLeaveTypeChange = (itemValue: string, itemIndex: number) => {
    setLeaveTypeId(itemValue);
    const selectedType = types.find((t) => String(t.id) === itemValue);
    if (selectedType) {
      setSelectedLeaveType(selectedType.type);
    }
  };

  const submitRequest = async () => {
    if (!leaveTypeId || !date || !dateEnd || !details) {
      Alert.alert('Missing Fields', 'Please fill out all required fields.');
      return;
    }

    if (requiresFile(selectedLeaveType)) {
      Alert.alert('File Required', `${selectedLeaveType} requires file attachment.`);
      return;
    }

    try {
      setSubmitting(true);
      await leaveRequestService.addLeaveRequest({
        leave_type_id: Number(leaveTypeId),
        leave_type: selectedLeaveType,
        details,
        date: formatDateForApi(date),
        date_end: formatDateForApi(dateEnd),
      });
      Alert.alert('Success', 'Leave request submitted.');
      setDate(null);
      setDateEnd(null);
      setDetails('');
      await fetchData();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateForDisplay = (value: Date | null) => {
    if (!value) return 'Select date';
    return value.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateForApi = (value: Date) => {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selected) {
      setDate(selected);
    }
  };

  const onDateEndChange = (event: DateTimePickerEvent, selected?: Date) => {
    setShowDateEndPicker(false);
    if (event.type === 'set' && selected) {
      setDateEnd(selected);
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
      {/* Leave Type Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Leave Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={leaveTypeId}
            onValueChange={handleLeaveTypeChange}
            style={styles.picker}
          >
            {types.map((type) => (
              <Picker.Item key={type.id} label={type.type} value={String(type.id)} />
            ))}
          </Picker>
        </View>
        {requiresFile(selectedLeaveType) && (
          <Text style={styles.helperText}>This leave type requires file attachment.</Text>
        )}
      </View>

      {/* Details */}
      <View style={styles.section}>
        <Text style={styles.label}>Details</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter leave details..."
          value={details}
          onChangeText={setDetails}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Start Date */}
      <View style={styles.section}>
        <Text style={styles.label}>Start Date</Text>
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
            onChange={onDateChange}
          />
        )}
      </View>

      {/* End Date */}
      <View style={styles.section}>
        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowDateEndPicker(true)}
        >
          <Text style={styles.buttonText}>{formatDateForDisplay(dateEnd)}</Text>
        </TouchableOpacity>
        {showDateEndPicker && (
          <DateTimePicker
            value={dateEnd || new Date()}
            mode="date"
            display="calendar"
            onChange={onDateEndChange}
          />
        )}
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
        <Text style={styles.sectionTitle}>Your Leave Requests</Text>
        {requests.length === 0 ? (
          <Text style={styles.emptyText}>No leave requests yet</Text>
        ) : (
          requests.map((request) => {
            const statusColor = getStatusColor(request.status);
            return (
              <View key={request.id} style={styles.card}>
                <Text style={styles.cardTitle}>{request.leave_type}</Text>
                <Text style={styles.cardText}>
                  Date: {request.date} to {request.date_end}
                </Text>
                <Text style={styles.cardText}>Details: {request.details}</Text>
                <Text style={[styles.cardText, { color: statusColor, fontWeight: '600' }]}>
                  Status: {request.status}
                </Text>
              </View>
            );
          })
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
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
