<template>
  <div class="container">
    <Header :cart-count="cartCount" title="Каталог товаров" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useProductsStore } from '@/stores/product';
import { Header } from '@/components/';

const productStore = useProductsStore();
const { cartCount } = storeToRefs(productStore);
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
