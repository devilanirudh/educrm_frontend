import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { QueryParams } from '../types/api';

// Dynamic base URL based on environment
const getBaseURL = (): string => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const baseURL = isDevelopment 
    ? 'http://localhost:8000/api/v1'
    : 'https://educrmbackend-production.up.railway.app/api/v1';
  
  console.log(`🌐 API Base URL: ${baseURL} (${isDevelopment ? 'Development' : 'Production'})`);
  return baseURL;
};

const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

// Function to get token from localStorage (where Redux persists auth data)
const getAuthToken = (): string | null => {
  try {
    // Check for Redux persisted auth data
    const authData = localStorage.getItem('persist:auth');
    if (authData) {
      const parsedAuth = JSON.parse(authData);
      const token = parsedAuth.token ? JSON.parse(parsedAuth.token) : null;
      if (token) return token;
    }

    // Fallback to direct localStorage token
    return localStorage.getItem('accessToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return localStorage.getItem('accessToken');
  }
};

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem('persist:auth');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // Optionally redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export const buildUrl = (baseUrl: string, params?: QueryParams) => {
  const url = new URL(baseUrl, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.pathname + url.search;
};

// Get the base URL for file uploads (without /api/v1)
export const getUploadBaseURL = (): string => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment 
    ? 'http://localhost:8000'
    : 'https://educrmbackend-production.up.railway.app';
};

export const upload = (url: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default api;
