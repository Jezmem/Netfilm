import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'

interface User {
  id: string
  nom: string
  prenom: string
  email: string
  role: 'user' | 'admin'
  avatar: string | null
  date_creation: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const fullName = computed(() => user.value ? `${user.value.prenom} ${user.value.nom}` : '')

  function setTokens(access: string, refresh: string) {
    accessToken.value = access
    refreshToken.value = refresh
    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)
  }

  function clearAuth() {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  async function fetchProfile() {
    if (!accessToken.value) return
    try {
      const { data } = await api.get('/user/profile')
      user.value = data
    } catch {
      clearAuth()
    }
  }

  async function login(email: string, mot_de_passe: string) {
    loading.value = true
    try {
      const { data } = await api.post('/auth/login', { email, mot_de_passe })
      setTokens(data.accessToken, data.refreshToken)
      user.value = data.user
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Erreur de connexion' }
    } finally {
      loading.value = false
    }
  }

  async function register(nom: string, prenom: string, email: string, mot_de_passe: string) {
    loading.value = true
    try {
      const { data } = await api.post('/auth/register', { nom, prenom, email, mot_de_passe })
      setTokens(data.accessToken, data.refreshToken)
      user.value = data.user
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Erreur d\'inscription' }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await api.post('/auth/logout', { refreshToken: refreshToken.value })
    } catch {}
    clearAuth()
  }

  async function updateProfile(data: Partial<User & { mot_de_passe?: string }>) {
    const { data: updated } = await api.put('/user/profile', data)
    user.value = updated
    return updated
  }

  async function uploadAvatar(file: File) {
    const formData = new FormData()
    formData.append('avatar', file)
    const { data } = await api.post('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    if (user.value) user.value.avatar = data.avatar
    return data
  }

  async function init() {
    if (accessToken.value) {
      await fetchProfile()
    }
  }

  return {
    user,
    accessToken,
    loading,
    isAuthenticated,
    isAdmin,
    fullName,
    login,
    register,
    logout,
    updateProfile,
    uploadAvatar,
    init,
    fetchProfile
  }
})
