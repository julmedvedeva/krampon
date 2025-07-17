import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ApiClient } from '@/common/client';
import { API_BASE_URL } from '@/config';

interface Manufacturer {
  id: number;
  title: string;
}

interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  unit: string;
  sku: string;
  price: string;
  weight: number | null;
  short_description: string;
  description: string;
  slug: string;
  manufacturer: Manufacturer;
  category: Category;
  image: string;
  is_active: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Pagination {
  currentPage: number;
  previousPage: number | null;
  totalPages: number;
  totalCount: number;
  nextPage: number | null;
}

interface ApiResponse {
  links: {
    next: string | null;
    previous: string | null;
  };
  count: number;
  page: number;
  total_pages: number;
  results: Product[];
}

export const useProductsStore = defineStore('product', () => {
  const productsList = ref<Product[]>([]);
  const pagination = ref<Pagination>({
    currentPage: 1,
    previousPage: null,
    totalPages: 1,
    totalCount: 0,
    nextPage: null,
  });
  const cartItems = ref<CartItem[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const apiClient = new ApiClient(API_BASE_URL);

  const cartCount = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  );

  function isProductInCart(productId: number): boolean {
    return cartItems.value.some(item => item.product.id === productId);
  }

  function getCartItemQuantity(productId: number): number {
    const cartItem = cartItems.value.find(
      item => item.product.id === productId
    );
    return cartItem ? cartItem.quantity : 0;
  }

  async function fetchProducts(
    categoryName: string | null = null,
    page: number = 1
  ) {
    try {
      isLoading.value = true;
      const endpoint =
        categoryName && categoryName !== 'Все'
          ? `/products?category_id=${encodeURIComponent(categoryName)}&page=${page}`
          : `/products?page=${page}`;
      const response = await apiClient.get<ApiResponse>(endpoint);

      if (response.data) {
        productsList.value = response.data.results || [];
        pagination.value = {
          currentPage: response.data.page,
          previousPage: response.data.links.previous
            ? response.data.page - 1
            : null,
          totalPages: response.data.total_pages,
          totalCount: response.data.count,
          nextPage: response.data.links.next ? response.data.page + 1 : null,
        };
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      error.value = errorObj.message ?? 'Failed to fetch products';
    } finally {
      isLoading.value = false;
    }
  }

  function addToCart(product: Product) {
    const cartItemIndex = cartItems.value.findIndex(
      item => item.product.id === product.id
    );

    if (cartItemIndex > -1) {
      cartItems.value[cartItemIndex].quantity += 1;
      console.log(
        `Количество "${product.name}" увеличено до ${cartItems.value[cartItemIndex].quantity}`
      );
    } else {
      cartItems.value.push({ product, quantity: 1 });
      console.log(`"${product.name}" добавлен в корзину!`);
    }
  }

  function increaseQuantity(product: Product) {
    const cartItemIndex = cartItems.value.findIndex(
      item => item.product.id === product.id
    );

    if (cartItemIndex > -1) {
      const newQuantity = Math.min(
        cartItems.value[cartItemIndex].quantity + 1,
        99
      );
      cartItems.value[cartItemIndex].quantity = newQuantity;
      console.log(`Количество "${product.name}" увеличено до ${newQuantity}`);
    }
  }

  function decreaseQuantity(product: Product) {
    const cartItemIndex = cartItems.value.findIndex(
      item => item.product.id === product.id
    );

    if (cartItemIndex > -1) {
      const newQuantity = cartItems.value[cartItemIndex].quantity - 1;

      if (newQuantity <= 0) {
        cartItems.value.splice(cartItemIndex, 1);
        console.log(`"${product.name}" удален из корзины.`);
      } else {
        cartItems.value[cartItemIndex].quantity = newQuantity;
        console.log(`Количество "${product.name}" уменьшено до ${newQuantity}`);
      }
    }
  }

  function changeCartItemQuantity(productId: number, newQuantity: number) {
    const product = productsList.value.find(p => p.id === productId);
    if (!product) return;

    newQuantity = Math.max(0, Math.min(newQuantity, 99));
    const cartItemIndex = cartItems.value.findIndex(
      item => item.product.id === productId
    );

    if (newQuantity > 0) {
      if (cartItemIndex > -1) {
        cartItems.value[cartItemIndex].quantity = newQuantity;
      } else {
        cartItems.value.push({ product, quantity: newQuantity });
        console.log(
          `"${product.name}" (${newQuantity} шт.) добавлен в корзину!`
        );
      }
    } else {
      if (cartItemIndex > -1) {
        cartItems.value.splice(cartItemIndex, 1);
        console.log(`"${product.name}" удален из корзины.`);
      }
    }
  }

  function removeFromCart(productId: number) {
    const cartItemIndex = cartItems.value.findIndex(
      item => item.product.id === productId
    );

    if (cartItemIndex > -1) {
      const productName = cartItems.value[cartItemIndex].product.name;
      cartItems.value.splice(cartItemIndex, 1);
      console.log(`"${productName}" удален из корзины.`);
    }
  }

  function clearCart() {
    cartItems.value = [];
    console.log('Корзина очищена.');
  }

  return {
    productsList,
    pagination,
    cartItems,
    cartCount,
    isLoading,
    error,
    fetchProducts,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    changeCartItemQuantity,
    removeFromCart,
    clearCart,
    isProductInCart,
    getCartItemQuantity,
  };
});
