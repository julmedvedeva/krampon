<template>
  <div class="min-h-screen bg-gray-100 text-gray-800 antialiased">
    <!-- Header -->
    <Header :cart-count="cartItems.length" title="Каталог товаров" @open-cart="openCartModal" />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto p-4 md:p-6">
      <!-- Category Filters -->
      <div
        class="flex flex-wrap gap-2 mb-6 justify-center md:justify-start overflow-x-auto pb-2"
      >
        <button
          v-for="category in categories"
          :key="category"
          :class="[
            'category-filter-btn',
            'px-4 py-2 rounded-full border border-blue-600 text-blue-600 font-medium text-sm hover:bg-blue-100 hover:shadow-sm transition-all',
            { 'bg-blue-600 text-white font-bold shadow-md': activeCategory === category }
          ]"
          @click="setActiveCategory(category)"
        >
          {{ category }}
        </button>
      </div>

      <!-- Product Grid -->
      <div id="product-view">
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6"
        >
          <div
            v-for="product in paginatedProducts"
            :key="product.id"
            class="product-card bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col"
          >
            <img
              :src="product.image"
              alt="Product"
              class="w-full h-32 object-cover rounded-lg mb-3 bg-gray-100"
            />
            <h2 class="text-base font-semibold text-gray-900 mb-1">
              {{ product.name }}
            </h2>
            <p
              class="text-sm text-gray-600 mb-3 line-clamp-3 flex-grow"
            >
              {{ product.description }}
            </p>
            <p class="text-base font-bold text-blue-600 mb-3">
              {{ product.price }} руб.
            </p>
            <div class="mt-auto">
              <button
                v-if="!product.inCart"
                class="add-to-cart-btn w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                @click="addToCart(product)"
              >
                Добавить в корзину
              </button>
              <div
                v-else
                class="quantity-controls flex items-center justify-between"
              >
                <button
                  class="quantity-btn w-9 h-9 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  @click="decreaseQuantity(product)"
                >
                  -
                </button>
                <span class="quantity-display text-base font-bold text-gray-800">{{
                    product.quantity
                  }}</span>
                <button
                  class="quantity-btn w-9 h-9 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  @click="increaseQuantity(product)"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div
          class="pagination-controls flex justify-center items-center gap-2 flex-wrap mt-6"
        >
          <button
            v-for="page in totalPages"
            :key="page"
            :class="[
              'pagination-btn',
              'px-3 py-2 rounded-md border border-blue-600 text-blue-600 text-sm hover:bg-blue-600 hover:text-white transition-colors',
              { 'bg-blue-600 text-white font-bold': currentPage === page }
            ]"
            @click="setCurrentPage(page)"
          >
            {{ page }}
          </button>
        </div>
      </div>

      <!-- Cart View -->
      <div
        id="cart-view"
        :class="{ 'hidden': !isCartView }"
        class="bg-white rounded-lg p-4 shadow-md"
      >
        <h2 class="text-xl font-semibold text-gray-900 text-center mb-6">
          Ваша Корзина
        </h2>
        <div id="cart-items-container" class="mb-6">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="cart-item flex items-center gap-4 py-3 border-b border-gray-200 last:border-b-0"
          >
            <img
              :src="item.image"
              alt="Cart Item"
              class="w-16 h-16 object-cover rounded-md"
            />
            <div class="cart-item-details flex-grow">
              <h3 class="text-base font-semibold text-gray-900 mb-1">
                {{ item.name }}
              </h3>
              <p class="text-sm text-gray-600">{{ item.price }} руб.</p>
            </div>
            <div class="cart-item-quantity">
              <input
                type="number"
                v-model.number="item.quantity"
                class="w-16 p-1 text-center border border-gray-300 rounded-md text-sm"
                min="1"
              />
            </div>
            <p class="cart-item-total text-sm font-bold text-gray-800 text-right">
              {{ (item.price * item.quantity) }} руб.
            </p>
            <div class="cart-item-remove">
              <button
                class="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors"
                @click="removeFromCart(item)"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
        <div class="cart-summary text-right border-t-2 border-blue-600 pt-4">
          <p class="text-lg font-bold mb-4">
            Итого: <span id="cart-total">{{ cartTotal }} руб.</span>
          </p>
          <button
            id="checkout-button"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors mr-2"
          >
            Оформить заказ
          </button>
          <button
            id="continue-shopping-button"
            class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            @click="toggleCartView"
          >
            Продолжить покупки
          </button>
        </div>
      </div>
    </main>

    <!-- Sticky Cart Button -->
    <button
      id="sticky-cart-button"
      :class="[
        'fixed bottom-0 left-0 right-0 bg-blue-600 text-white py-3 text-base font-medium shadow-md hover:bg-blue-700 transition-all z-40',
        { 'translate-y-full opacity-0': cartItems.length === 0, 'translate-y-0 opacity-100': cartItems.length > 0 }
      ]"
      aria-label="Перейти в корзину"
      @click="toggleCartView"
    >
      <span class="sticky-cart-button-text">В Корзину</span>
      (<span id="sticky-cart-count">{{ cartCount }}</span>) -
      <span id="sticky-cart-total">{{ cartTotal }} руб.</span>
    </button>

    <!-- Footer -->
    <footer class="bg-gray-800 text-gray-100 text-center p-6 mt-10">
      <p>© 2025 Наш Магазин</p>
    </footer>

    <!-- Toast Container -->
    <div
      id="toast-container"
      class="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-full max-w-sm px-5"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg text-sm text-center w-full opacity-0 transition-all duration-400"
        :class="{ 'opacity-100 translate-y-0': toast.show, 'translate-y-5': !toast.show }"
      >
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Header}  from '@/components'

// Mock data (replace with your actual data from data.js or an API)
const products = ref([
  {
    id: 1,
    name: 'Товар 1',
    description: 'Описание товара 1',
    price: 100,
    image: 'https://placehold.co/600x400',
    category: 'Категория 1',
    inCart: false,
    quantity: 0
  },
])
const openCartModal = () => {
  console.log('Открываем корзину');
  // Логика открытия корзины
};
const categories = ref(['Все', 'Категория 1', 'Категория 2']) // Replace with dynamic categories
const activeCategory = ref('Все')
const currentPage = ref(1)
const itemsPerPage = 8
const cartItems = ref([])
const isCartView = ref(false)
const toasts = ref([])

// Computed properties
const filteredProducts = computed(() => {
  if (activeCategory.value === 'Все') return products.value
  return products.value.filter(
    (product) => product.category === activeCategory.value
  )
})

const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage)
)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

const cartCount = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
)

const cartTotal = computed(() =>
  cartItems.value
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2)
)

// Methods
const setActiveCategory = (category) => {
  activeCategory.value = category
  currentPage.value = 1 // Reset to first page
}

const setCurrentPage = (page) => {
  currentPage.value = page
}

const addToCart = (product) => {
  const cartItem = cartItems.value.find((item) => item.id === product.id)
  if (cartItem) {
    cartItem.quantity++
  } else {
    cartItems.value.push({ ...product, quantity: 1 })
  }
  product.inCart = true
  product.quantity = cartItem ? cartItem.quantity : 1
  showToast(`${product.name} добавлен в корзину`)
}

const decreaseQuantity = (product) => {
  const cartItem = cartItems.value.find((item) => item.id === product.id)
  if (cartItem && cartItem.quantity > 1) {
    cartItem.quantity--
    product.quantity = cartItem.quantity
  } else {
    removeFromCart(product)
  }
}

const increaseQuantity = (product) => {
  const cartItem = cartItems.value.find((item) => item.id === product.id)
  if (cartItem) {
    cartItem.quantity++
    product.quantity = cartItem.quantity
  }
}

const removeFromCart = (product) => {
  cartItems.value = cartItems.value.filter((item) => item.id !== product.id)
  product.inCart = false
  product.quantity = 0
  showToast(`${product.name} удален из корзины`)
}

const toggleCartView = () => {
  isCartView.value = !isCartView.value
}

const showToast = (message) => {
  const id = Date.now()
  toasts.value.push({ id, message, show: false })
  setTimeout(() => {
    toasts.value = toasts.value.map((toast) =>
      toast.id === id ? { ...toast, show: true } : toast
    )
    setTimeout(() => {
      toasts.value = toasts.value.filter((toast) => toast.id !== id)
    }, 3000)
  }, 100)
}
</script>

<style scoped>
/* Ensure number input spinners are hidden */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
