import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router';

interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  unreadNotifications: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const savedAuth = localStorage.getItem('didar_auth');
    const savedUser = localStorage.getItem('didar_user');

    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
      setUnreadNotifications(3);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const mockUser: User = {
      id: '1',
      name: 'علی احمدی',
      firstName: 'علی',
      lastName: 'احمدی',
      username: 'ali_ahmadi',
      email: email,
    };

    setIsAuthenticated(true);
    setUser(mockUser);
    setUnreadNotifications(3);

    localStorage.setItem('didar_auth', 'true');
    localStorage.setItem('didar_user', JSON.stringify(mockUser));
  };

  const signup = async (name: string, email: string, password: string) => {
    const names = name.trim().split(' ');
    const firstName = names[0] || 'کاربر';
    const lastName = names.slice(1).join(' ') || 'دیدار';
    const username = email.split('@')[0] || 'user';

    const mockUser: User = {
      id: '1',
      name: name,
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
    };

    setIsAuthenticated(true);
    setUser(mockUser);
    setUnreadNotifications(0);

    localStorage.setItem('didar_auth', 'true');
    localStorage.setItem('didar_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUnreadNotifications(0);

    localStorage.removeItem('didar_auth');
    localStorage.removeItem('didar_user');
    localStorage.removeItem('didar_watchlist');
    localStorage.removeItem('didar_favorites');
    localStorage.removeItem('didar_ratings');
    localStorage.removeItem('didar_profile');
    localStorage.removeItem('didar_notifications');
    localStorage.removeItem('didar_session');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signup,
        logout,
        unreadNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
