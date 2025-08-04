import { ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductsStore } from '@/stores/product';
import { useCategoryStore, type Category } from '@/stores/category';

export function useCatalogSetup() {
  const productStore = useProductsStore();
  const categoryStore = useCategoryStore();

  const { cartCount } = storeToRefs(productStore);
  const { categories } = storeToRefs(categoryStore) as {
    categories: Ref<Category[]>;
  };
  const activeCategory: Ref<number> = ref(0);

  categoryStore.fetchCategories();

  function updateCategory(val: number) {
    activeCategory.value = val;
  }

  return {
    cartCount,
    categories,
    activeCategory,
    updateCategory,
  };
}
