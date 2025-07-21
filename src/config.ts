export const API_PREFIX = '/api/v1';

// В режиме разработки используем указанный URL (или localhost),
// на прод-сборке оставляем пустую строку, чтобы запросы шли относительно домена сервера.
export const base = import.meta.env.DEV
  ? (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000'
  : '';

export const API_BASE_URL = `${base}${API_PREFIX}`;
