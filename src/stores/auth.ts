// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);

  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem('auth_token', newToken);
  }

  function loadToken() {
    token.value = localStorage.getItem('auth_token');
  }

  function clearToken() {
    token.value = null;
    localStorage.removeItem('auth_token');
  }

  return { token, setToken, loadToken, clearToken };
});
