import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  emp_ID: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  position?: string;
  department?: string;
  phone?: string;
  address?: string;
  date_hired?: string;
  birthdate?: string;
  gender?: string;
  civil_status?: string;
  emergency_contact?: string;
  emergency_contact_phone?: string;
  [key: string]: any;
}

export const ProfileScreen: React.FC = () => {
  const { signOut } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('user_data');
      if (userDataStr) {
        const data: UserData = JSON.parse(userDataStr);
        setUserData(data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Unable to load profile information</Text>
      </View>
    );
  }

  const profileFields = [
    { label: 'Employee ID', value: userData.emp_ID },
    { label: 'First Name', value: userData.first_name },
    { label: 'Last Name', value: userData.last_name },
    { label: 'Email', value: userData.email },
    { label: 'Position', value: userData.position },
    { label: 'Department', value: userData.department },
    { label: 'Phone', value: userData.phone },
    { label: 'Address', value: userData.address },
    { label: 'Date Hired', value: userData.date_hired },
    { label: 'Birthdate', value: userData.birthdate },
    { label: 'Gender', value: userData.gender },
    { label: 'Civil Status', value: userData.civil_status },
    { label: 'Emergency Contact', value: userData.emergency_contact },
    { label: 'Emergency Contact Phone', value: userData.emergency_contact_phone },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userData.first_name?.charAt(0) || 'U'}
              {userData.last_name?.charAt(0) || ''}
            </Text>
          </View>
        </View>
        <Text style={styles.nameText}>
          {userData.first_name} {userData.last_name}
        </Text>
        <Text style={styles.positionText}>{userData.position || 'Employee'}</Text>
      </View>

      {/* Profile Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        {profileFields.map((field, index) => (
          field.value && (
            <View key={index} style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <Text style={styles.fieldValue}>{field.value}</Text>
            </View>
          )
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  positionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  fieldContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    margin: 16,
    marginTop: 24,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
  },
});
