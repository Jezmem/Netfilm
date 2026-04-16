<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useContentStore } from '@/stores/content'
import { toast } from 'vue3-toastify'

const contentStore = useContentStore()
const loading = ref(true)
const filter = ref<'all' | 'movie' | 'series'>('all')

onMounted(async () => {
  await contentStore.fetchWatchlist()
  loading.value = false
})

const filtered = computed(() => {
  if (filter.value === 'all') return contentStore.watchlist
  return contentStore.watchlist.filter(w => w.content_type === filter.value)
})

async function remove(id: string) {
  await contentStore.removeFromWatchlist(id)
  toast.success('Retiré de la watchlist')
}
</script>

<template>
  <div class="list-page container">
    <div class="page-header">
      <h1 class="page-title">Ma Watchlist</h1>
      <div class="filter-tabs">
        <button class="filter-tab" :class="{ active: filter === 'all' }" @click="filter = 'all'">Tout</button>
        <button class="filter-tab" :class="{ active: filter === 'movie' }" @click="filter = 'movie'">Films</button>
        <button class="filter-tab" :class="{ active: filter === 'series' }" @click="filter = 'series'">Séries</button>
      </div>
    </div>

    <div v-if="loading" class="loading-state"><div class="spinner"></div></div>

    <div v-else-if="filtered.length === 0" class="empty-state">
      <div class="empty-icon">⏱</div>
      <h3>Watchlist vide</h3>
      <p>Ajoutez des films et séries à regarder plus tard</p>
      <RouterLink to="/" class="btn btn-primary" style="margin-top:16px">Découvrir du contenu</RouterLink>
    </div>

    <div v-else class="content-grid">
      <div v-for="item in filtered" :key="item.id" class="list-item card">
        <RouterLink :to="{ name: item.content_type === 'movie' ? 'movie-detail' : 'series-detail', params: { id: item.content_id } }" class="list-item-link">
          <div class="list-item-image">
            <img :src="item.content?.image || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'" :alt="item.content?.titre" />
          </div>
          <div class="list-item-info">
            <div class="list-item-type">{{ item.content_type === 'movie' ? 'Film' : 'Série' }}</div>
            <h3 class="list-item-title">{{ item.content?.titre || 'Contenu inconnu' }}</h3>
            <div class="list-item-meta">
              <span v-if="item.content?.note" class="list-item-note">
                <svg viewBox="0 0 24 24" fill="#f5c518" width="12" height="12"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {{ item.content.note.toFixed(1) }}
              </span>
              <span class="list-item-date">Ajouté {{ new Date(item.date_ajout).toLocaleDateString('fr-FR') }}</span>
            </div>
          </div>
        </RouterLink>
        <button class="remove-btn" @click="remove(item.id)" title="Retirer de la watchlist">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-page { padding: 40px 24px 80px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
.page-title { font-size: 28px; font-weight: 700; }
.filter-tabs { display: flex; gap: 6px; background: var(--color-bg-3); padding: 4px; border-radius: var(--radius-md); }
.filter-tab { padding: 8px 16px; border-radius: var(--radius-sm); background: none; border: none; color: var(--color-text-muted); font-size: 14px; font-weight: 500; transition: all var(--transition); }
.filter-tab.active { background: var(--color-bg-card); color: var(--color-text); box-shadow: var(--shadow-sm); }
.loading-state { display: flex; justify-content: center; padding: 80px 0; }
.empty-state { text-align: center; padding: 80px 0; }
.empty-icon { font-size: 48px; margin-bottom: 16px; }
.empty-state h3 { font-size: 20px; color: var(--color-text-secondary); margin-bottom: 8px; }
.empty-state p { color: var(--color-text-muted); }
.content-grid { display: grid; gap: 12px; }
.list-item { display: flex; align-items: center; gap: 0; position: relative; transition: border-color var(--transition); }
.list-item:hover { border-color: var(--color-border-light); }
.list-item-link { display: flex; align-items: center; gap: 16px; flex: 1; padding: 12px; }
.list-item-image { width: 70px; height: 100px; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0; }
.list-item-image img { width: 100%; height: 100%; object-fit: cover; }
.list-item-info { flex: 1; }
.list-item-type { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-accent); font-weight: 600; margin-bottom: 6px; }
.list-item-title { font-size: 15px; font-weight: 600; margin-bottom: 8px; }
.list-item-meta { display: flex; gap: 12px; align-items: center; }
.list-item-note { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #f5c518; font-weight: 500; }
.list-item-date { font-size: 12px; color: var(--color-text-muted); }
.remove-btn { padding: 12px; margin-right: 4px; background: none; border: none; color: var(--color-text-muted); border-radius: var(--radius-sm); transition: all var(--transition); flex-shrink: 0; }
.remove-btn:hover { background: rgba(231,76,60,0.15); color: var(--color-error); }
</style>
