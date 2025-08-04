<template>
  <div
    class="sticky top-16 z-40 mb-6 flex flex-nowrap gap-2 overflow-x-auto bg-white px-4 py-2"
  >
    <button
      v-for="category in categoriesWithAll"
      :key="category.slug"
      :class="[
        'category-filter-btn',
        'rounded-full border border-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-blue-600 transition-all hover:bg-blue-100 hover:shadow-sm',
        {
          'bg-blue-600 font-bold text-white shadow-md':
            activeCategory === category.id,
        },
      ]"
      @click="setActiveCategory(category.id)"
    >
      {{ category.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

const props = defineProps<{
  categories: Category[];
  activeCategory: number;
}>();

const emit = defineEmits<{
  (e: 'update:activeCategory', category: number): void;
}>();

const categoriesWithAll = computed(() => [
  { id: 0, name: 'Все', slug: 'all', description: '' },
  ...(props.categories || []),
]);

const setActiveCategory = (category: number) => {
  emit('update:activeCategory', category);
};
</script>
