<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Movie, Serie } from '@/stores/content'

const props = defineProps<{
  item: Movie | Serie
  type: 'movie' | 'series'
}>()

const detailRoute = computed(() => ({
  name: props.type === 'movie' ? 'movie-detail' : 'series-detail',
  params: { id: props.item.id }
}))

const imageUrl = computed(() => {
  if (!props.item.image) return 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'
  return props.item.image
})

const year = computed(() => {
  if (!props.item.date_sortie) return ''
  return new Date(props.item.date_sortie).getFullYear()
})

const noteColor = computed(() => {
  const n = props.item.note
  if (n >= 8) return '#2ecc71'
  if (n >= 6) return '#f5c518'
  return '#e74c3c'
})
</script>

<template>
  <RouterLink :to="detailRoute" class="content-card">
    <div class="card-image">
      <img :src="imageUrl" :alt="item.titre" loading="lazy" />
      <div class="card-overlay">
        <div class="play-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
      <div class="card-type-badge">{{ type === 'movie' ? 'Film' : 'Série' }}</div>
      <div class="card-note" :style="{ color: noteColor }">
        <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        {{ item.note?.toFixed(1) || '—' }}
      </div>
    </div>
    <div class="card-info">
      <h3 class="card-title">{{ item.titre }}</h3>
      <div class="card-meta">
        <span v-if="year" class="card-year">{{ year }}</span>
        <span v-if="item.categories" class="card-category">{{ item.categories.nom }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.content-card {
  display: block;
  cursor: pointer;
  transition: transform var(--transition);
}
.content-card:hover {
  transform: scale(1.03);
}
.content-card:hover .card-overlay {
  opacity: 1;
}
.card-image {
  position: relative;
  aspect-ratio: 2/3;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-bg-3);
}
.card-image img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.content-card:hover .card-image img {
  transform: scale(1.05);
}
.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition);
}
.play-btn {
  width: 52px; height: 52px;
  background: rgba(229,9,20,0.9);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: white;
  transition: transform var(--transition);
}
.content-card:hover .play-btn {
  transform: scale(1.1);
}
.card-type-badge {
  position: absolute;
  top: 10px; left: 10px;
  background: rgba(0,0,0,0.7);
  color: var(--color-text-secondary);
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.card-note {
  position: absolute;
  bottom: 10px; right: 10px;
  background: rgba(0,0,0,0.8);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.card-info {
  padding: 10px 4px 4px;
}
.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}
.card-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}
.card-year {
  font-size: 12px;
  color: var(--color-text-muted);
}
.card-category {
  font-size: 11px;
  color: var(--color-text-muted);
  background: var(--color-bg-3);
  padding: 2px 8px;
  border-radius: 20px;
}
</style>
