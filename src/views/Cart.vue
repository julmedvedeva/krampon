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
            class="cart-item flex gap-4 border-b border-gray-200 py-4 last:border-b-0"
          >
            <img
              :src="`${base}/media/${item.product.image}`"
              alt="Cart Item"
              class="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
            />
            <div class="flex flex-grow flex-col">
              <!-- Название (truncate 90) -->
              <h3 class="text-base font-semibold text-gray-900">
                {{ truncate(item.product.name) }}
              </h3>
              <!-- Цена -->
              <p class="mb-2 text-sm text-gray-600">
                {{ item.product.price }} руб.
              </p>

              <!-- Удалить и количество -->
              <div class="flex items-center justify-end gap-4">
                <button
                  @click="removeFromCart(item.product.id)"
                  class="text-2xl leading-none text-red-600 transition-colors hover:text-red-800"
                >
                  ✕
                </button>

                <div class="flex items-center gap-2">
                  <button
                    @click="decreaseQuantity(item.product)"
                    class="h-8 w-8 rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700"
                  >
                    -
                  </button>
                  <span class="w-10 text-center font-semibold">{{
                    item.quantity
                  }}</span>
                  <button
                    @click="increaseQuantity(item.product)"
                    class="h-8 w-8 rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="cartItems.length > 0"
          class="cart-summary border-t-2 border-blue-600 pt-4 text-center sm:text-right"
        >
          <p class="mb-4 text-lg font-bold">
            Итого: <span id="cart-total">{{ cartTotal }} руб.</span>
          </p>
          <button
            v-if="!showModal"
            id="checkout-button"
            class="mb-2 w-full rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 sm:mr-2 sm:mb-0 sm:w-auto"
            @click="openForm"
          >
            Оформить заказ
          </button>
          <button
            v-else
            id="confirm-order-button"
            class="mb-2 w-full rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 sm:mr-2 sm:mb-0 sm:w-auto"
            @click="submitOrder"
            :disabled="orderStore.isSubmitting"
          >
            {{ orderStore.isSubmitting ? 'Отправка...' : 'Подтвердить заказ' }}
          </button>
          <router-link
            to="/"
            class="inline-block w-full rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700 sm:w-auto"
          >
            Продолжить покупки
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <!-- Форма заказа -->
  <OrderModal v-if="showModal" @close="closeModal" />
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { base } from '@/config';
import { useProductsStore, type Product } from '@/stores/product';
import { useOrderStore } from '@/stores/order';
import OrderModal from '@/components/OrderModal.vue';

const productStore = useProductsStore();
const { cartItems, cartCount } = storeToRefs(productStore);

const orderStore = useOrderStore();
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
});

const showModal = ref(false);

function openForm() {
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}

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

const submitOrder = () => {
  const items = cartItems.value.map(item => ({
    product_id: item.product.id,
    price: item.product.price,
    quantity: item.quantity,
  }));
  orderStore.createOrder({
    customer_first_name: form.firstName,
    customer_last_name: form.lastName,
    customer_email: form.email,
    customer_phone: form.phone,
    shipping_address: form.address,
    items,
    notes: form.notes,
  });
};

/**
 * Truncates a string to a specified length and appends ellipsis if the string exceeds the limit.
 * @param {string} str - The string to be truncated.
 * @param {number} [n=90] - The maximum length of the truncated string. Defaults to 90.
 * @returns {string} - The truncated string, with ellipsis appended if truncation occurs.
 */
const TRUNCATION_LIMIT = 90;

function truncate(str: string, n: number = TRUNCATION_LIMIT) {
  if (str.length <= n) {
    return str;
  }
  return str.slice(0, n) + '...';
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
