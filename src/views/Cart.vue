<template>
  <div class="container">
    <div class="mt-10">
      <div id="cart-view" class="rounded-lg bg-white p-6 shadow-md">
        <h2 class="mb-6 text-center text-xl font-semibold text-gray-900">
          Ваша Корзина
        </h2>
        <div v-if="cartItems.length === 0" class="py-8 text-center">
          <p class="text-lg text-gray-500">Ваша корзина пуста</p>
          <router-link
            to="/"
            class="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Перейти к покупкам
          </router-link>
        </div>
        <div v-else id="cart-items-container" class="mb-6">
          <div
            v-for="item in cartItems"
            :key="item.product.id"
            class="cart-item flex items-center gap-4 border-b border-gray-200 py-4 last:border-b-0"
          >
            <img
              :src="`http://46.8.229.19/media/${item.product.image}`"
              alt="Cart Item"
              class="h-20 w-20 rounded-md object-cover"
            />
            <div class="cart-item-details flex-grow">
              <h3 class="mb-1 text-base font-semibold text-gray-900">
                {{ item.product.name }}
              </h3>
              <p class="text-sm text-gray-600">{{ item.product.price }} руб.</p>
              <p class="text-xs text-gray-500">{{ item.product.unit }}</p>
            </div>
            <div class="cart-item-quantity flex items-center gap-2">
              <button
                @click="decreaseQuantity(item.product)"
                class="h-8 w-8 rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700"
              >
                -
              </button>
              <span class="w-12 text-center font-semibold">{{
                item.quantity
              }}</span>
              <button
                @click="increaseQuantity(item.product)"
                class="h-8 w-8 rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700"
              >
                +
              </button>
            </div>
            <p
              class="cart-item-total text-right text-sm font-bold text-gray-800"
            >
              {{ (parseFloat(item.product.price) * item.quantity).toFixed(2) }}
              руб.
            </p>
            <div class="cart-item-remove">
              <button
                class="rounded-md bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700"
                @click="removeFromCart(item.product.id)"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="cartItems.length > 0"
          class="cart-summary border-t-2 border-blue-600 pt-4 text-right"
        >
          <p class="mb-4 text-lg font-bold">
            Итого: <span id="cart-total">{{ cartTotal }} руб.</span>
          </p>
          <button
            id="checkout-button"
            class="mr-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
          >
            Оформить заказ
          </button>
          <router-link
            to="/"
            class="inline-block rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
          >
            Продолжить покупки
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductsStore, Product } from '@/stores/product';

const productStore = useProductsStore();
const { cartItems, cartCount } = storeToRefs(productStore);

const cartTotal = computed(() => {
  return cartItems.value
    .reduce((total, item) => {
      return total + parseFloat(item.product.price) * item.quantity;
    }, 0)
    .toFixed(2);
});

const increaseQuantity = (product: Product) =>
  productStore.increaseQuantity(product);
const decreaseQuantity = (product: Product) =>
  productStore.decreaseQuantity(product);
const removeFromCart = (productId: number) =>
  productStore.removeFromCart(productId);
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
