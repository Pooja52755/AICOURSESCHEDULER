import axios, { AxiosInstance } from 'axios';

// Define types
interface PremiumFeatures {
  aiSuggestions: boolean;
  advancedAnalytics: boolean;
  unlimitedTasks: boolean;
  customThemes: boolean;
}

interface Block {
  id: string;
  type: string;
  content: string;
}

interface UserData {
  userId: string;
  pageTitle: string;
  blocks: Block[];
  isPremium: boolean;
  premiumFeatures: PremiumFeatures;
  lastUpdated: Date;
}

interface PremiumData {
  isPremium?: boolean;
  premiumFeatures?: Partial<PremiumFeatures>;
}

const API_URL = 'http://localhost:5000/api/userdata';

// Create axios instance with base URL
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const userDataService = {
  // Get user data
  getUserData: async (): Promise<UserData> => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  },

  // Update user data
  updateUserData: async (userData: Partial<UserData>): Promise<UserData> => {
    try {
      const response = await api.put('/', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  },

  // Update premium status
  updatePremiumStatus: async (premiumData: PremiumData): Promise<UserData> => {
    try {
      const response = await api.put('/premium', premiumData);
      return response.data;
    } catch (error) {
      console.error('Error updating premium status:', error);
      throw error;
    }
  },

  // Check if user has premium access
  hasPremiumAccess: async (): Promise<boolean> => {
    try {
      const userData = await userDataService.getUserData();
      return userData.isPremium;
    } catch (error) {
      console.error('Error checking premium access:', error);
      return false;
    }
  },

  // Check if user has specific premium feature
  hasPremiumFeature: async (featureName: keyof PremiumFeatures): Promise<boolean> => {
    try {
      const userData = await userDataService.getUserData();
      return !!(userData.isPremium && userData.premiumFeatures && userData.premiumFeatures[featureName]);
    } catch (error) {
      console.error(`Error checking premium feature ${featureName}:`, error);
      return false;
    }
  }
}; 