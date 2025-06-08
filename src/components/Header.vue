<template>
  <header
    class="text-gray-800 p-4 shadow-md flex justify-between items-center sticky top-0 z-50"
  >
    <h1 class="text-xl font-semibold text-blue-600 md:text-2xl">
      {{ title }}
    </h1>
    <div class="flex items-center gap-3">
      <button
        id="cart-icon-button"
        class="flex items-center bg-transparent border border-blue-600 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
        aria-label="Открыть корзину"
        @click="$emit('open-cart')"
      >
        🛒 Корзина (<span id="cart-count">{{ cartCount }}</span>)
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  cartCount: number;
  title?: string;
}>();

defineEmits<{
  (e: 'open-cart'): void;
}>();
</script>
