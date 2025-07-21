import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ofetch } from 'ofetch';
import { API_BASE_URL } from '@/config';

interface TelegramAuthResponse {
  access_token: string;
  expires_in: number;
  issued_at?: number;
  [key: string]: unknown;
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);
  const expiresIn = ref<number | null>(null);
  const issuedAt = ref<number | null>(null);

  function setToken(
    newToken: string,
    expiration: number | null = null,
    issued: number | null = null
  ) {
    token.value = newToken;
    if (expiration !== null) {
      expiresIn.value = expiration;
      sessionStorage.setItem('token_expires_in', expiration.toString());
    }
    if (issued !== null) {
      issuedAt.value = issued;
      sessionStorage.setItem('token_issued_at', issued.toString());
    }
    sessionStorage.setItem('auth_token', newToken);
  }

  function loadToken() {
    token.value = sessionStorage.getItem('auth_token');
    const exp = sessionStorage.getItem('token_expires_in');
    expiresIn.value = exp ? Number(exp) : null;
    const issued = sessionStorage.getItem('token_issued_at');
    issuedAt.value = issued ? Number(issued) : null;
  }

  function isTokenValid(): boolean {
    if (!token.value || !expiresIn.value || !issuedAt.value) return false;
    return Date.now() < issuedAt.value + expiresIn.value;
  }

  async function login() {
    try {
      let initDataRaw: string | null = null;

      const initParams = sessionStorage.getItem('__telegram__initParams');
      if (initParams) {
        try {
          const parsed = JSON.parse(initParams);
          initDataRaw = (parsed.tgWebAppData as string | undefined) || null;
        } catch {
          // ignore JSON parse errors
        }
      }

      if (!initDataRaw) {
        initDataRaw =
          (window as { Telegram?: { WebApp?: { initData?: string } } }).Telegram
            ?.WebApp?.initData ||
          new URLSearchParams(window.location.search).get('tgWebAppData');
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
        // if issued_at absent, use current time
        const issued = (response.issued_at as number) || Date.now();
        setToken(response.access_token, response.expires_in as number, issued);
      }
    } catch (error) {
      console.error('Telegram auth failed:', error);
      throw error;
    }
  }

  function clearToken() {
    token.value = null;
    expiresIn.value = null;
    issuedAt.value = null;
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('token_expires_in');
    sessionStorage.removeItem('token_issued_at');
  }

  return {
    token,
    expiresIn,
    issuedAt,
    setToken,
    loadToken,
    login,
    clearToken,
    isTokenValid,
  };
});
