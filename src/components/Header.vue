<template>
  <header
    class="sticky top-0 z-50 flex items-center justify-between p-4 text-gray-800 shadow-md"
  >
    <h1 class="text-xl font-semibold text-blue-600 md:text-2xl">
      {{ title }}
    </h1>

    <router-link
      to="/cart"
      class="flex items-center rounded-lg border border-blue-600 bg-transparent px-3 py-2 text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
      >🛒 Корзина {{ cartCount }}</router-link
    >
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
