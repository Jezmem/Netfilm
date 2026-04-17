import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useContentStore } from '@/stores/content'
import api from '@/api'

const mockApi = api as any

const mockMovie = {
  id: 'movie-1',
  titre: 'Inception',
  description: 'Un rêve dans un rêve',
  date_sortie: '2010-07-16',
  note: 8.8,
  image: 'https://example.com/inception.jpg',
  category_id: 'cat-1',
  date_creation: '2024-01-01'
}

const mockSerie = {
  id: 'serie-1',
  titre: 'Breaking Bad',
  description: 'Un prof de chimie',
  date_sortie: '2008-01-20',
  note: 9.5,
  image: null,
  category_id: 'cat-2',
  date_creation: '2024-01-01'
}

const mockCategory = { id: 'cat-1', nom: 'Action', description: 'Films d\'action' }

describe('useContentStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('starts with empty categories', () => {
      const store = useContentStore()
      expect(store.categories).toEqual([])
    })

    it('starts with empty favorites', () => {
      const store = useContentStore()
      expect(store.favorites).toEqual([])
    })

    it('starts with empty watchlist', () => {
      const store = useContentStore()
      expect(store.watchlist).toEqual([])
    })

    it('starts with empty myNotes', () => {
      const store = useContentStore()
      expect(store.myNotes).toEqual([])
    })
  })

  describe('fetchCategories', () => {
    it('fetches and stores categories', async () => {
      const store = useContentStore()
      mockApi.get.mockResolvedValueOnce({ data: [mockCategory] })

      const result = await store.fetchCategories()

      expect(store.categories).toHaveLength(1)
      expect(store.categories[0].nom).toBe('Action')
      expect(result).toEqual([mockCategory])
    })

    it('calls the correct endpoint', async () => {
      const store = useContentStore()
      mockApi.get.mockResolvedValueOnce({ data: [] })
      await store.fetchCategories()
      expect(mockApi.get).toHaveBeenCalledWith('/categories')
    })
  })

  describe('fetchMovies', () => {
    it('returns paginated movie data', async () => {
      const store = useContentStore()
      const paginatedResponse = { data: [mockMovie], total: 1, page: 1, limit: 12, totalPages: 1 }
      mockApi.get.mockResolvedValueOnce({ data: paginatedResponse })

      const result = await store.fetchMovies()

      expect(result.data).toHaveLength(1)
      expect(result.total).toBe(1)
      expect(result.data[0].titre).toBe('Inception')
    })

    it('passes query params to API', async () => {
      const store = useContentStore()
      mockApi.get.mockResolvedValueOnce({ data: { data: [], total: 0, page: 1, limit: 12, totalPages: 0 } })

      await store.fetchMovies({ search: 'batman', page: 2 })

      expect(mockApi.get).toHaveBeenCalledWith('/movies', { params: { search: 'batman', page: 2 } })
    })
  })

  describe('fetchMovie', () => {
    it('returns a single movie', async () => {
      const store = useContentStore()
      mockApi.get.mockResolvedValueOnce({ data: mockMovie })

      const result = await store.fetchMovie('movie-1')

      expect(result.id).toBe('movie-1')
      expect(result.titre).toBe('Inception')
    })
  })

  describe('fetchSeries', () => {
    it('returns paginated series data', async () => {
      const store = useContentStore()
      mockApi.get.mockResolvedValueOnce({ data: { data: [mockSerie], total: 1, page: 1, limit: 12, totalPages: 1 } })

      const result = await store.fetchSeries()

      expect(result.data[0].titre).toBe('Breaking Bad')
    })
  })

  describe('fetchSerie', () => {
    it('returns a single serie', async () => {
      const store = useContentStore()
      mockApi.get.mockResolvedValueOnce({ data: mockSerie })

      const result = await store.fetchSerie('serie-1')

      expect(result.titre).toBe('Breaking Bad')
    })
  })

  describe('favorites', () => {
    it('fetchFavorites stores and returns data', async () => {
      const store = useContentStore()
      const favItem = { id: 'fav-1', user_id: 'u-1', content_type: 'movie', content_id: 'movie-1', date_ajout: '' }
      mockApi.get.mockResolvedValueOnce({ data: [favItem] })

      await store.fetchFavorites()

      expect(store.favorites).toHaveLength(1)
      expect(store.favorites[0].id).toBe('fav-1')
    })

    it('addFavorite calls correct endpoint then refreshes', async () => {
      const store = useContentStore()
      mockApi.post.mockResolvedValueOnce({ data: { id: 'fav-2' } })
      mockApi.get.mockResolvedValueOnce({ data: [] })

      await store.addFavorite('movie', 'movie-1')

      expect(mockApi.post).toHaveBeenCalledWith('/favorites', { content_type: 'movie', content_id: 'movie-1' })
    })

    it('removeFavorite removes item from local state', async () => {
      const store = useContentStore()
      store.favorites = [
        { id: 'fav-1', user_id: 'u', content_type: 'movie', content_id: 'm', date_ajout: '' },
        { id: 'fav-2', user_id: 'u', content_type: 'series', content_id: 's', date_ajout: '' }
      ]
      mockApi.delete.mockResolvedValueOnce({})

      await store.removeFavorite('fav-1')

      expect(store.favorites).toHaveLength(1)
      expect(store.favorites[0].id).toBe('fav-2')
    })

    it('checkFavorite returns status', async () => {
      const store = useContentStore()
      mockApi.get.mockResolvedValueOnce({ data: { isFavorite: true, favoriteId: 'fav-1' } })

      const result = await store.checkFavorite('movie', 'movie-1')

      expect(result.isFavorite).toBe(true)
      expect(result.favoriteId).toBe('fav-1')
    })
  })

  describe('watchlist', () => {
    it('addToWatchlist calls correct endpoint', async () => {
      const store = useContentStore()
      mockApi.post.mockResolvedValueOnce({ data: { id: 'wl-1' } })
      mockApi.get.mockResolvedValueOnce({ data: [] })

      await store.addToWatchlist('series', 'serie-1')

      expect(mockApi.post).toHaveBeenCalledWith('/watchlist', { content_type: 'series', content_id: 'serie-1' })
    })

    it('removeFromWatchlist removes item locally', async () => {
      const store = useContentStore()
      store.watchlist = [
        { id: 'wl-1', user_id: 'u', content_type: 'movie', content_id: 'm', date_ajout: '' }
      ]
      mockApi.delete.mockResolvedValueOnce({})

      await store.removeFromWatchlist('wl-1')

      expect(store.watchlist).toHaveLength(0)
    })
  })

  describe('notes', () => {
    it('fetchMyNotes stores and returns notes', async () => {
      const store = useContentStore()
      const note = { id: 'n-1', user_id: 'u', content_type: 'movie', content_id: 'm', note: 4, commentaire: 'Bien', date_creation: '' }
      mockApi.get.mockResolvedValueOnce({ data: [note] })

      await store.fetchMyNotes()

      expect(store.myNotes).toHaveLength(1)
      expect(store.myNotes[0].note).toBe(4)
    })

    it('addNote calls correct endpoint', async () => {
      const store = useContentStore()
      mockApi.post.mockResolvedValueOnce({ data: { id: 'n-2' } })

      await store.addNote('movie', 'movie-1', 5, 'Excellent')

      expect(mockApi.post).toHaveBeenCalledWith('/notes', {
        content_type: 'movie',
        content_id: 'movie-1',
        note: 5,
        commentaire: 'Excellent'
      })
    })

    it('deleteNote removes item from myNotes', async () => {
      const store = useContentStore()
      store.myNotes = [
        { id: 'n-1', user_id: 'u', content_type: 'movie', content_id: 'm', note: 3, commentaire: '', date_creation: '' }
      ]
      mockApi.delete.mockResolvedValueOnce({})

      await store.deleteNote('n-1')

      expect(store.myNotes).toHaveLength(0)
    })
  })
})
