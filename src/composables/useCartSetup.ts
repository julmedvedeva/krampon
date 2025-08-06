import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductsStore, type Product } from '@/stores/product';
import { useOrderStore } from '@/stores/order';
import { PLACEHOLDER_IMG } from '@/config';

export function useCartSetup() {
  const productStore = useProductsStore();
  const orderStore = useOrderStore();
  const { cartItems } = storeToRefs(productStore);

  const showModal = ref(false);
  const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const cartTotal = computed(() => {
    return cartItems.value
      .reduce(
        (total, item) => total + parseFloat(item.product.price) * item.quantity,
        0
      )
      .toFixed(2);
  });

  function openForm() {
    showModal.value = true;
  }

  function closeModal() {
    showModal.value = false;
  }

  function updateQuantity(product: Product, action: 'increase' | 'decrease') {
    if (action === 'increase') productStore.increaseQuantity(product);
    else productStore.decreaseQuantity(product);
  }

  function removeFromCart(productId: number) {
    productStore.removeFromCart(productId);
  }

  function submitOrder() {
    const items = cartItems.value.map(item => ({
      product_id: item.product.id,
      price: item.product.price,
      quantity: item.quantity,
    }));
    orderStore.createOrder({
      customer_first_name: form.value.firstName,
      customer_last_name: form.value.lastName,
      customer_email: form.value.email,
      customer_phone: form.value.phone,
      shipping_address: form.value.address,
      items,
      notes: form.value.notes,
    });
  }

  function onImgError(event: Event) {
    (event.target as HTMLImageElement).src = PLACEHOLDER_IMG;
  }

  const TRUNCATION_LIMIT = 90;
  function truncate(str: string, n: number = TRUNCATION_LIMIT) {
    return str.length <= n ? str : str.slice(0, n) + '...';
  }

  return {
    cartItems,
    cartTotal,
    showModal,
    openForm,
    closeModal,
    updateQuantity,
    removeFromCart,
    submitOrder,
    onImgError,
    truncate,
  };
}
