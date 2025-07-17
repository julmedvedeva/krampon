export const API_PREFIX = '/api/v1';

export const base =
  (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000';

export const API_BASE_URL = `${base}${API_PREFIX}`;
