<template>
  <header class="sticky top-0 z-50 bg-white p-4 pb-1 text-gray-800">
    <div class="flex flex-col bg-white p-4 shadow-md">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold text-blue-600 md:text-2xl">
          <a href="/">
            {{ title }}
          </a>
        </h1>

        <router-link
          to="/cart"
          class="flex items-center rounded-lg border border-blue-600 bg-transparent px-3 py-2 text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
          >🛒 Корзина {{ cartCount }}</router-link
        >
      </div>
    </div>

    <CategoryFilters
      class="mt-3"
      :categories="categories"
      :activeCategory="activeCategory"
      @update:activeCategory="$emit('update:activeCategory', $event)"
    />
  </header>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import CategoryFilters from './CategoryFilters.vue';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

defineProps<{
  cartCount: number;
  title?: string;
  categories: Category[];
  activeCategory: number;
}>();

defineEmits<{
  (e: 'open-cart'): void;
  (e: 'update:activeCategory', category: number): void;
}>();
</script>
