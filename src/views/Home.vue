<template>
  <div class="container">
    <div v-if="isLoading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="mt-10">
      <CategoryFilters
        v-model:activeCategory="activeCategory"
        :categories="categories || []"
      />
      <div id="product-view">
        <div v-if="productsList.length === 0">
          Нет товаров в данной категори
        </div>
        <div
          v-if="productsList.length > 0"
          class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
        >
          <div
            v-for="product in productsList"
            :key="product.id"
            class="product-card flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <img
              :src="
                product.image
                  ? `${base}/media/${product.image}`
                  : PLACEHOLDER_IMG
              "
              alt="Product"
              class="mb-3 h-32 w-full rounded-lg bg-gray-100 object-cover"
              @error="onImgError"
            />
            <h2 class="mb-1 text-base font-semibold text-gray-900">
              {{ product.name }}
            </h2>
            <p class="mb-3 line-clamp-3 flex-grow text-sm text-gray-600">
              {{ product.description }}
            </p>
            <p class="mb-3 text-base font-bold text-blue-600">
              {{ product.price }} руб.
            </p>
            <div class="mt-auto">
              <button
                v-if="!isProductInCart(product.id)"
                class="add-to-cart-btn w-full rounded-lg bg-green-600 py-2 text-white transition-colors hover:bg-green-700"
                @click="addToCart(product)"
              >
                Добавить в корзину
              </button>
              <div
                v-else
                class="quantity-controls flex items-center justify-between"
              >
                <button
                  class="quantity-btn h-9 w-9 rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700"
                  @click="decreaseQuantity(product)"
                >
                  -
                </button>
                <span
                  class="quantity-display text-base font-bold text-gray-800"
                  >{{ getCartItemQuantity(product.id) }}</span
                >
                <button
                  class="quantity-btn h-9 w-9 rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700"
                  @click="increaseQuantity(product)"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="mt-8 flex justify-center">
          <div class="flex items-center space-x-2">
            <button
              v-if="pagination.previousPage !== null"
              @click="changePage(pagination.previousPage)"
              class="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Предыдущая
            </button>
            <span class="px-4 py-2 text-sm text-gray-700">
              Страница {{ pagination.currentPage }} из
              {{ pagination.totalPages }}
            </span>
            <button
              v-if="pagination.nextPage !== null"
              @click="changePage(pagination.nextPage)"
              class="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Следующая
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, inject } from 'vue';
import { storeToRefs } from 'pinia';
import { type Product, useProductsStore } from '@/stores/product';
import { useCategoryStore } from '@/stores/category.ts';
import { base, PLACEHOLDER_IMG } from '@/config';
import type { Ref } from 'vue';
const activeCategory = inject<Ref<number>>('activeCategory')!;
const currentPage = ref<number>(1);

const productStore = useProductsStore();
const categoryStore = useCategoryStore();
const { productsList, pagination, cartCount, isLoading, error } =
  storeToRefs(productStore);
const { categories } = storeToRefs(categoryStore);

// Cart helper functions
const isProductInCart = (productId: number) =>
  productStore.isProductInCart(productId);
const getCartItemQuantity = (productId: number) =>
  productStore.getCartItemQuantity(productId);
const addToCart = (product: Product) => productStore.addToCart(product);
const increaseQuantity = (product: Product) =>
  productStore.increaseQuantity(product);
const decreaseQuantity = (product: Product) =>
  productStore.decreaseQuantity(product);

// fallback image handler
function onImgError(event: Event) {
  (event.target as HTMLImageElement).src = PLACEHOLDER_IMG;
}

onMounted(() => {
  categoryStore.fetchCategories();
  productStore.fetchProducts(
    activeCategory.value === 0 ? null : String(activeCategory.value),
    currentPage.value
  );
});

watch(activeCategory, (newCategory: number) => {
  currentPage.value = 1;
  productStore.fetchProducts(
    newCategory === 0 ? null : String(newCategory),
    currentPage.value
  );
});

function changePage(page: number) {
  currentPage.value = page;
  productStore.fetchProducts(
    activeCategory.value === 0 ? null : String(activeCategory.value),
    page
  );
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.error {
  color: red;
  margin-bottom: 10px;
}
</style>
