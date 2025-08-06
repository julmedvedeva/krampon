<template>
  <div
    class="product-card flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
  >
    <img
      :src="product.image ? `${base}/media/${product.image}` : PLACEHOLDER_IMG"
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
        v-if="!isInCart"
        class="add-to-cart-btn w-full rounded-lg bg-green-600 py-2 text-white transition-colors hover:bg-green-700"
        @click="emit('add-to-cart', product)"
      >
        Добавить в корзину
      </button>
      <div v-else class="quantity-controls flex items-center justify-between">
        <button
          class="quantity-btn h-9 w-9 rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700"
          @click="emit('decrease-quantity', product)"
        >
          -
        </button>
        <span class="quantity-display text-base font-bold text-gray-800">{{
          quantity
        }}</span>
        <button
          class="quantity-btn h-9 w-9 rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700"
          @click="emit('increase-quantity', product)"
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { base, PLACEHOLDER_IMG } from '@/config';
import { type Product } from '@/stores/product';

defineProps<{
  product: Product;
  isInCart: boolean;
  quantity: number;
}>();

const emit = defineEmits<{
  (e: 'add-to-cart', product: Product): void;
  (e: 'increase-quantity', product: Product): void;
  (e: 'decrease-quantity', product: Product): void;
}>();

const onImgError = (event: Event) => {
  (event.target as HTMLImageElement).src = PLACEHOLDER_IMG;
};
</script>
