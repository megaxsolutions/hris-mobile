import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DashboardScreen } from '../screens/DashboardScreen';
import { AttendanceScreen } from '../screens/AttendanceScreen';
import { DTRScreen } from '../screens/DTRScreen';
import { PayslipScreen } from '../screens/PayslipScreen';
import { OvertimeRequestScreen } from '../screens/OvertimeRequestScreen';
import { LeaveRequestScreen } from '../screens/LeaveRequestScreen';
import { TimeAdjustmentRequestScreen } from '../screens/TimeAdjustmentRequestScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { VerifyCodeScreen } from '../screens/VerifyCodeScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { DrawerContent } from '../components/DrawerContent';
import { useAuth } from '../context/AuthContext';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  VerifyCode: { email: string };
  ChangePassword: { email: string; code: string };
  Drawer: undefined;
};


export type DrawerParamList = {
  Dashboard: undefined;
  Attendance: undefined;
  DTR: undefined;
  Payslip: undefined;
  OvertimeRequest: undefined;
  LeaveRequest: undefined;
  TimeAdjustmentRequest: undefined;
  Profile: undefined;
};

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTintColor: '#007AFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
      drawerContent={(props: any) => <DrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          drawerLabel: 'Dashboard',
        }}
      />
      <Drawer.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{
          title: 'Attendance',
          drawerLabel: 'Attendance',
        }}
      />
      <Drawer.Screen
        name="DTR"
        component={DTRScreen}
        options={{
          title: 'DTR',
          drawerLabel: 'DTR (Daily Time Record)',
        }}
      />
      <Drawer.Screen
        name="Payslip"
        component={PayslipScreen}
        options={{
          title: 'Payslip',
          drawerLabel: 'Payslip',
        }}
      />
      <Drawer.Screen
        name="OvertimeRequest"
        component={OvertimeRequestScreen}
        options={{
          title: 'Overtime Request',
          drawerLabel: 'Overtime Request',
        }}
      />
      <Drawer.Screen
        name="LeaveRequest"
        component={LeaveRequestScreen}
        options={{
          title: 'Leave Request',
          drawerLabel: 'Leave Request',
        }}
      />
      <Drawer.Screen
        name="TimeAdjustmentRequest"
        component={TimeAdjustmentRequestScreen}
        options={{
          title: 'Time Adjustment',
          drawerLabel: 'Time Adjustment Request',
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          drawerLabel: 'Profile',
        }}
      />
    </Drawer.Navigator>
  );
}

export function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="Drawer"
            component={DrawerNavigator}
          />
        </Stack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
