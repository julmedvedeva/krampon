<template>
  <div id="product-view">
    <div v-if="products.length === 0" class="no-products">
      Нет товаров в данной категории
    </div>
    <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        :is-in-cart="isProductInCart(product.id)"
        :quantity="getCartItemQuantity(product.id)"
        @add-to-cart="addToCart"
        @increase-quantity="increaseQuantity"
        @decrease-quantity="decreaseQuantity"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Product, useProductsStore } from '@/stores/product';
import ProductCard from './ProductCard.vue';
import { useCartOperations } from '@/composables/useCartOperations';

defineProps<{
  products: Product[];
}>();

defineEmits<{
  (e: 'add-to-cart', product: Product): void;
}>();

const productStore = useProductsStore();
const {
  isProductInCart,
  getCartItemQuantity,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} = useCartOperations(productStore);
</script>
