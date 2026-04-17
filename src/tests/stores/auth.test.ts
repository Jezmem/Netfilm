import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import api from '@/api'

const mockApi = api as any

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('has null user by default', () => {
      const store = useAuthStore()
      expect(store.user).toBeNull()
    })

    it('reads accessToken from localStorage', () => {
      localStorage.setItem('accessToken', 'stored-token')
      const store = useAuthStore()
      expect(store.accessToken).toBe('stored-token')
    })

    it('isAuthenticated is false without user and token', () => {
      const store = useAuthStore()
      expect(store.isAuthenticated).toBe(false)
    })

    it('isAdmin is false by default', () => {
      const store = useAuthStore()
      expect(store.isAdmin).toBe(false)
    })

    it('fullName returns empty string without user', () => {
      const store = useAuthStore()
      expect(store.fullName).toBe('')
    })
  })

  describe('login', () => {
    it('stores tokens and user on success', async () => {
      const store = useAuthStore()
      mockApi.post.mockResolvedValueOnce({
        data: {
          accessToken: 'access-123',
          refreshToken: 'refresh-123',
          user: { id: '1', nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', role: 'user', avatar: null, date_creation: '2024-01-01' }
        }
      })

      const result = await store.login('jean@test.com', 'password')

      expect(result.success).toBe(true)
      expect(store.accessToken).toBe('access-123')
      expect(store.user?.email).toBe('jean@test.com')
      expect(localStorage.getItem('accessToken')).toBe('access-123')
    })

    it('returns error on failure', async () => {
      const store = useAuthStore()
      mockApi.post.mockRejectedValueOnce({
        response: { data: { error: 'Email ou mot de passe incorrect' } }
      })

      const result = await store.login('bad@test.com', 'wrongpass')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Email ou mot de passe incorrect')
      expect(store.user).toBeNull()
    })

    it('sets loading to false after completion', async () => {
      const store = useAuthStore()
      mockApi.post.mockResolvedValueOnce({
        data: { accessToken: 'a', refreshToken: 'r', user: { id: '1', nom: 'A', prenom: 'B', email: 'a@b.com', role: 'user', avatar: null, date_creation: '' } }
      })
      await store.login('a@b.com', 'password')
      expect(store.loading).toBe(false)
    })
  })

  describe('register', () => {
    it('stores tokens and user on success', async () => {
      const store = useAuthStore()
      mockApi.post.mockResolvedValueOnce({
        data: {
          accessToken: 'access-reg',
          refreshToken: 'refresh-reg',
          user: { id: '2', nom: 'Martin', prenom: 'Alice', email: 'alice@test.com', role: 'user', avatar: null, date_creation: '2024-01-01' }
        }
      })

      const result = await store.register('Martin', 'Alice', 'alice@test.com', 'password123')

      expect(result.success).toBe(true)
      expect(store.user?.nom).toBe('Martin')
      expect(localStorage.getItem('refreshToken')).toBe('refresh-reg')
    })

    it('returns error when registration fails', async () => {
      const store = useAuthStore()
      mockApi.post.mockRejectedValueOnce({
        response: { data: { error: 'Cet email est déjà utilisé' } }
      })

      const result = await store.register('A', 'B', 'exists@test.com', 'password')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Cet email est déjà utilisé')
    })
  })

  describe('logout', () => {
    it('clears user, tokens and localStorage', async () => {
      const store = useAuthStore()
      store.user = { id: '1', nom: 'A', prenom: 'B', email: 'a@b.com', role: 'user', avatar: null, date_creation: '' } as any
      store.accessToken = 'some-token'
      localStorage.setItem('accessToken', 'some-token')
      localStorage.setItem('refreshToken', 'some-refresh')

      mockApi.post.mockResolvedValueOnce({})
      await store.logout()

      expect(store.user).toBeNull()
      expect(store.accessToken).toBeNull()
      expect(localStorage.getItem('accessToken')).toBeNull()
      expect(localStorage.getItem('refreshToken')).toBeNull()
    })

    it('still clears auth even if API call fails', async () => {
      const store = useAuthStore()
      store.user = { id: '1', nom: 'A', prenom: 'B', email: 'a@b.com', role: 'user', avatar: null, date_creation: '' } as any
      mockApi.post.mockRejectedValueOnce(new Error('Network error'))

      await store.logout()

      expect(store.user).toBeNull()
    })
  })

  describe('computed properties', () => {
    it('isAuthenticated is true when token and user are set', () => {
      const store = useAuthStore()
      store.user = { id: '1', nom: 'A', prenom: 'B', email: 'a@b.com', role: 'user', avatar: null, date_creation: '' } as any
      store.accessToken = 'token'
      expect(store.isAuthenticated).toBe(true)
    })

    it('isAdmin is true when user role is admin', () => {
      const store = useAuthStore()
      store.user = { id: '1', nom: 'A', prenom: 'B', email: 'a@b.com', role: 'admin', avatar: null, date_creation: '' } as any
      expect(store.isAdmin).toBe(true)
    })

    it('isAdmin is false when user role is user', () => {
      const store = useAuthStore()
      store.user = { id: '1', nom: 'A', prenom: 'B', email: 'a@b.com', role: 'user', avatar: null, date_creation: '' } as any
      expect(store.isAdmin).toBe(false)
    })

    it('fullName returns prenom + nom', () => {
      const store = useAuthStore()
      store.user = { id: '1', nom: 'Dupont', prenom: 'Jean', email: 'a@b.com', role: 'user', avatar: null, date_creation: '' } as any
      expect(store.fullName).toBe('Jean Dupont')
    })
  })

  describe('fetchProfile', () => {
    it('sets user from API response', async () => {
      const store = useAuthStore()
      store.accessToken = 'token'
      mockApi.get.mockResolvedValueOnce({
        data: { id: '1', nom: 'Doe', prenom: 'John', email: 'john@test.com', role: 'user', avatar: null, date_creation: '' }
      })

      await store.fetchProfile()

      expect(store.user?.nom).toBe('Doe')
    })

    it('clears auth on API error', async () => {
      const store = useAuthStore()
      store.accessToken = 'bad-token'
      mockApi.get.mockRejectedValueOnce(new Error('Unauthorized'))

      await store.fetchProfile()

      expect(store.user).toBeNull()
      expect(store.accessToken).toBeNull()
    })

    it('does nothing when no accessToken', async () => {
      const store = useAuthStore()
      await store.fetchProfile()
      expect(mockApi.get).not.toHaveBeenCalled()
    })
  })
})
