// Simple storage and retrieval - no decoding
export const setToken = (token: string): void => {
  localStorage.setItem('access_token', token);
};

// Get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// Remove token from localStorage
export const removeToken = (): void => {
  localStorage.removeItem('access_token');
};

// Just check if token exists (backend will validate actual validity)
export const hasToken = (): boolean => {
  return getToken() !== null;
};