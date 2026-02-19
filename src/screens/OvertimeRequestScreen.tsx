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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import overtimeService, { OvertimeRequest, OvertimeType } from '../services/overtimeService';

export const OvertimeRequestScreen: React.FC = () => {
  const [types, setTypes] = useState<OvertimeType[]>([]);
  const [requests, setRequests] = useState<OvertimeRequest[]>([]);
  const [overtimeTypeId, setOvertimeTypeId] = useState<string>('');
  const [date, setDate] = useState<Date | null>(null);
  const [startDatetime, setStartDatetime] = useState<Date | null>(null);
  const [endDatetime, setEndDatetime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
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
        overtimeService.getAllOvertimeTypes(),
        overtimeService.getAllUserOvertimeRequests(),
      ]);
      setTypes(typeData);
      setRequests(requestData);
      if (typeData.length > 0) {
        setOvertimeTypeId(String(typeData[0].id));
      }
    } catch (error) {
      console.error('Error loading overtime data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };
 const totalHours = useMemo(() => {
    if (!startDatetime || !endDatetime) return null;
    const diffMs = endDatetime.getTime() - startDatetime.getTime();
    if (diffMs <= 0) return null;
    const hours = diffMs / (1000 * 60 * 60);
    return hours.toFixed(2);
  }, [startDatetime, endDatetime]);

  const submitRequest = async () => {
    if (!overtimeTypeId || !date || !startDatetime || !endDatetime) {
      Alert.alert('Missing Fields', 'Please fill out all fields.');
      return;
    }

    try {
      setSubmitting(true);
      await overtimeService.addOvertimeRequest({
        ot_type:  Number(overtimeTypeId) ? Number(overtimeTypeId) : 0,
        hrs: totalHours ? Number(totalHours) : 0,
        date: formatDateForApi(date),
        startSpec: formatDateTimeForApi(startDatetime),
        endSpec: formatDateTimeForApi(endDatetime),
        status: 'Pending',
      });
      Alert.alert('Success', 'Overtime request submitted.');
      setDate(null);
      setStartDatetime(null);
      setEndDatetime(null);
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

  const formatTimeForDisplay = (value: Date | null) => {
    if (!value) return 'Select time';
    return value.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDateForApi = (value: Date) => {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const formatDateTimeForApi = (value: Date) => {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    const hh = String(value.getHours()).padStart(2, '0');
    const mm = String(value.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}`;
  };

  const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selected) {
      setDate(selected);
    }
  };

  const onStartChange = (event: DateTimePickerEvent, selected?: Date) => {
    setShowStartPicker(false);
    if (event.type === 'set' && selected) {
      const baseDate = date || new Date();
      const combined = new Date(baseDate);
      combined.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      setStartDatetime(combined);
    }
  };

  const onEndChange = (event: DateTimePickerEvent, selected?: Date) => {
    setShowEndPicker(false);
    if (event.type === 'set' && selected) {
      const baseDate = date || new Date();
      const combined = new Date(baseDate);
      combined.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      setEndDatetime(combined);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>Overtime Request</Text>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Request Form</Text>

        <Text style={styles.label}>Overtime Type</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={overtimeTypeId}
            onValueChange={(value) => setOvertimeTypeId(String(value))}
          >
            {types.map((type) => (
              <Picker.Item
                key={type.id}
                label={type.type}
                value={String(type.id)}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity style={styles.inputButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.inputButtonText}>{formatDateForDisplay(date)}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="calendar"
            onChange={onDateChange}
          />
        )}

        <Text style={styles.label}>Start Time</Text>
        <TouchableOpacity style={styles.inputButton} onPress={() => setShowStartPicker(true)}>
          <Text style={styles.inputButtonText}>{formatTimeForDisplay(startDatetime)}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startDatetime || new Date()}
            mode="time"
            display="spinner"
            onChange={onStartChange}
          />
        )}

        <Text style={styles.label}>End Time</Text>
        <TouchableOpacity style={styles.inputButton} onPress={() => setShowEndPicker(true)}>
          <Text style={styles.inputButtonText}>{formatTimeForDisplay(endDatetime)}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endDatetime || new Date()}
            mode="time"
            display="spinner"
            onChange={onEndChange}
          />
        )}

        <View style={styles.totalHoursRow}>
          <Text style={styles.totalHoursLabel}>Total Hours</Text>
          <Text style={styles.totalHoursValue}>{totalHours ? `${totalHours} hrs` : '--'}</Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.buttonDisabled]}
          onPress={submitRequest}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit Request</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>My Overtime Requests</Text>
      {requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No overtime requests found</Text>
        </View>
      ) : (
        requests.map((req) => (
          <View key={req.id} style={styles.recordCard}>
            <Text style={styles.recordTitle}>Request #{req.id}</Text>
            <Text style={styles.recordText}>Date: {req.date}</Text>
            <Text style={styles.recordText}>Start: {req.startSpec}</Text>
            <Text style={styles.recordText}>End: {req.endSpec}</Text>
            {req.status && <Text style={styles.statusText}>Status: {req.status}</Text>}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  inputButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  inputButtonText: {
    color: '#333',
    fontSize: 14,
  },
  totalHoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f7ff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e6ebff',
    marginBottom: 12,
  },
  totalHoursLabel: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  totalHoursValue: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 6,
  },
  recordText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginTop: 6,
  },
});
