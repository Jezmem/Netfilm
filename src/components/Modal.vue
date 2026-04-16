<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  title?: string
  size?: 'sm' | 'md' | 'lg'
}>()

const emit = defineEmits<{
  close: []
}>()

function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="emit('close')">
      <div class="modal-container" :class="[`modal-${size || 'md'}`]">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button class="modal-close" @click="emit('close')">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-container {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
}
.modal-sm { max-width: 400px; }
.modal-md { max-width: 580px; }
.modal-lg { max-width: 800px; }
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
}
.modal-title {
  font-size: 18px;
  font-weight: 600;
}
.modal-close {
  background: none;
  border: none;
  color: var(--color-text-muted);
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
  display: flex;
}
.modal-close:hover {
  background: var(--color-bg-3);
  color: var(--color-text);
}
.modal-body {
  padding: 24px;
}
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
