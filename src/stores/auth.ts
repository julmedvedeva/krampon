// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ofetch } from 'ofetch';
import { API_BASE_URL } from '@/config';

interface TelegramAuthResponse {
  access_token: string;
  expires_in: number;
  [key: string]: unknown; // allow any other fields coming from backend
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);
  const expiresIn = ref<number | null>(null);

  function setToken(newToken: string, expiration: number | null = null) {
    token.value = newToken;
    if (expiration !== null) {
      expiresIn.value = expiration;
      localStorage.setItem('token_expires_in', expiration.toString());
    }
    localStorage.setItem('auth_token', newToken);
  }

  function loadToken() {
    token.value = localStorage.getItem('auth_token');
    const exp = localStorage.getItem('token_expires_in');
    expiresIn.value = exp ? Number(exp) : null;
  }

  async function login() {
    try {
      // Try to obtain Telegram initData from localStorage or window.Telegram
      let initDataRaw: string | null = localStorage.getItem('init');

      if (!initDataRaw) {
        // Attempt to read from Telegram WebApp context
        initDataRaw =
          (window as any)?.Telegram?.WebApp?.initData ||
          new URLSearchParams(window.location.search).get('tgWebAppData');

        if (initDataRaw) {
          localStorage.setItem('init', initDataRaw);
        }
      }

      if (!initDataRaw) {
        throw new Error('Telegram init data not found');
      }

      const response = await ofetch<TelegramAuthResponse>(
        `${API_BASE_URL}/users/auth/telegram/`,
        {
          method: 'POST',
          headers: {
            Authorization: `tma ${initDataRaw}`,
          },
        }
      );

      if (response.access_token) {
        setToken(response.access_token, response.expires_in as number);
      }
    } catch (error) {
      console.error('Telegram auth failed:', error);
      throw error;
    }
  }

  function clearToken() {
    token.value = null;
    expiresIn.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token_expires_in');
  }

  return { token, expiresIn, setToken, loadToken, login, clearToken };
});
