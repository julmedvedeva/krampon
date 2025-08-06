<template>
  <div id="cart-items-container" class="mb-6">
    <div
      v-for="item in items"
      :key="item.product.id"
      class="cart-item flex gap-4 border-b border-gray-200 py-4 last:border-b-0"
    >
      <img
        :src="
          item.product.image
            ? `${base}/media/${item.product.image}`
            : PLACEHOLDER_IMG
        "
        alt="Cart Item"
        class="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
        @error="onImgError"
      />
      <div class="flex flex-grow flex-col">
        <h3 class="text-base font-semibold text-gray-900">
          {{ truncate(item.product.name) }}
        </h3>
        <p class="mb-2 text-sm text-gray-600">{{ item.product.price }} руб.</p>
        <div class="flex items-center justify-end gap-4">
          <button
            @click="$emit('remove-item', item.product.id)"
            class="text-2xl leading-none text-red-600 transition-colors hover:text-red-800"
          >
            ✕
          </button>
          <div class="flex items-center gap-2">
            <button
              @click="$emit('update-quantity', item.product, 'decrease')"
              class="h-8 w-8 rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700"
            >
              -
            </button>
            <span class="w-10 text-center font-semibold">{{
              item.quantity
            }}</span>
            <button
              @click="$emit('update-quantity', item.product, 'increase')"
              class="h-8 w-8 rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { base, PLACEHOLDER_IMG } from '@/config';
import { type Product, type CartItem } from '@/stores/product';
import { useCartSetup } from '@/composables/useCartSetup.ts';

defineProps<{
  items: CartItem[];
}>();

defineEmits<{
  (
    e: 'update-quantity',
    product: Product,
    action: 'increase' | 'decrease'
  ): void;
  (e: 'remove-item', productId: number): void;
}>();

const { onImgError, truncate } = useCartSetup();
</script>
