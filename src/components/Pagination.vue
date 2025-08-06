<template>
  <div class="mt-8 flex justify-center">
    <div class="flex items-center space-x-2">
      <button
        v-if="pagination.previousPage !== null"
        @click="emit('change-page', pagination.previousPage)"
        class="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
      >
        Предыдущая
      </button>
      <span class="px-4 py-2 text-sm text-gray-700">
        Страница {{ currentPage }} из {{ pagination.totalPages }}
      </span>
      <button
        v-if="pagination.nextPage !== null"
        @click="emit('change-page', pagination.nextPage)"
        class="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
      >
        Следующая
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Pagination as PaginationType } from '@/stores/product';

const props = defineProps<{
  pagination: PaginationType;
}>();

const emit = defineEmits<{
  (e: 'change-page', page: number): void;
}>();

const currentPage = ref(1);

watch(
  () => props.pagination.currentPage,
  newPage => {
    currentPage.value = newPage;
  }
);
</script>
