import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  preferences?: {
    theme: string;
    defaultView: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Check if user is logged in
  const checkUserLoggedIn = () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Error checking authentication:', err);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // For demo purposes, we'll simulate a successful login
      // In a real app, you would make an API call to your backend
      const mockUser: User = {
        id: '1',
        name: 'Demo User',
        email: email,
        createdAt: new Date().toISOString(),
        preferences: {
          theme: 'light',
          defaultView: 'weekly'
        }
      };
      
      const mockToken = 'mock-jwt-token';
      
      // Save user and token to localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', mockToken);
      
      setUser(mockUser);
      setIsAuthenticated(true);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // For demo purposes, we'll simulate a successful registration
      // In a real app, you would make an API call to your backend
      const mockUser: User = {
        id: '1',
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
        preferences: {
          theme: 'light',
          defaultView: 'weekly'
        }
      };
      
      const mockToken = 'mock-jwt-token';
      
      // Save user and token to localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', mockToken);
      
      setUser(mockUser);
      setIsAuthenticated(true);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Update user profile
  const updateProfile = async (userData: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      // For demo purposes, we'll simulate a successful profile update
      // In a real app, you would make an API call to your backend
      const updatedUser = { ...user, ...userData };
      
      // Save updated user to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
      console.error('Profile update error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 