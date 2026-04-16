<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'

const stats = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  const { data } = await api.get('/user/stats')
  stats.value = data
  loading.value = false
})
</script>

<template>
  <div class="dashboard">
    <div class="page-header">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">Vue d'ensemble de la plateforme</p>
    </div>

    <div v-if="loading" class="loading-state"><div class="spinner"></div></div>

    <template v-else-if="stats">
      <div class="stats-grid">
        <div class="stat-card card">
          <div class="stat-icon stat-users">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalUsers }}</div>
            <div class="stat-label">Utilisateurs</div>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-icon stat-movies">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalMovies }}</div>
            <div class="stat-label">Films</div>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-icon stat-series">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalSeries }}</div>
            <div class="stat-label">Séries</div>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-icon stat-notes">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalNotes }}</div>
            <div class="stat-label">Avis utilisateurs</div>
          </div>
        </div>
      </div>

      <div class="top-content-grid">
        <div class="top-content card">
          <h3 class="card-title">Top Films</h3>
          <div class="top-list">
            <div v-for="(movie, i) in stats.topMovies" :key="movie.id" class="top-item">
              <span class="top-rank">{{ i + 1 }}</span>
              <div class="top-thumb">
                <img :src="movie.image || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'" :alt="movie.titre" />
              </div>
              <div class="top-info">
                <div class="top-name">{{ movie.titre }}</div>
              </div>
              <div class="top-note">
                <svg viewBox="0 0 24 24" fill="#f5c518" width="12" height="12"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {{ movie.note?.toFixed(1) }}
              </div>
            </div>
          </div>
        </div>

        <div class="top-content card">
          <h3 class="card-title">Top Séries</h3>
          <div class="top-list">
            <div v-for="(serie, i) in stats.topSeries" :key="serie.id" class="top-item">
              <span class="top-rank">{{ i + 1 }}</span>
              <div class="top-thumb">
                <img :src="serie.image || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'" :alt="serie.titre" />
              </div>
              <div class="top-info">
                <div class="top-name">{{ serie.titre }}</div>
              </div>
              <div class="top-note">
                <svg viewBox="0 0 24 24" fill="#f5c518" width="12" height="12"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {{ serie.note?.toFixed(1) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.dashboard { max-width: 1200px; }
.page-header { margin-bottom: 32px; }
.page-title { font-size: 26px; font-weight: 700; }
.page-subtitle { color: var(--color-text-muted); font-size: 14px; margin-top: 4px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
.stat-card { padding: 24px; display: flex; align-items: center; gap: 20px; }
.stat-icon { width: 52px; height: 52px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-users { background: rgba(46,204,113,0.15); color: var(--color-success); }
.stat-movies { background: rgba(229,9,20,0.15); color: var(--color-primary); }
.stat-series { background: rgba(245,197,24,0.15); color: var(--color-accent); }
.stat-notes { background: rgba(52,152,219,0.15); color: #3498db; }
.stat-value { font-size: 28px; font-weight: 700; }
.stat-label { font-size: 13px; color: var(--color-text-muted); margin-top: 2px; }
.loading-state { display: flex; justify-content: center; padding: 80px 0; }
.top-content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.top-content { padding: 24px; }
.card-title { font-size: 16px; font-weight: 700; margin-bottom: 20px; }
.top-list { display: flex; flex-direction: column; gap: 12px; }
.top-item { display: flex; align-items: center; gap: 14px; }
.top-rank { width: 24px; font-size: 16px; font-weight: 700; color: var(--color-text-muted); text-align: center; flex-shrink: 0; }
.top-thumb { width: 38px; height: 54px; border-radius: 4px; overflow: hidden; flex-shrink: 0; }
.top-thumb img { width: 100%; height: 100%; object-fit: cover; }
.top-info { flex: 1; }
.top-name { font-size: 14px; font-weight: 500; }
.top-note { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #f5c518; font-weight: 600; }
@media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .stats-grid { grid-template-columns: 1fr; } .top-content-grid { grid-template-columns: 1fr; } }
</style>
