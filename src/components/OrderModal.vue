<template>
  <div
    class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-sky-500/50 backdrop-blur-sm"
  >
    <div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-semibold">Оформление заказа</h2>
        <button
          class="text-gray-500 hover:text-gray-700"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 gap-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            v-model="form.firstName"
            class="input"
            placeholder="Имя"
            required
            pattern="^[A-Za-zА-Яа-яЁё0-9-]+$"
            title="Допустимы буквы, цифры и символ '-'"
            :disabled="orderStore.isSubmitting || orderStore.successMessage"
          />
          <input
            v-model="form.lastName"
            class="input"
            placeholder="Фамилия"
            required
            pattern="^[A-Za-zА-Яа-яЁё0-9-]+$"
            title="Допустимы буквы, цифры и символ '-'"
            :disabled="orderStore.isSubmitting || orderStore.successMessage"
          />
        </div>
        <input
          v-model="form.email"
          class="input"
          placeholder="Email"
          type="email"
          required
          pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
          title="Введите корректный e-mail в формате name@domain"
          :disabled="orderStore.isSubmitting || orderStore.successMessage"
        />
        <input
          v-model="form.phone"
          class="input"
          placeholder="Телефон"
          type="tel"
          required
          pattern="^\+7\d{10}$"
          title="Введите номер телефона в формате +7XXXXXXXXXX"
          :disabled="orderStore.isSubmitting || orderStore.successMessage"
        />
        <input
          v-model="form.address"
          class="input"
          placeholder="Адрес доставки"
          required
          :disabled="orderStore.isSubmitting || orderStore.successMessage"
        />
        <textarea
          v-model="form.notes"
          class="input"
          placeholder="Комментарий"
          :disabled="orderStore.isSubmitting || orderStore.successMessage"
        ></textarea>

        <button
          type="submit"
          class="mt-2 rounded-lg bg-green-600 py-2 text-white transition-colors hover:bg-green-700"
          :disabled="orderStore.isSubmitting || orderStore.successMessage"
        >
          {{ orderStore.isSubmitting ? 'Отправка...' : 'Подтвердить заказ' }}
        </button>
        <p v-if="orderStore.error" class="mt-2 text-sm text-red-600">
          {{ orderStore.error }}
        </p>
        <p v-if="orderStore.successMessage" class="mt-2 text-sm text-green-600">
          {{ orderStore.successMessage }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, defineEmits } from 'vue';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/stores/order';
import { useProductsStore } from '@/stores/product';

const orderStore = useOrderStore();
const productStore = useProductsStore();
const { cartItems: storeCartItems } = storeToRefs(productStore);

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
});

const emit = defineEmits(['close']);

watch(
  () => orderStore.successMessage,
  val => {
    if (val) {
      // Закрываем модальное окно по успешному созданию заказа
      emit('close');
    }
  }
);

function handleSubmit() {
  const items = storeCartItems.value.map(item => ({
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
}
</script>

<style scoped>
.input {
  @apply w-full max-w-[280px] rounded border border-gray-300 p-2 text-sm;
}
</style>
