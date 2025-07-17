import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ApiClient } from '@/common/client';
import { API_BASE_URL } from '@/config';
import { useProductsStore } from './product';

interface OrderItemPayload {
  product_id: number;
  price: string;
  quantity: number;
}

interface OrderPayload {
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  items: OrderItemPayload[];
  notes?: string;
}

export const useOrderStore = defineStore('order', () => {
  const isSubmitting = ref(false);
  const error = ref<string | null>(null);
  const successMessage = ref<string | null>(null);

  const apiClient = new ApiClient(API_BASE_URL);

  async function createOrder(payload: OrderPayload) {
    try {
      isSubmitting.value = true;
      error.value = null;
      successMessage.value = null;
      await apiClient.post('/orders/create/', payload);
      successMessage.value = 'Заказ успешно создан!';

      // очищаем корзину после успешного заказа
      const productStore = useProductsStore();
      productStore.clearCart();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      error.value = errorObj.message ?? 'Failed to create order';
    } finally {
      isSubmitting.value = false;
    }
  }

  return { isSubmitting, error, successMessage, createOrder };
});
