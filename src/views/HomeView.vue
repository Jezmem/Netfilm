<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useContentStore } from '@/stores/content'
import ContentCard from '@/components/ContentCard.vue'
import SearchBar from '@/components/SearchBar.vue'
import type { Movie, Serie } from '@/stores/content'

const { t } = useI18n()

const route = useRoute()
const contentStore = useContentStore()

const loading = ref(false)
const movies = ref<Movie[]>([])
const series = ref<Serie[]>([])
const moviesTotal = ref(0)
const seriesTotal = ref(0)
const moviePage = ref(1)
const seriesPage = ref(1)
const PAGE_SIZE = 12

const filters = ref({
  search: '',
  category_id: '',
  note_min: '',
  sort: 'date_creation',
  order: 'desc',
  type: (route.query.type as string) || ''
})

const showMovies = computed(() => !filters.value.type || filters.value.type === 'movie')
const showSeries = computed(() => !filters.value.type || filters.value.type === 'series')

async function loadContent() {
  loading.value = true
  const params = {
    search: filters.value.search,
    category_id: filters.value.category_id,
    note_min: filters.value.note_min,
    sort: filters.value.sort,
    order: filters.value.order,
    limit: PAGE_SIZE
  }

  const promises = []

  if (showMovies.value) {
    promises.push(
      contentStore.fetchMovies({ ...params, page: moviePage.value })
        .then(r => { movies.value = r.data; moviesTotal.value = r.total })
    )
  }

  if (showSeries.value) {
    promises.push(
      contentStore.fetchSeries({ ...params, page: seriesPage.value })
        .then(r => { series.value = r.data; seriesTotal.value = r.total })
    )
  }

  await Promise.all(promises)
  loading.value = false
}

watch(filters, () => {
  moviePage.value = 1
  seriesPage.value = 1
  loadContent()
}, { deep: true })

watch(() => route.query.type, val => {
  filters.value.type = (val as string) || ''
})

onMounted(async () => {
  await contentStore.fetchCategories()
  await loadContent()
})

const moviePages = computed(() => Math.ceil(moviesTotal.value / PAGE_SIZE))
const seriesPages = computed(() => Math.ceil(seriesTotal.value / PAGE_SIZE))

async function goMoviePage(p: number) {
  moviePage.value = p
  await loadContent()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function goSeriesPage(p: number) {
  seriesPage.value = p
  await loadContent()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-bg">
        <img src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg" alt="" />
        <div class="hero-overlay"></div>
      </div>
      <div class="container hero-content">
        <div class="hero-badge">{{ t('home.hero.discover') }}</div>
        <h1 class="hero-title">{{ t('home.hero.tagline') }}</h1>
        <p class="hero-sub">{{ t('home.hero.subtitle') }}</p>
      </div>
    </section>

    <div class="container content-section">
      <div class="search-section">
        <SearchBar v-model="filters" :categories="contentStore.categories" @search="() => {}" />
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <template v-else>
        <section v-if="showMovies && movies.length > 0" class="content-block">
          <div class="section-header">
            <h2 class="section-title">
              <span class="section-accent">{{ t('home.movies') }}</span>
              <span class="section-count">{{ t('home.results', { count: moviesTotal }) }}</span>
            </h2>
          </div>
          <div class="content-grid">
            <ContentCard v-for="movie in movies" :key="movie.id" :item="movie" type="movie" />
          </div>
          <div v-if="moviePages > 1" class="pagination">
            <button class="page-btn" :disabled="moviePage === 1" @click="goMoviePage(moviePage - 1)">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            </button>
            <button
              v-for="p in moviePages"
              :key="p"
              class="page-btn"
              :class="{ active: p === moviePage }"
              @click="goMoviePage(p)"
            >{{ p }}</button>
            <button class="page-btn" :disabled="moviePage === moviePages" @click="goMoviePage(moviePage + 1)">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            </button>
          </div>
        </section>

        <section v-if="showSeries && series.length > 0" class="content-block">
          <div class="section-header">
            <h2 class="section-title">
              <span class="section-accent">{{ t('home.series') }}</span>
              <span class="section-count">{{ t('home.results', { count: seriesTotal }) }}</span>
            </h2>
          </div>
          <div class="content-grid">
            <ContentCard v-for="serie in series" :key="serie.id" :item="serie" type="series" />
          </div>
          <div v-if="seriesPages > 1" class="pagination">
            <button class="page-btn" :disabled="seriesPage === 1" @click="goSeriesPage(seriesPage - 1)">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            </button>
            <button
              v-for="p in seriesPages"
              :key="p"
              class="page-btn"
              :class="{ active: p === seriesPage }"
              @click="goSeriesPage(p)"
            >{{ p }}</button>
            <button class="page-btn" :disabled="seriesPage === seriesPages" @click="goSeriesPage(seriesPage + 1)">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            </button>
          </div>
        </section>

        <div v-if="!loading && movies.length === 0 && series.length === 0" class="empty-state">
          <div class="empty-icon">🎬</div>
          <h3>{{ t('home.noResults') }}</h3>
          <p>{{ t('home.noResultsHint') }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  height: 480px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
}
.hero-bg img {
  width: 100%; height: 100%;
  object-fit: cover;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--color-bg) 0%, rgba(15,15,15,0.7) 50%, rgba(15,15,15,0.3) 100%);
}
.hero-content {
  position: relative;
  z-index: 1;
  padding-bottom: 48px;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-primary);
  color: white;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}
.hero-title {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 16px;
}
.hero-sub {
  font-size: 16px;
  color: var(--color-text-secondary);
  max-width: 480px;
  line-height: 1.6;
}
.content-section {
  padding: 40px 24px 80px;
}
.search-section {
  margin-bottom: 40px;
}
.content-block {
  margin-bottom: 60px;
}
.section-header {
  margin-bottom: 24px;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 700;
}
.section-accent {
  color: var(--color-text);
}
.section-count {
  font-size: 14px;
  color: var(--color-text-muted);
  font-weight: 400;
}
.content-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}
.loading-state {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}
.empty-state {
  text-align: center;
  padding: 80px 0;
  color: var(--color-text-muted);
}
.empty-icon { font-size: 48px; margin-bottom: 16px; }
.empty-state h3 { font-size: 20px; color: var(--color-text-secondary); margin-bottom: 8px; }
.pagination {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-top: 32px;
}
.page-btn {
  width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  background: var(--color-bg-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition);
}
.page-btn:hover:not(:disabled) {
  background: var(--color-border-light);
  color: var(--color-text);
}
.page-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
@media (max-width: 1200px) { .content-grid { grid-template-columns: repeat(5, 1fr); } }
@media (max-width: 1000px) { .content-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 750px) { .content-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 500px) { .content-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
