<template>
  <div v-if="showLoader" class="spinner"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const showLoader = ref(false);
let timeoutId: number;

onMounted(() => {
  timeoutId = setTimeout(() => {
    showLoader.value = true;
  }, 1000);
});

onUnmounted(() => {
  clearTimeout(timeoutId);
});
</script>

<style scoped>
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
