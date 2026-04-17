import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

export interface Category {
  id: string
  nom: string
  description: string
}

export interface Movie {
  id: string
  titre: string
  description: string
  date_sortie: string
  note: number
  image: string | null
  category_id: string | null
  categories?: Category
  user_notes?: UserNote[]
  date_creation: string
}

export interface Serie {
  id: string
  titre: string
  description: string
  date_sortie: string
  note: number
  image: string | null
  category_id: string | null
  categories?: Category
  user_notes?: UserNote[]
  date_creation: string
}

export interface UserNote {
  id: string
  user_id: string
  content_type: 'movie' | 'series'
  content_id: string
  note: number
  commentaire: string
  date_creation: string
  users?: { nom: string; prenom: string; avatar: string | null }
}

export interface FavoriteItem {
  id: string
  user_id: string
  content_type: 'movie' | 'series'
  content_id: string
  date_ajout: string
  content?: Movie | Serie
}

export interface HistoryItem {
  id: string
  user_id: string
  content_type: 'movie' | 'series'
  content_id: string
  visited_at: string
  content?: Movie | Serie
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const useContentStore = defineStore('content', () => {
  const categories = ref<Category[]>([])
  const favorites = ref<FavoriteItem[]>([])
  const watchlist = ref<FavoriteItem[]>([])
  const myNotes = ref<UserNote[]>([])
  const history = ref<HistoryItem[]>([])

  async function fetchCategories() {
    const { data } = await api.get('/categories')
    categories.value = data
    return data
  }

  async function fetchMovies(params: Record<string, any> = {}) {
    const { data } = await api.get('/movies', { params })
    return data as PaginatedResponse<Movie>
  }

  async function fetchMovie(id: string) {
    const { data } = await api.get(`/movies/${id}`)
    return data as Movie
  }

  async function fetchSeries(params: Record<string, any> = {}) {
    const { data } = await api.get('/series', { params })
    return data as PaginatedResponse<Serie>
  }

  async function fetchSerie(id: string) {
    const { data } = await api.get(`/series/${id}`)
    return data as Serie
  }

  async function fetchFavorites() {
    const { data } = await api.get('/favorites')
    favorites.value = data
    return data
  }

  async function addFavorite(content_type: string, content_id: string) {
    const { data } = await api.post('/favorites', { content_type, content_id })
    await fetchFavorites()
    return data
  }

  async function removeFavorite(id: string) {
    await api.delete(`/favorites/${id}`)
    favorites.value = favorites.value.filter(f => f.id !== id)
  }

  async function checkFavorite(content_type: string, content_id: string) {
    const { data } = await api.get('/favorites/check', { params: { content_type, content_id } })
    return data as { isFavorite: boolean; favoriteId: string | null }
  }

  async function fetchWatchlist() {
    const { data } = await api.get('/watchlist')
    watchlist.value = data
    return data
  }

  async function addToWatchlist(content_type: string, content_id: string) {
    const { data } = await api.post('/watchlist', { content_type, content_id })
    await fetchWatchlist()
    return data
  }

  async function removeFromWatchlist(id: string) {
    await api.delete(`/watchlist/${id}`)
    watchlist.value = watchlist.value.filter(w => w.id !== id)
  }

  async function checkWatchlist(content_type: string, content_id: string) {
    const { data } = await api.get('/watchlist/check', { params: { content_type, content_id } })
    return data as { isInWatchlist: boolean; watchlistId: string | null }
  }

  async function fetchMyNotes() {
    const { data } = await api.get('/notes')
    myNotes.value = data
    return data
  }

  async function addNote(content_type: string, content_id: string, note: number, commentaire: string) {
    const { data } = await api.post('/notes', { content_type, content_id, note, commentaire })
    return data
  }

  async function deleteNote(id: string) {
    await api.delete(`/notes/${id}`)
    myNotes.value = myNotes.value.filter(n => n.id !== id)
  }

  async function getNoteForContent(content_type: string, content_id: string) {
    const { data } = await api.get('/notes/content', { params: { content_type, content_id } })
    return data as UserNote | null
  }

  async function fetchHistory(params: { limit?: number; offset?: number } = {}) {
    const { data } = await api.get('/history', { params })
    history.value = data
    return data as HistoryItem[]
  }

  async function addToHistory(content_type: string, content_id: string) {
    const { data } = await api.post('/history', { content_type, content_id })
    return data as HistoryItem
  }

  async function removeFromHistory(id: string) {
    await api.delete(`/history/${id}`)
    history.value = history.value.filter(h => h.id !== id)
  }

  async function clearHistory() {
    await api.delete('/history/clear')
    history.value = []
  }

  return {
    categories,
    favorites,
    watchlist,
    myNotes,
    history,
    fetchCategories,
    fetchMovies,
    fetchMovie,
    fetchSeries,
    fetchSerie,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite,
    fetchWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    checkWatchlist,
    fetchMyNotes,
    addNote,
    deleteNote,
    getNoteForContent,
    fetchHistory,
    addToHistory,
    removeFromHistory,
    clearHistory
  }
})
