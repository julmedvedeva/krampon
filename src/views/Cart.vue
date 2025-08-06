<template>
  <div class="container">
    <div class="mt-10">
      <div id="cart-view" class="rounded-lg bg-white p-6 shadow-md">
        <h2 class="mb-6 text-center text-xl font-semibold text-gray-900">
          Ваша Корзина
        </h2>
        <EmptyCart v-if="cartItems.length === 0" />
        <CartItems
          v-else
          :items="cartItems"
          @update-quantity="updateQuantity"
          @remove-item="removeFromCart"
        />
        <CartSummary
          v-if="cartItems.length > 0"
          :total="cartTotal"
          :show-modal="showModal"
          @open-form="openForm"
          @submit-order="submitOrder"
        />
      </div>
    </div>
    <OrderModal v-if="showModal" @close="closeModal" />
  </div>
</template>

<script setup lang="ts">
import { useCartSetup } from '@/composables/useCartSetup';
import { OrderModal, CartSummary, EmptyCart, CartItems } from '../components';

const {
  cartItems,
  cartTotal,
  showModal,
  openForm,
  closeModal,
  submitOrder,
  updateQuantity,
  removeFromCart,
} = useCartSetup();
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
