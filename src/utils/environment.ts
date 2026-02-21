import { Platform } from 'react-native';

type AppEnvironment = 'local' | 'staging' | 'production';

const rawEnvironment = (process.env.EXPO_PUBLIC_APP_ENV || 'production').toLowerCase();

const normalizeEnvironment = (value: string): AppEnvironment => {
  if (value === 'local' || value === 'staging' || value === 'production') {
    return value;
  }
  return 'production';
};

export const APP_ENV: AppEnvironment = normalizeEnvironment(rawEnvironment);

const envApiUrlMap: Record<AppEnvironment, string | undefined> = {
  local: process.env.EXPO_PUBLIC_API_URL_LOCAL,
  staging: process.env.EXPO_PUBLIC_API_URL_STAGING,
  production: process.env.EXPO_PUBLIC_API_URL_PRODUCTION,
};

const toAndroidReachableLocalhost = (url: string): string => {
  if (Platform.OS !== 'android') {
    return url;
  }

  if (process.env.EXPO_PUBLIC_API_URL_LOCAL_ANDROID) {
    return process.env.EXPO_PUBLIC_API_URL_LOCAL_ANDROID;
  }

  return url
    .replace('://localhost', '://10.0.2.2')
    .replace('://127.0.0.1', '://10.0.2.2');
};

const resolveApiBaseUrl = (): string => {
  const base =
    envApiUrlMap[APP_ENV] ||
    process.env.EXPO_PUBLIC_API_URL ||
    'http://localhost:8000';

  if (APP_ENV === 'local') {
    return toAndroidReachableLocalhost(base);
  }

  return base;
};

export const API_BASE_URL = resolveApiBaseUrl();

export const API_SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, '');
