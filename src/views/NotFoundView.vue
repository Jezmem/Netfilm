<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="not-found-code">404</div>
      <h1 class="not-found-title">{{ t('notFound.title') }}</h1>
      <p class="not-found-text">{{ t('notFound.message') }}</p>
      <RouterLink to="/" class="btn btn-primary btn-lg">{{ t('notFound.backHome') }}</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
}
.not-found-code {
  font-size: 120px;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
  margin-bottom: 16px;
  opacity: 0.8;
}
.not-found-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
}
.not-found-text {
  color: var(--color-text-secondary);
  font-size: 16px;
  margin-bottom: 32px;
  max-width: 400px;
}
</style>
