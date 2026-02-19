import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import dtrService, { DtrRecord } from '../services/dtrService';
import cutoffService, { Cutoff } from '../services/cutoffService';

export const DTRScreen: React.FC = () => {
  const [cutoffId, setCutoffId] = useState<string>('');
  const [cutoffs, setCutoffs] = useState<Cutoff[]>([]);
  const [records, setRecords] = useState<DtrRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCutoffs();
  }, []);

  useEffect(() => {
    if (cutoffId) {
      fetchDtr();
    }
  }, [cutoffId]);

  const fetchCutoffs = async () => {
    try {
      setLoading(true);
      const data = await cutoffService.getAllCutoffs();
      setCutoffs(data);
      if (data.length > 0) {
        setCutoffId(String(data[0].id));
      }
    } catch (error) {
      console.error('Error fetching cutoffs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDtr = async () => {
    try {
      setLoading(true);
      const data = await dtrService.getAllUserDtr(cutoffId);
      setRecords(data);
    } catch (error) {
      console.error('Error fetching DTR:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCutoffs();
    if (cutoffId) {
      await fetchDtr();
    }
    setRefreshing(false);
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '--:--:--';
    try {
      const normalized = dateString.endsWith('Z') ? dateString.replace('Z', '') : dateString;
      const date = new Date(normalized);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } catch (error) {
      return '--:--:--';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      return dateString;
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
      <Text style={styles.title}>DTR (Daily Time Record)</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Select Cutoff</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={cutoffId}
            onValueChange={(value) => setCutoffId(String(value))}
          >
            {cutoffs.map((cutoff) => (
              <Picker.Item
                key={cutoff.id}
                label={cutoff.cutoff_name || `Cutoff ${cutoff.id}`}
                value={String(cutoff.id)}
              />
            ))}
          </Picker>
        </View>
      </View>

      {records.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No DTR records found</Text>
        </View>
      ) : (
        records.map((record) => (
          <View key={record.id} style={styles.recordCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.dateText}>{formatDate(record.date)}</Text>
            </View>

            <View style={styles.timeRow}>
              <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>Clock In</Text>
                <Text style={styles.timeValue}>{formatTime(record.time_in)}</Text>
              </View>
              <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>Clock Out</Text>
                <Text style={styles.timeValue}>{formatTime(record.time_out)}</Text>
              </View>
            </View>

            <View style={styles.timeRow}>
              <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>Break In</Text>
                <Text style={styles.timeValue}>{formatTime(record.break_in)}</Text>
              </View>
              <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>Break Out</Text>
                <Text style={styles.timeValue}>{formatTime(record.break_out)}</Text>
              </View>
            </View>

            <View style={styles.timeRow}>
              <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>Coaching Start</Text>
                <Text style={styles.timeValue}>{formatTime(record.coaching_start)}</Text>
              </View>
              <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>Coaching End</Text>
                <Text style={styles.timeValue}>{formatTime(record.coaching_end)}</Text>
              </View>
            </View>
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
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  emptyContainer: {
    padding: 40,
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
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeItem: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
