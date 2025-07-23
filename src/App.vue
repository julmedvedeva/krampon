<template>
  <div class="container">
    <Header
      :cart-count="cartCount"
      title="Каталог товаров"
      :categories="categories || []"
      :activeCategory="activeCategory"
      @update:activeCategory="updateCategory"
    />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useProductsStore } from '@/stores/product';
import { useCategoryStore } from '@/stores/category';
import { Header } from '@/components/';
import { ref, provide } from 'vue';

const productStore = useProductsStore();
const { cartCount } = storeToRefs(productStore);

// Categories and active category state
const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);
const activeCategory = ref<number>(0);

// Fetch categories on mount
categoryStore.fetchCategories();

// Provide activeCategory so child views can inject
provide('activeCategory', activeCategory);

function updateCategory(val: number) {
  activeCategory.value = val;
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
