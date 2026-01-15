import axios, { AxiosRequestHeaders } from 'axios';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get base URL from environment or use default
const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'repeat' });
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');

    if (token) {
      const headers = (config.headers ?? {}) as AxiosRequestHeaders;

      headers.Authorization = `Bearer ${token}`;
      config.headers = headers;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('accessToken');
      // You might want to navigate to login here
    }
    return Promise.reject(error);
  }
);

export default apiClient;
