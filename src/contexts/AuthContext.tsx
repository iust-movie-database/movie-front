import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  login as apiLogin, 
  signup as apiSignup, 
  logout as apiLogout,
  getCurrentUser,
  saveUserData,
  LoginCredentials, 
  SignupCredentials,
  AuthResponse
} from '../services/api';
import { getToken, removeToken } from '../utils/jwt.utils';

// Types for the Auth Context
interface AuthContextType {
  user: {
    user_id: number;
    username: string;
    email: string;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in when app loads
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = getToken();
    
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // Try to get user data from localStorage
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      // If no user data or invalid, clear everything
      console.error('Auth check failed:', error);
      removeToken();
      localStorage.removeItem('user_data');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await apiLogin(credentials);
      saveUserData(response);
      
      // Set user state (without access_token)
      setUser({
        user_id: response.user_id,
        username: response.username,
        email: response.email,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    setIsLoading(true);
    try {
      const response = await apiSignup(credentials);
      saveUserData(response);
      
      // Set user state (without access_token)
      setUser({
        user_id: response.user_id,
        username: response.username,
        email: response.email,
      });
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};