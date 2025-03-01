import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Define types for user data
interface Block {
  id: string;
  type: string;
  content: string;
}

interface UserData {
  userId: string;
  pageTitle: string;
  blocks: Block[];
  lastUpdated: Date;
}

interface UserDataContextType {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  fetchUserData: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<UserData>;
}

// Create the user data context
const UserDataContext = createContext<UserDataContextType | null>(null);

interface UserDataProviderProps {
  children: ReactNode;
}

// User data provider component
export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch user data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    } else {
      setUserData(null);
    }
  }, [isAuthenticated]);

  // Fetch user data from localStorage
  const fetchUserData = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
      } else {
        // Initialize with default data if nothing is stored
        const defaultData: UserData = {
          userId: user?.id || 'guest',
          pageTitle: 'My Schedule',
          blocks: [],
          lastUpdated: new Date()
        };
        setUserData(defaultData);
        localStorage.setItem('userData', JSON.stringify(defaultData));
      }
    } catch (err: any) {
      setError('Failed to fetch user data');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update user data in localStorage
  const updateUserData = async (data: Partial<UserData>): Promise<UserData> => {
    setLoading(true);
    setError(null);
    try {
      const updatedData = {
        ...userData,
        ...data,
        lastUpdated: new Date()
      } as UserData;
      
      setUserData(updatedData);
      localStorage.setItem('userData', JSON.stringify(updatedData));
      return updatedData;
    } catch (err: any) {
      setError('Failed to update user data');
      console.error('Error updating user data:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value: UserDataContextType = {
    userData,
    loading,
    error,
    fetchUserData,
    updateUserData
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};

// Custom hook to use the user data context
export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

export default UserDataContext; 