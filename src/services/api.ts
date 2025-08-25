import axios from 'axios';
import { User, AuthResponse } from '../types';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  googleLogin: async (code: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/google', { code });
    return response.data;
  },

  // Test endpoint
  testConnection: async () => {
    const response = await api.get('/api/auth');
    return response.data;
  },
};

// Utility functions for token management
export const tokenUtils = {
  setToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },

  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  removeToken: () => {
    localStorage.removeItem('authToken');
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: (): User | null => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  removeUser: () => {
    localStorage.removeItem('user');
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

// Mock data for development
export const mockData = {
  destinations: [
    {
      name: 'Kapadokya',
      image: { uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80' }
    },
    {
      name: 'Antalya',
      image: { uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' }
    },
    {
      name: 'İstanbul',
      image: { uri: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80' }
    },
    {
      name: 'Bodrum',
      image: { uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80' }
    }
  ],

  routes: [
    {
      id: 1,
      title: 'Ege Turu',
      desc: 'İzmir, Bodrum, Kuşadası rotasında deniz kenarında unutulmaz tatil',
      image: { uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
      visited: false,
      hotel: { name: 'Blue Hotel' },
      restaurant: { name: 'Lezzet Sofrası' }
    },
    {
      id: 2,
      title: 'Karadeniz Turu',
      desc: 'Trabzon, Rize, Artvin doğa harikası yaylaları ve yaşayan kültür',
      image: { uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80' },
      visited: true,
      hotel: { name: 'City Inn' },
      restaurant: { name: 'Fish & More' }
    }
  ],

  businesses: [
    {
      id: '1',
      name: 'Blue Villa Resort',
      type: 'villa',
      description: 'Deniz manzaralı lüks villa',
      address: 'Bodrum, Muğla',
      location: { latitude: 37.0344, longitude: 27.4305 },
      features: ['pool', 'wifi', 'breakfast_included', 'parking'],
      photos: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
      price: { nightly: 1500 },
      ownerId: '1',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    }
  ]
};

export default api;
