import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import cutoffService, { Cutoff } from '../services/cutoffService';
import payslipService, { PayslipRecord } from '../services/payslipService';

export const PayslipScreen: React.FC = () => {
  const [cutoffId, setCutoffId] = useState<string>('');
  const [cutoffs, setCutoffs] = useState<Cutoff[]>([]);
  const [payslips, setPayslips] = useState<PayslipRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCutoffs();
  }, []);

  useEffect(() => {
    if (cutoffId) {
      fetchPayslips();
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

  const fetchPayslips = async () => {
    try {
      setLoading(true);
      const data = await payslipService.getAllUserPayslip(cutoffId);
      setPayslips(data);
    } catch (error) {
      console.error('Error fetching payslips:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCutoffs();
    if (cutoffId) {
      await fetchPayslips();
    }
    setRefreshing(false);
  };

  const formatMoney = (value?: number) => {
    if (value === null || value === undefined) return '₱0.00';
    return `₱${value.toFixed(2)}`;
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
      <Text style={styles.title}>Payslip</Text>

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

      {payslips.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No payslips found</Text>
        </View>
      ) : (
        payslips.map((payslip) => (
          <View key={payslip.id} style={styles.recordCard}>
            <Text style={styles.cardTitle}>Payslip #{payslip.id}</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Gross Pay</Text>
              <Text style={styles.value}>{formatMoney(payslip.gross_pay)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Total Deductions</Text>
              <Text style={styles.value}>{formatMoney(payslip.total_deductions)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Net Pay</Text>
              <Text style={styles.value}>{formatMoney(payslip.net_pay)}</Text>
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
