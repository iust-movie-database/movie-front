import { AuthResponse } from '../services/api';

export interface StoredUser {
  user_id: number;
  username: string;
  email: string;
}

export const saveUser = (userData: StoredUser): void => {
  localStorage.setItem('user', JSON.stringify(userData));
};

export const getUser = (): StoredUser | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const removeUser = (): void => {
  localStorage.removeItem('user');
};