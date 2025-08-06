<template>
  <div class="container">
    <Header
      :cart-count="cartCount"
      title="Каталог товаров"
      :categories="categories"
      :active-category="activeCategory"
      @update:active-category="updateCategory"
    />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue';
import Header from '@/components/Header.vue';
import { useCatalogSetup } from '@/composables/useCatalogSetup';

const { cartCount, categories, activeCategory, updateCategory } =
  useCatalogSetup();
provide('activeCategory', activeCategory);
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
