<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const submitting = ref(false)
const error = ref('')

async function handleSubmit() {
  if (!email.value || !password.value) { error.value = 'Tous les champs sont requis'; return }
  submitting.value = true
  error.value = ''
  const result = await authStore.login(email.value, password.value)
  submitting.value = false
  if (result.success) {
    if (!authStore.isAdmin) {
      await authStore.logout()
      error.value = 'Accès réservé aux administrateurs'
      return
    }
    toast.success('Connexion administrateur réussie')
    router.push('/admin')
  } else {
    error.value = result.error || 'Erreur de connexion'
  }
}
</script>

<template>
  <div class="admin-login">
    <div class="admin-login-card">
      <div class="admin-brand">
        <span class="brand-icon">N</span>
        <div>
          <div class="brand-text">NETFILM</div>
          <div class="brand-sub">Administration</div>
        </div>
      </div>

      <h1 class="login-title">Accès Administrateur</h1>

      <div v-if="error" class="alert-error">{{ error }}</div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input v-model="email" type="email" class="form-input" placeholder="admin@netfilm.com" required />
        </div>
        <div class="form-group">
          <label class="form-label">Mot de passe</label>
          <input v-model="password" type="password" class="form-input" placeholder="••••••••" required />
        </div>
        <button type="submit" class="btn btn-primary submit-btn" :disabled="submitting">
          {{ submitting ? 'Connexion...' : 'Accéder au panel' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.admin-login {
  min-height: 100vh;
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-image: radial-gradient(circle at 20% 50%, rgba(229,9,20,0.06) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(245,197,24,0.04) 0%, transparent 50%);
}
.admin-login-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 48px;
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow-lg);
}
.admin-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 40px;
}
.brand-icon {
  width: 44px; height: 44px;
  background: var(--color-primary);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: 700; color: white;
}
.brand-text { font-size: 18px; font-weight: 700; letter-spacing: 2px; }
.brand-sub { font-size: 12px; color: var(--color-text-muted); letter-spacing: 1px; }
.login-title { font-size: 22px; font-weight: 700; margin-bottom: 28px; }
.alert-error { background: rgba(231,76,60,0.15); border: 1px solid rgba(231,76,60,0.3); color: var(--color-error); padding: 12px 16px; border-radius: var(--radius-sm); font-size: 14px; margin-bottom: 20px; }
.submit-btn { width: 100%; justify-content: center; margin-top: 4px; padding: 14px; font-size: 15px; }
</style>
