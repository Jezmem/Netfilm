<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContentStore } from '@/stores/content'
import { useAuthStore } from '@/stores/auth'
import RatingStars from '@/components/RatingStars.vue'
import Modal from '@/components/Modal.vue'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'
import type { Movie } from '@/stores/content'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const contentStore = useContentStore()
const authStore = useAuthStore()

const movie = ref<Movie | null>(null)
const loading = ref(true)
const isFavorite = ref(false)
const favoriteId = ref<string | null>(null)
const isInWatchlist = ref(false)
const watchlistId = ref<string | null>(null)
const userNote = ref<any>(null)
const showNoteModal = ref(false)
const noteValue = ref(0)
const noteComment = ref('')
const submittingNote = ref(false)

async function loadData() {
  loading.value = true
  try {
    movie.value = await contentStore.fetchMovie(route.params.id as string)
    if (authStore.isAuthenticated) {
      const [favRes, watchRes, noteRes] = await Promise.all([
        contentStore.checkFavorite('movie', route.params.id as string),
        contentStore.checkWatchlist('movie', route.params.id as string),
        contentStore.getNoteForContent('movie', route.params.id as string)
      ])
      isFavorite.value = favRes.isFavorite
      favoriteId.value = favRes.favoriteId
      isInWatchlist.value = watchRes.isInWatchlist
      watchlistId.value = watchRes.watchlistId
      userNote.value = noteRes
      if (noteRes) {
        noteValue.value = noteRes.note
        noteComment.value = noteRes.commentaire || ''
      }
    }
  } finally {
    loading.value = false
  }
}

async function toggleFavorite() {
  if (!authStore.isAuthenticated) { router.push('/login'); return }
  if (isFavorite.value && favoriteId.value) {
    await contentStore.removeFavorite(favoriteId.value)
    isFavorite.value = false
    favoriteId.value = null
    toast.success(t('detail.favoriteRemoved'))
  } else {
    const data = await contentStore.addFavorite('movie', route.params.id as string)
    isFavorite.value = true
    favoriteId.value = data.id
    toast.success(t('detail.favoriteAdded'))
  }
}

async function toggleWatchlist() {
  if (!authStore.isAuthenticated) { router.push('/login'); return }
  if (isInWatchlist.value && watchlistId.value) {
    await contentStore.removeFromWatchlist(watchlistId.value)
    isInWatchlist.value = false
    watchlistId.value = null
    toast.success(t('detail.watchlistRemoved'))
  } else {
    const data = await contentStore.addToWatchlist('movie', route.params.id as string)
    isInWatchlist.value = true
    watchlistId.value = data.id
    toast.success(t('detail.watchlistAdded'))
  }
}

function openNoteModal() {
  if (!authStore.isAuthenticated) { router.push('/login'); return }
  showNoteModal.value = true
}

async function submitNote() {
  if (!noteValue.value) { toast.error(t('detail.noteRequired')); return }
  submittingNote.value = true
  try {
    const result = await contentStore.addNote('movie', route.params.id as string, noteValue.value, noteComment.value)
    userNote.value = result
    showNoteModal.value = false
    toast.success(result.updated ? t('detail.noteUpdated') : t('detail.noteAdded'))
    await loadData()
  } catch {
    toast.error(t('detail.saveError'))
  } finally {
    submittingNote.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <div class="detail-page">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>

    <template v-else-if="movie">
      <div class="detail-hero">
        <div class="hero-backdrop">
          <img :src="movie.image || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'" :alt="movie.titre" />
          <div class="hero-gradient"></div>
        </div>
        <div class="container detail-hero-content">
          <div class="detail-poster">
            <img :src="movie.image || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'" :alt="movie.titre" />
          </div>
          <div class="detail-info">
            <div class="detail-badges">
              <span class="badge badge-primary">{{ t('detail.movie') }}</span>
              <span v-if="movie.categories" class="badge badge-accent">{{ movie.categories.nom }}</span>
            </div>
            <h1 class="detail-title">{{ movie.titre }}</h1>
            <div class="detail-meta">
              <span v-if="movie.date_sortie" class="meta-item">{{ new Date(movie.date_sortie).getFullYear() }}</span>
              <div v-if="movie.note" class="meta-note">
                <svg viewBox="0 0 24 24" fill="#f5c518" width="16" height="16">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {{ movie.note.toFixed(1) }} / 10
              </div>
            </div>
            <p class="detail-description">{{ movie.description }}</p>
            <div class="detail-actions">
              <button class="btn btn-primary btn-lg" @click="toggleFavorite">
                <svg viewBox="0 0 24 24" :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" width="18" height="18">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {{ isFavorite ? t('detail.inFavorites') : t('detail.addFavorite') }}
              </button>
              <button class="btn btn-secondary btn-lg" @click="toggleWatchlist">
                <svg viewBox="0 0 24 24" :fill="isInWatchlist ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" width="18" height="18">
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                {{ isInWatchlist ? t('detail.inWatchlist') : t('detail.addWatchlist') }}
              </button>
              <button class="btn btn-ghost btn-lg" @click="openNoteModal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {{ userNote ? t('detail.editRate') : t('detail.rate') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="container detail-body">
        <section v-if="movie.user_notes && movie.user_notes.length > 0" class="reviews-section">
          <h2 class="section-title">{{ t('detail.reviews', { count: movie.user_notes.length }) }}</h2>
          <div class="reviews-grid">
            <div v-for="note in movie.user_notes" :key="note.id" class="review-card card">
              <div class="review-header">
                <div class="review-avatar">
                  <img v-if="note.users?.avatar" :src="note.users.avatar" :alt="note.users.prenom" class="review-avatar-img" />
                  <span v-else>{{ note.users?.prenom?.charAt(0) || '?' }}</span>
                </div>
                <div>
                  <div class="review-author">{{ note.users?.prenom }} {{ note.users?.nom }}</div>
                  <RatingStars :model-value="note.note" :readonly="true" size="sm" />
                </div>
                <span class="review-date">{{ new Date(note.date_creation).toLocaleDateString() }}</span>
              </div>
              <p v-if="note.commentaire" class="review-comment">{{ note.commentaire }}</p>
            </div>
          </div>
        </section>
      </div>

      <Modal v-if="showNoteModal" :title="t('detail.rateMovie')" @close="showNoteModal = false">
        <div class="note-modal">
          <p class="note-movie-title">{{ movie.titre }}</p>
          <div class="note-stars-section">
            <RatingStars v-model="noteValue" size="lg" />
            <span class="note-label">{{ noteValue > 0 ? t('detail.ratingOf', { value: noteValue }) : t('detail.chooseRating') }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('detail.comment') }}</label>
            <textarea v-model="noteComment" class="form-input" rows="4" :placeholder="t('detail.commentPlaceholder')"></textarea>
          </div>
        </div>
        <template #footer>
          <button class="btn btn-ghost" @click="showNoteModal = false">{{ t('detail.cancel') }}</button>
          <button class="btn btn-primary" :disabled="!noteValue || submittingNote" @click="submitNote">
            {{ submittingNote ? t('detail.saving') : t('detail.save') }}
          </button>
        </template>
      </Modal>
    </template>

    <div v-else class="not-found">
      <h2>{{ t('detail.movieNotFound') }}</h2>
      <button class="btn btn-primary" @click="router.push('/')">{{ t('detail.backHome') }}</button>
    </div>
  </div>
</template>

<style scoped>
.detail-page { min-height: 100vh; }
.loading-state { display: flex; justify-content: center; padding: 120px 0; }
.detail-hero { position: relative; min-height: 520px; display: flex; align-items: flex-end; overflow: hidden; }
.hero-backdrop { position: absolute; inset: 0; }
.hero-backdrop img { width: 100%; height: 100%; object-fit: cover; filter: blur(2px); }
.hero-gradient { position: absolute; inset: 0; background: linear-gradient(to right, rgba(15,15,15,0.95) 40%, rgba(15,15,15,0.6) 100%), linear-gradient(to top, var(--color-bg) 0%, transparent 60%); }
.detail-hero-content { position: relative; z-index: 1; display: flex; gap: 40px; padding: 60px 24px; align-items: flex-end; }
.detail-poster { width: 220px; flex-shrink: 0; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-lg); }
.detail-poster img { width: 100%; aspect-ratio: 2/3; object-fit: cover; }
.detail-info { flex: 1; }
.detail-badges { display: flex; gap: 8px; margin-bottom: 16px; }
.detail-title { font-size: 40px; font-weight: 700; line-height: 1.15; margin-bottom: 16px; }
.detail-meta { display: flex; gap: 16px; align-items: center; margin-bottom: 20px; }
.meta-item { color: var(--color-text-secondary); font-size: 15px; }
.meta-note { display: flex; align-items: center; gap: 6px; font-size: 16px; font-weight: 600; color: #f5c518; }
.detail-description { font-size: 15px; color: var(--color-text-secondary); line-height: 1.7; margin-bottom: 28px; max-width: 600px; }
.detail-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.detail-body { padding: 48px 24px 80px; }
.reviews-section { margin-top: 0; }
.section-title { font-size: 22px; font-weight: 700; margin-bottom: 24px; }
.reviews-grid { display: grid; gap: 16px; }
.review-card { padding: 20px; }
.review-header { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
.review-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--color-primary); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 16px; flex-shrink: 0; overflow: hidden; }
.review-avatar-img { width: 100%; height: 100%; object-fit: cover; }
.review-author { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
.review-date { margin-left: auto; font-size: 12px; color: var(--color-text-muted); }
.review-comment { font-size: 14px; color: var(--color-text-secondary); line-height: 1.6; }
.note-modal { display: flex; flex-direction: column; gap: 24px; }
.note-movie-title { font-size: 18px; font-weight: 600; color: var(--color-text); }
.note-stars-section { display: flex; align-items: center; gap: 16px; }
.note-label { font-size: 16px; color: var(--color-text-secondary); font-weight: 500; }
.not-found { text-align: center; padding: 120px 24px; }
.not-found h2 { font-size: 28px; margin-bottom: 24px; }
@media (max-width: 700px) {
  .detail-hero-content { flex-direction: column; padding: 40px 16px; }
  .detail-poster { width: 140px; }
  .detail-title { font-size: 28px; }
  .detail-actions { flex-direction: column; }
}
</style>
