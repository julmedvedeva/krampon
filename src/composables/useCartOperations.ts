import type { Product } from '@/stores/product.ts';
import { useProductsStore } from '@/stores/product.ts';

export function useCartOperations(store: ReturnType<typeof useProductsStore>) {
  return {
    isProductInCart: (productId: number) => store.isProductInCart(productId),
    getCartItemQuantity: (productId: number) =>
      store.getCartItemQuantity(productId),
    addToCart: (product: Product) => store.addToCart(product),
    increaseQuantity: (product: Product) => store.increaseQuantity(product),
    decreaseQuantity: (product: Product) => store.decreaseQuantity(product),
  };
}
