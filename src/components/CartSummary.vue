<template>
  <div
    class="cart-summary border-t-2 border-blue-600 pt-4 text-center sm:text-right"
  >
    <p class="mb-4 text-lg font-bold">
      Итого: <span id="cart-total">{{ total }} руб.</span>
    </p>
    <button
      v-if="!showModal"
      id="checkout-button"
      class="mb-2 w-full rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 sm:mr-2 sm:mb-0 sm:w-auto"
      @click="$emit('open-form')"
    >
      Оформить заказ
    </button>
    <button
      v-else
      id="confirm-order-button"
      class="mb-2 w-full rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 sm:mr-2 sm:mb-0 sm:w-auto"
      @click="$emit('submit-order')"
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
</template>

<script setup lang="ts">
import { useOrderStore } from '@/stores/order';

defineProps<{
  total: string;
  showModal: boolean;
}>();

defineEmits<{
  (e: 'open-form'): void;
  (e: 'submit-order'): void;
}>();

const orderStore = useOrderStore();
</script>
