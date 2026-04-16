<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useContentStore } from '@/stores/content'
import api from '@/api'
import Modal from '@/components/Modal.vue'
import { toast } from 'vue3-toastify'
import type { Category } from '@/stores/content'

const contentStore = useContentStore()
const loading = ref(true)
const showModal = ref(false)
const editingCat = ref<Category | null>(null)
const submitting = ref(false)
const form = ref({ nom: '', description: '' })

onMounted(async () => {
  await contentStore.fetchCategories()
  loading.value = false
})

function openCreate() {
  editingCat.value = null
  form.value = { nom: '', description: '' }
  showModal.value = true
}

function openEdit(cat: Category) {
  editingCat.value = cat
  form.value = { nom: cat.nom, description: cat.description || '' }
  showModal.value = true
}

async function handleSubmit() {
  if (!form.value.nom) { toast.error('Le nom est requis'); return }
  submitting.value = true
  try {
    if (editingCat.value) {
      await api.put(`/categories/${editingCat.value.id}`, form.value)
      toast.success('Catégorie mise à jour')
    } else {
      await api.post('/categories', form.value)
      toast.success('Catégorie créée')
    }
    showModal.value = false
    await contentStore.fetchCategories()
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'Erreur lors de l\'enregistrement')
  } finally {
    submitting.value = false
  }
}

async function deleteCategory(cat: Category) {
  if (!confirm(`Supprimer la catégorie "${cat.nom}" ?`)) return
  try {
    await api.delete(`/categories/${cat.id}`)
    await contentStore.fetchCategories()
    toast.success('Catégorie supprimée')
  } catch {
    toast.error('Erreur lors de la suppression')
  }
}
</script>

<template>
  <div class="admin-categories">
    <div class="admin-page-header">
      <div>
        <h1 class="page-title">Gestion des Catégories</h1>
        <p class="page-sub">{{ contentStore.categories.length }} catégories</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19 13H13v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        Ajouter une catégorie
      </button>
    </div>

    <div v-if="loading" class="loading-state"><div class="spinner"></div></div>

    <div v-else class="categories-grid">
      <div v-for="cat in contentStore.categories" :key="cat.id" class="cat-card card">
        <div class="cat-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
          </svg>
        </div>
        <div class="cat-info">
          <h3 class="cat-name">{{ cat.nom }}</h3>
          <p v-if="cat.description" class="cat-desc">{{ cat.description }}</p>
        </div>
        <div class="cat-actions">
          <button class="action-btn edit-btn" @click="openEdit(cat)">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="action-btn delete-btn" @click="deleteCategory(cat)">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </div>
    </div>

    <Modal v-if="showModal" :title="editingCat ? 'Modifier la catégorie' : 'Nouvelle catégorie'" size="sm" @close="showModal = false">
      <div class="form-group">
        <label class="form-label">Nom *</label>
        <input v-model="form.nom" type="text" class="form-input" placeholder="Action, Drame..." />
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea v-model="form.description" class="form-input" rows="3" placeholder="Description de la catégorie..."></textarea>
      </div>
      <template #footer>
        <button class="btn btn-ghost" @click="showModal = false">Annuler</button>
        <button class="btn btn-primary" :disabled="submitting" @click="handleSubmit">
          {{ submitting ? 'Enregistrement...' : editingCat ? 'Mettre à jour' : 'Créer' }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.admin-categories { max-width: 900px; }
.admin-page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; }
.page-title { font-size: 24px; font-weight: 700; }
.page-sub { color: var(--color-text-muted); font-size: 13px; margin-top: 4px; }
.loading-state { display: flex; justify-content: center; padding: 60px 0; }
.categories-grid { display: grid; gap: 12px; }
.cat-card { display: flex; align-items: center; gap: 16px; padding: 16px 20px; transition: border-color var(--transition); }
.cat-card:hover { border-color: var(--color-border-light); }
.cat-icon { width: 44px; height: 44px; background: rgba(229,9,20,0.1); color: var(--color-primary); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.cat-info { flex: 1; }
.cat-name { font-size: 15px; font-weight: 600; margin-bottom: 2px; }
.cat-desc { font-size: 13px; color: var(--color-text-muted); }
.cat-actions { display: flex; gap: 8px; }
.action-btn { width: 32px; height: 32px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); background: none; display: flex; align-items: center; justify-content: center; transition: all var(--transition); cursor: pointer; }
.edit-btn { color: var(--color-text-muted); }
.edit-btn:hover { background: rgba(52,152,219,0.15); color: #3498db; border-color: #3498db; }
.delete-btn { color: var(--color-text-muted); }
.delete-btn:hover { background: rgba(231,76,60,0.15); color: var(--color-error); border-color: var(--color-error); }
</style>
