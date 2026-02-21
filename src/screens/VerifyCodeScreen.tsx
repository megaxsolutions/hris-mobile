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

type Props = NativeStackScreenProps<any, 'VerifyCode'>;

export const VerifyCodeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email } = route.params as { email: string };
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    if (code.length !== 6 || !/^\d+$/.test(code)) {
      Alert.alert('Error', 'Verification code must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      await AuthService.verifyResetCode(email, code);
      Alert.alert('Success', 'Code verified successfully', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('ChangePassword', { email, code });
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Verification Failed',
        error.response?.data?.message || 'Invalid verification code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      await AuthService.requestPasswordReset(email);
      Alert.alert('Success', 'A new verification code has been sent to your email');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to resend code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForgotPassword = () => {
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify Code</Text>
        <Text style={styles.subtitle}>{"We\u2019ve sent a 6-digit code to"}</Text>
        <Text style={[styles.subtitle, styles.subtitleEmail]}>{email}</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Verification Code</Text>
          <TextInput
            style={styles.codeInput}
            placeholder="000000"
            placeholderTextColor="#999"
            value={code}
            onChangeText={(text) => {
              // Only allow numbers and limit to 6 digits
              const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
              setCode(numericText);
            }}
            editable={!loading}
            keyboardType="numeric"
            maxLength={6}
            textAlign="center"
          />

          <TouchableOpacity
            style={[styles.verifyButton, loading && styles.buttonDisabled]}
            onPress={handleVerifyCode}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify Code</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendCode}
            disabled={loading}
          >
            <Text style={styles.resendButtonText}>Resend Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToForgotPassword}
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
    marginBottom: 8,
    lineHeight: 24,
  },
  subtitleEmail: {
    marginBottom: 32,
  },
  email: {
    fontWeight: 'bold',
    color: '#333',
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
  codeInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    fontSize: 32,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center',
    letterSpacing: 8,
  },
  verifyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  resendButton: {
    backgroundColor: '#34C759',
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
  resendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
