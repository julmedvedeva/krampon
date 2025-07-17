import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useAuthStore } from '@/stores/auth';

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize authentication state
const authStore = useAuthStore();
authStore.loadToken();

// Optionally trigger login if no token is stored. You can remove this line if you prefer manual login.
if (!authStore.token) {
  authStore.login().catch(err => console.error(err));
}

app.mount('#app');
