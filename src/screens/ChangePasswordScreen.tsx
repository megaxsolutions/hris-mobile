import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthService } from '../services/authService';

type Props = NativeStackScreenProps<any, 'ChangePassword'>;

export const ChangePasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email, code } = route.params as { email: string; code: string };
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (!confirmPassword.trim()) {
      Alert.alert('Error', 'Please confirm your password');
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      Alert.alert('Weak Password', passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await AuthService.resetPassword(email, code, newPassword);
      Alert.alert('Success', 'Your password has been changed successfully', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to login
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Password Change Failed',
        error.response?.data?.message ||
          'Failed to change password. Please try again or request a new code.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToVerify = () => {
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>
          Enter a strong password to secure your account
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="#999"
              value={newPassword}
              onChangeText={setNewPassword}
              editable={!loading}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loading}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />

          <View style={styles.showPasswordContainer}>
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <Text style={styles.showPasswordText}>
                {showPassword ? 'Hide' : 'Show'} Password
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <Text style={styles.requirement}>
              • At least 8 characters long
            </Text>
            <Text style={styles.requirement}>
              • At least one uppercase letter
            </Text>
            <Text style={styles.requirement}>
              • At least one number
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Change Password</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToVerify}
            disabled={loading}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  passwordContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  showPasswordContainer: {
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  showPasswordText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  passwordRequirements: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  requirement: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
