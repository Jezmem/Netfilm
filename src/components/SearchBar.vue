<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Category } from '@/stores/content'

const { t } = useI18n()

const props = defineProps<{
  categories: Category[]
  modelValue: {
    search: string
    category_id: string
    note_min: string
    sort: string
    order: string
    type: string
  }
}>()

const emit = defineEmits<{
  'update:modelValue': [value: typeof props.modelValue]
  'search': []
}>()

const localFilters = ref({ ...props.modelValue })

watch(() => props.modelValue, val => {
  localFilters.value = { ...val }
}, { deep: true })

function update(key: string, value: string) {
  localFilters.value = { ...localFilters.value, [key]: value }
  emit('update:modelValue', localFilters.value)
  emit('search')
}

function updateSort(combined: string) {
  const parts = combined.split('-')
  const sort = parts[0]
  const order = parts[1] || 'desc'
  localFilters.value = { ...localFilters.value, sort, order }
  emit('update:modelValue', localFilters.value)
  emit('search')
}
</script>

<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        type="text"
        class="search-input"
        :placeholder="t('search.placeholder')"
        :value="localFilters.search"
        @input="update('search', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="filters">
      <select class="filter-select" :value="localFilters.type" @change="update('type', ($event.target as HTMLSelectElement).value)">
        <option value="">{{ t('search.all') }}</option>
        <option value="movie">{{ t('search.movies') }}</option>
        <option value="series">{{ t('search.series') }}</option>
      </select>

      <select class="filter-select" :value="localFilters.category_id" @change="update('category_id', ($event.target as HTMLSelectElement).value)">
        <option value="">{{ t('search.allCategories') }}</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nom }}</option>
      </select>

      <select class="filter-select" :value="localFilters.note_min" @change="update('note_min', ($event.target as HTMLSelectElement).value)">
        <option value="">{{ t('search.minRating') }}</option>
        <option value="9">{{ t('search.rating9') }}</option>
        <option value="8">{{ t('search.rating8') }}</option>
        <option value="7">{{ t('search.rating7') }}</option>
        <option value="6">{{ t('search.rating6') }}</option>
      </select>

      <select class="filter-select" :value="`${localFilters.sort}-${localFilters.order}`" @change="(e) => updateSort((e.target as HTMLSelectElement).value)">
        <option value="date_creation-desc">{{ t('search.sortNewest') }}</option>
        <option value="note-desc">{{ t('search.sortRating') }}</option>
        <option value="titre-asc">{{ t('search.sortAZ') }}</option>
        <option value="date_sortie-desc">{{ t('search.sortRelease') }}</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.search-input-wrapper {
  position: relative;
}
.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  background: var(--color-bg-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 15px;
  outline: none;
  transition: border-color var(--transition);
}
.search-input:focus {
  border-color: var(--color-primary);
}
.search-input::placeholder {
  color: var(--color-text-muted);
}
.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.filter-select {
  flex: 1;
  min-width: 140px;
  padding: 10px 14px;
  background: var(--color-bg-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-size: 13px;
  outline: none;
  cursor: pointer;
  transition: border-color var(--transition);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='%236b6b6b' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 18px;
  padding-right: 36px;
}
.filter-select:focus {
  border-color: var(--color-primary);
}
@media (max-width: 600px) {
  .filters { flex-direction: column; }
  .filter-select { min-width: unset; }
}
</style>
