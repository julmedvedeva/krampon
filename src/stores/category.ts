import { defineStore } from 'pinia';
import { type Ref, ref } from 'vue';
import { ApiClient } from '@/common/client';
interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}
export const useCategoryStore = defineStore('category', () => {
  const categories: Ref<Category[]> = ref<Category[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const apiClient = new ApiClient('/api/v1');

  async function fetchCategories() {
    try {
      isLoading.value = true;
      const response = await apiClient.get<Category[]>('/category');
      categories.value = response.data;
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      error.value = errorObj.message ?? 'Failed to fetch categories';
    } finally {
      isLoading.value = false;
    }
  }

  return { categories, isLoading, error, fetchCategories };
});
