<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useContentStore } from '@/stores/content'
import { toast } from 'vue3-toastify'

const contentStore = useContentStore()
const loading = ref(true)
const filter = ref<'all' | 'movie' | 'series'>('all')
const clearConfirm = ref(false)

onMounted(async () => {
  await contentStore.fetchHistory()
  loading.value = false
})

const filtered = computed(() => {
  if (filter.value === 'all') return contentStore.history
  return contentStore.history.filter(h => h.content_type === filter.value)
})

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `Il y a ${minutes} min`
  if (hours < 24) return `Il y a ${hours} h`
  if (days < 7) return `Il y a ${days} jour${days > 1 ? 's' : ''}`
  return date.toLocaleDateString('fr-FR')
}

async function remove(id: string) {
  await contentStore.removeFromHistory(id)
  toast.success('Entrée supprimée')
}

async function confirmClear() {
  await contentStore.clearHistory()
  clearConfirm.value = false
  toast.success('Historique effacé')
}
</script>

<template>
  <div class="list-page container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">Historique</h1>
        <span v-if="!loading" class="history-count">{{ contentStore.history.length }} élément{{ contentStore.history.length !== 1 ? 's' : '' }}</span>
      </div>
      <div class="header-actions">
        <div class="filter-tabs">
          <button class="filter-tab" :class="{ active: filter === 'all' }" @click="filter = 'all'">Tout</button>
          <button class="filter-tab" :class="{ active: filter === 'movie' }" @click="filter = 'movie'">Films</button>
          <button class="filter-tab" :class="{ active: filter === 'series' }" @click="filter = 'series'">Séries</button>
        </div>
        <button
          v-if="contentStore.history.length > 0"
          class="btn btn-ghost btn-sm clear-btn"
          @click="clearConfirm = true"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
          </svg>
          Effacer l'historique
        </button>
      </div>
    </div>

    <div v-if="clearConfirm" class="confirm-banner">
      <span>Voulez-vous vraiment effacer tout l'historique ?</span>
      <div class="confirm-actions">
        <button class="btn btn-ghost btn-sm" @click="clearConfirm = false">Annuler</button>
        <button class="btn btn-sm btn-danger" @click="confirmClear">Confirmer</button>
      </div>
    </div>

    <div v-if="loading" class="loading-state"><div class="spinner"></div></div>

    <div v-else-if="filtered.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="56" height="56">
          <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
        </svg>
      </div>
      <h3>Aucun historique</h3>
      <p>Les films et séries que vous consultez apparaîtront ici</p>
      <RouterLink to="/" class="btn btn-primary" style="margin-top:16px">Découvrir du contenu</RouterLink>
    </div>

    <div v-else class="content-grid">
      <div v-for="entry in filtered" :key="entry.id" class="list-item card">
        <RouterLink
          :to="{ name: entry.content_type === 'movie' ? 'movie-detail' : 'series-detail', params: { id: entry.content_id } }"
          class="list-item-link"
        >
          <div class="list-item-image">
            <img
              :src="entry.content?.image || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'"
              :alt="entry.content?.titre"
              loading="lazy"
            />
          </div>
          <div class="list-item-info">
            <div class="list-item-type">{{ entry.content_type === 'movie' ? 'Film' : 'Série' }}</div>
            <h3 class="list-item-title">{{ entry.content?.titre || 'Contenu inconnu' }}</h3>
            <div class="list-item-meta">
              <span v-if="entry.content?.note" class="list-item-note">
                <svg viewBox="0 0 24 24" fill="#f5c518" width="12" height="12">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {{ entry.content.note.toFixed(1) }}
              </span>
              <span v-if="entry.content?.categories" class="list-item-category">{{ entry.content.categories.nom }}</span>
              <span class="list-item-date">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                  <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                </svg>
                {{ formatDate(entry.visited_at) }}
              </span>
            </div>
          </div>
        </RouterLink>
        <button class="remove-btn" @click="remove(entry.id)" title="Retirer de l'historique">
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
.header-left { display: flex; align-items: baseline; gap: 12px; }
.page-title { font-size: 28px; font-weight: 700; }
.history-count { font-size: 14px; color: var(--color-text-muted); }
.header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.filter-tabs { display: flex; gap: 6px; background: var(--color-bg-3); padding: 4px; border-radius: var(--radius-md); }
.filter-tab { padding: 8px 16px; border-radius: var(--radius-sm); background: none; border: none; color: var(--color-text-muted); font-size: 14px; font-weight: 500; transition: all var(--transition); cursor: pointer; }
.filter-tab.active { background: var(--color-bg-card); color: var(--color-text); box-shadow: var(--shadow-sm); }
.clear-btn { color: var(--color-text-muted); display: flex; align-items: center; gap: 6px; }
.clear-btn:hover { color: var(--color-error); }
.confirm-banner { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 20px; background: rgba(231,76,60,0.1); border: 1px solid rgba(231,76,60,0.3); border-radius: var(--radius-md); margin-bottom: 24px; font-size: 14px; flex-wrap: wrap; }
.confirm-actions { display: flex; gap: 8px; }
.btn-danger { background: var(--color-error); color: white; border: none; border-radius: var(--radius-sm); padding: 8px 16px; font-size: 14px; font-weight: 500; cursor: pointer; transition: opacity var(--transition); }
.btn-danger:hover { opacity: 0.85; }
.loading-state { display: flex; justify-content: center; padding: 80px 0; }
.empty-state { text-align: center; padding: 80px 0; }
.empty-icon { display: flex; justify-content: center; margin-bottom: 16px; color: var(--color-text-muted); }
.empty-state h3 { font-size: 20px; color: var(--color-text-secondary); margin-bottom: 8px; }
.empty-state p { color: var(--color-text-muted); }
.content-grid { display: grid; gap: 12px; }
.list-item { display: flex; align-items: center; position: relative; transition: border-color var(--transition); }
.list-item:hover { border-color: var(--color-border-light); }
.list-item-link { display: flex; align-items: center; gap: 16px; flex: 1; padding: 12px; }
.list-item-image { width: 70px; height: 100px; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0; }
.list-item-image img { width: 100%; height: 100%; object-fit: cover; }
.list-item-info { flex: 1; }
.list-item-type { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-primary); font-weight: 600; margin-bottom: 6px; }
.list-item-title { font-size: 15px; font-weight: 600; margin-bottom: 8px; }
.list-item-meta { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.list-item-note { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #f5c518; font-weight: 500; }
.list-item-category { font-size: 12px; color: var(--color-text-muted); }
.list-item-date { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--color-text-muted); }
.remove-btn { padding: 12px; margin-right: 4px; background: none; border: none; color: var(--color-text-muted); border-radius: var(--radius-sm); transition: all var(--transition); flex-shrink: 0; cursor: pointer; }
.remove-btn:hover { background: rgba(231,76,60,0.15); color: var(--color-error); }
</style>
