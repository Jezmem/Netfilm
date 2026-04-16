<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const submitting = ref(false)
const errors = ref({ email: '', password: '', general: '' })

function validate() {
  errors.value = { email: '', password: '', general: '' }
  let valid = true
  if (!email.value) { errors.value.email = 'Email requis'; valid = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { errors.value.email = 'Email invalide'; valid = false }
  if (!password.value) { errors.value.password = 'Mot de passe requis'; valid = false }
  return valid
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  const result = await authStore.login(email.value, password.value)
  submitting.value = false
  if (result.success) {
    toast.success('Connexion réussie !')
    const redirect = (router.currentRoute.value.query.redirect as string) || '/'
    router.push(redirect)
  } else {
    errors.value.general = result.error || 'Erreur de connexion'
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-bg">
      <img src="https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg" alt="" />
      <div class="auth-overlay"></div>
    </div>

    <div class="auth-card card">
      <div class="auth-brand">
        <span class="brand-icon">N</span>
        <span class="brand-text">NETFILM</span>
      </div>
      <h1 class="auth-title">Connexion</h1>
      <p class="auth-subtitle">Accédez à votre espace personnel</p>

      <div v-if="errors.general" class="alert-error">{{ errors.general }}</div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input v-model="email" type="email" class="form-input" :class="{ error: errors.email }" placeholder="votre@email.com" />
          <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
        </div>

        <div class="form-group">
          <label class="form-label">Mot de passe</label>
          <div class="password-wrapper">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-input" :class="{ error: errors.password }" placeholder="Votre mot de passe" />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="form-error">{{ errors.password }}</p>
        </div>

        <button type="submit" class="btn btn-primary btn-lg auth-btn" :disabled="submitting">
          {{ submitting ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <p class="auth-link">
        Pas encore de compte ?
        <RouterLink to="/register">Créer un compte</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
}
.auth-bg {
  position: fixed; inset: 0; z-index: 0;
}
.auth-bg img { width: 100%; height: 100%; object-fit: cover; }
.auth-overlay { position: absolute; inset: 0; background: rgba(15,15,15,0.8); }
.auth-card {
  position: relative; z-index: 1;
  width: 100%; max-width: 420px;
  padding: 40px;
}
.auth-brand {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 32px; justify-content: center;
}
.brand-icon {
  width: 36px; height: 36px; background: var(--color-primary);
  border-radius: 8px; display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 700; color: white;
}
.brand-text { font-size: 18px; font-weight: 700; letter-spacing: 2px; }
.auth-title { font-size: 26px; font-weight: 700; text-align: center; margin-bottom: 8px; }
.auth-subtitle { font-size: 14px; color: var(--color-text-secondary); text-align: center; margin-bottom: 32px; }
.alert-error {
  background: rgba(231,76,60,0.15); border: 1px solid rgba(231,76,60,0.3);
  color: var(--color-error); padding: 12px 16px;
  border-radius: var(--radius-sm); font-size: 14px; margin-bottom: 20px;
}
.password-wrapper { position: relative; }
.password-toggle {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: var(--color-text-muted);
  padding: 4px; display: flex;
}
.password-toggle:hover { color: var(--color-text); }
.password-wrapper .form-input { padding-right: 48px; }
.auth-btn { width: 100%; justify-content: center; margin-top: 4px; }
.auth-link {
  text-align: center; margin-top: 24px;
  font-size: 14px; color: var(--color-text-secondary);
}
.auth-link a { color: var(--color-primary); font-weight: 500; }
.auth-link a:hover { text-decoration: underline; }
</style>
