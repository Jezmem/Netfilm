<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useContentStore } from '@/stores/content'
import api from '@/api'
import Modal from '@/components/Modal.vue'
import { toast } from 'vue3-toastify'
import type { Movie } from '@/stores/content'

const contentStore = useContentStore()
const movies = ref<Movie[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingMovie = ref<Movie | null>(null)
const submitting = ref(false)
const search = ref('')
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const form = ref({
  titre: '',
  description: '',
  date_sortie: '',
  note: '',
  image: '',
  category_id: ''
})

onMounted(async () => {
  await Promise.all([loadMovies(), contentStore.fetchCategories()])
  loading.value = false
})

async function loadMovies() {
  const result = await contentStore.fetchMovies({ limit: 100 })
  movies.value = result.data
}

const filtered = computed(() => {
  if (!search.value) return movies.value
  return movies.value.filter(m => m.titre.toLowerCase().includes(search.value.toLowerCase()))
})

function openCreate() {
  editingMovie.value = null
  form.value = { titre: '', description: '', date_sortie: '', note: '', image: '', category_id: '' }
  imageFile.value = null
  imagePreview.value = null
  showModal.value = true
}

function openEdit(movie: Movie) {
  editingMovie.value = movie
  form.value = {
    titre: movie.titre,
    description: movie.description || '',
    date_sortie: movie.date_sortie ? movie.date_sortie.substring(0, 10) : '',
    note: String(movie.note || ''),
    image: movie.image || '',
    category_id: movie.category_id || ''
  }
  imageFile.value = null
  imagePreview.value = movie.image || null
  showModal.value = true
}

function handleImageFile(file: File) {
  if (!file.type.startsWith('image/')) { toast.error('Fichier invalide'); return }
  imageFile.value = file
  const reader = new FileReader()
  reader.onload = e => { imagePreview.value = e.target?.result as string }
  reader.readAsDataURL(file)
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) handleImageFile(file)
}

async function handleSubmit() {
  if (!form.value.titre) { toast.error('Le titre est requis'); return }
  submitting.value = true
  try {
    const formData = new FormData()
    Object.entries(form.value).forEach(([k, v]) => { if (v) formData.append(k, v) })
    if (imageFile.value) formData.append('image', imageFile.value)

    if (editingMovie.value) {
      await api.put(`/movies/${editingMovie.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Film mis à jour')
    } else {
      await api.post('/movies', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Film créé')
    }
    showModal.value = false
    await loadMovies()
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'Erreur lors de l\'enregistrement')
  } finally {
    submitting.value = false
  }
}

async function deleteMovie(movie: Movie) {
  if (!confirm(`Supprimer "${movie.titre}" ?`)) return
  try {
    await api.delete(`/movies/${movie.id}`)
    movies.value = movies.value.filter(m => m.id !== movie.id)
    toast.success('Film supprimé')
  } catch {
    toast.error('Erreur lors de la suppression')
  }
}
</script>

<template>
  <div class="admin-movies">
    <div class="admin-page-header">
      <div>
        <h1 class="page-title">Gestion des Films</h1>
        <p class="page-sub">{{ movies.length }} films au total</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19 13H13v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        Ajouter un film
      </button>
    </div>

    <div class="search-bar card">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input v-model="search" type="text" placeholder="Rechercher..." class="search-input" />
    </div>

    <div v-if="loading" class="loading-state"><div class="spinner"></div></div>

    <div v-else class="data-table card">
      <table>
        <thead>
          <tr>
            <th>Affiche</th>
            <th>Titre</th>
            <th>Catégorie</th>
            <th>Note</th>
            <th>Date sortie</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movie in filtered" :key="movie.id">
            <td>
              <div class="table-thumb">
                <img :src="movie.image || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'" :alt="movie.titre" />
              </div>
            </td>
            <td><span class="table-title">{{ movie.titre }}</span></td>
            <td><span class="badge badge-primary" v-if="movie.categories">{{ movie.categories.nom }}</span><span v-else class="text-muted">—</span></td>
            <td>
              <span class="note-badge" v-if="movie.note">
                <svg viewBox="0 0 24 24" fill="#f5c518" width="12" height="12"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {{ movie.note.toFixed(1) }}
              </span>
              <span v-else class="text-muted">—</span>
            </td>
            <td><span class="text-muted">{{ movie.date_sortie ? new Date(movie.date_sortie).toLocaleDateString('fr-FR') : '—' }}</span></td>
            <td>
              <div class="table-actions">
                <button class="action-btn edit-btn" @click="openEdit(movie)">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                </button>
                <button class="action-btn delete-btn" @click="deleteMovie(movie)">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="6" class="empty-row">Aucun film trouvé</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="showModal" :title="editingMovie ? 'Modifier le film' : 'Ajouter un film'" size="lg" @close="showModal = false">
      <div class="movie-form">
        <div class="form-row">
          <div class="form-group" style="flex: 2">
            <label class="form-label">Titre *</label>
            <input v-model="form.titre" type="text" class="form-input" placeholder="Titre du film" />
          </div>
          <div class="form-group">
            <label class="form-label">Catégorie</label>
            <select v-model="form.category_id" class="form-input">
              <option value="">Sélectionner</option>
              <option v-for="cat in contentStore.categories" :key="cat.id" :value="cat.id">{{ cat.nom }}</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea v-model="form.description" class="form-input" rows="3" placeholder="Synopsis du film..."></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Date de sortie</label>
            <input v-model="form.date_sortie" type="date" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Note (0-10)</label>
            <input v-model="form.note" type="number" min="0" max="10" step="0.1" class="form-input" placeholder="8.5" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Image URL (optionnel si upload)</label>
          <input v-model="form.image" type="url" class="form-input" placeholder="https://..." />
        </div>

        <div class="form-group">
          <label class="form-label">Upload d'affiche</label>
          <div
            class="drop-zone"
            :class="{ dragging: isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="handleDrop"
            @click="fileInputRef?.click()"
          >
            <div v-if="imagePreview" class="preview-container">
              <img :src="imagePreview" alt="Preview" class="preview-img" />
              <span class="preview-change">Cliquer pour changer</span>
            </div>
            <div v-else class="drop-placeholder">
              <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" style="color: var(--color-text-muted)">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
              <p>Glisser-déposer ou cliquer pour uploader</p>
              <span>JPG, PNG, WebP — max 5MB</span>
            </div>
            <input ref="fileInputRef" type="file" accept="image/*" style="display:none" @change="e => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) handleImageFile(f) }" />
          </div>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-ghost" @click="showModal = false">Annuler</button>
        <button class="btn btn-primary" :disabled="submitting" @click="handleSubmit">
          {{ submitting ? 'Enregistrement...' : editingMovie ? 'Mettre à jour' : 'Créer le film' }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.admin-movies { max-width: 1200px; }
.admin-page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 700; }
.page-sub { color: var(--color-text-muted); font-size: 13px; margin-top: 4px; }
.search-bar { display: flex; align-items: center; gap: 12px; padding: 12px 16px; margin-bottom: 16px; }
.search-input { flex: 1; background: none; border: none; outline: none; color: var(--color-text); font-size: 14px; }
.loading-state { display: flex; justify-content: center; padding: 60px 0; }
.data-table { overflow: auto; }
table { width: 100%; border-collapse: collapse; }
th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--color-border); }
td { padding: 12px 16px; border-bottom: 1px solid var(--color-border); vertical-align: middle; }
tr:last-child td { border-bottom: none; }
.table-thumb { width: 40px; height: 56px; border-radius: 4px; overflow: hidden; }
.table-thumb img { width: 100%; height: 100%; object-fit: cover; }
.table-title { font-size: 14px; font-weight: 500; }
.text-muted { color: var(--color-text-muted); font-size: 13px; }
.note-badge { display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 500; color: #f5c518; }
.table-actions { display: flex; gap: 8px; }
.action-btn { width: 32px; height: 32px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); background: none; display: flex; align-items: center; justify-content: center; transition: all var(--transition); cursor: pointer; }
.edit-btn { color: var(--color-text-muted); }
.edit-btn:hover { background: rgba(52,152,219,0.15); color: #3498db; border-color: #3498db; }
.delete-btn { color: var(--color-text-muted); }
.delete-btn:hover { background: rgba(231,76,60,0.15); color: var(--color-error); border-color: var(--color-error); }
.empty-row { text-align: center; color: var(--color-text-muted); padding: 40px; font-size: 14px; }
.movie-form { display: flex; flex-direction: column; gap: 4px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.drop-zone {
  border: 2px dashed var(--color-border-light);
  border-radius: var(--radius-md);
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition);
  background: var(--color-bg-3);
}
.drop-zone:hover, .drop-zone.dragging { border-color: var(--color-primary); background: rgba(229,9,20,0.05); }
.drop-placeholder p { font-size: 14px; color: var(--color-text-secondary); margin: 8px 0 4px; }
.drop-placeholder span { font-size: 12px; color: var(--color-text-muted); }
.preview-container { position: relative; display: inline-block; }
.preview-img { max-height: 120px; border-radius: var(--radius-sm); }
.preview-change { display: block; font-size: 12px; color: var(--color-text-muted); margin-top: 8px; }
</style>
