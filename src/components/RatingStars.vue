<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: number
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const hovered = ref(0)

function setRating(val: number) {
  if (!props.readonly) {
    emit('update:modelValue', val)
  }
}

const sizes = { sm: 16, md: 22, lg: 28 }
</script>

<template>
  <div class="stars" :class="{ readonly, [`stars-${size || 'md'}`]: true }">
    <button
      v-for="i in 5"
      :key="i"
      class="star-btn"
      :class="{ active: i <= (hovered || modelValue), readonly }"
      @mouseenter="!readonly && (hovered = i)"
      @mouseleave="!readonly && (hovered = 0)"
      @click="setRating(i)"
      :disabled="readonly"
      type="button"
    >
      <svg :width="sizes[size || 'md']" :height="sizes[size || 'md']" viewBox="0 0 24 24">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          :fill="i <= (hovered || modelValue) ? '#f5c518' : 'none'"
          :stroke="i <= (hovered || modelValue) ? '#f5c518' : '#6b6b6b'"
          stroke-width="1.5"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.stars {
  display: flex;
  gap: 4px;
  align-items: center;
}
.star-btn {
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  transition: transform var(--transition);
  display: flex;
  align-items: center;
}
.star-btn:not(.readonly):hover {
  transform: scale(1.2);
}
.star-btn.readonly {
  cursor: default;
}
.star-btn:disabled {
  opacity: 1;
}
</style>
