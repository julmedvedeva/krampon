<template>
  <div class="container">
    <Loader v-if="isLoading" />
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="content-wrapper">
      <ProductGrid :products="productsList" @add-to-cart="addToCart" />
      <Pagination
        v-if="pagination.totalPages > 1"
        v-model:current-page="currentPage"
        :pagination="pagination"
        @change-page="changePage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, inject, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductsStore } from '@/stores/product';
import { useCategoryStore } from '@/stores/category';
import Loader from '../components/Loader.vue';
import { ProductGrid, Pagination } from '../components';
import { useCartOperations } from '@/composables/useCartOperations.ts';

const activeCategory = inject<Ref<number>>('activeCategory')!;
const currentPage = ref(1);

const productStore = useProductsStore();
const categoryStore = useCategoryStore();
const { productsList, pagination, isLoading, error } =
  storeToRefs(productStore);

// Composable for cart operations
const { addToCart } = useCartOperations(productStore);

onMounted(() => {
  categoryStore.fetchCategories();
  fetchProducts();
});

watch(activeCategory, () => {
  currentPage.value = 1;
  fetchProducts();
});

function fetchProducts() {
  productStore.fetchProducts(
    activeCategory.value === 0 ? null : String(activeCategory.value),
    currentPage.value
  );
}

function changePage(page: number) {
  currentPage.value = page;
  fetchProducts();
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.content-wrapper {
  margin-top: 40px;
}

.error {
  color: red;
  margin-bottom: 10px;
}
</style>
