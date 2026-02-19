import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../navigation/RootNavigator';
import { useAuth } from '../context/AuthContext';

export const DrawerContent: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  const { user, signOut } = useAuth();

  const menuItems = [
    { label: 'Dashboard', route: 'Dashboard' as keyof DrawerParamList },
    { label: 'Attendance', route: 'Attendance' as keyof DrawerParamList },
    { label: 'DTR (Daily Time Record)', route: 'DTR' as keyof DrawerParamList },
    { label: 'Payslip', route: 'Payslip' as keyof DrawerParamList },
    { label: 'Overtime Request', route: 'OvertimeRequest' as keyof DrawerParamList },
    { label: 'Leave Request', route: 'LeaveRequest' as keyof DrawerParamList },
    { label: 'Time Adjustment', route: 'TimeAdjustmentRequest' as keyof DrawerParamList },
    { label: 'Profile', route: 'Profile' as keyof DrawerParamList },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
        {user?.position && <Text style={styles.userPosition}>{user?.position || ''}</Text>}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item: any) => (
          <TouchableOpacity
            key={item.route}
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate(item.route as any);
            }}
          >
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.menuItem, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={[styles.menuLabel, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  userPosition: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  menuContainer: {
    paddingVertical: 10,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    marginVertical: 10,
  },
  logoutText: {
    color: '#FF3B30',
  },
});
