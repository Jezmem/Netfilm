<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ nom: '', prenom: '', email: '', mot_de_passe: '', confirm: '' })
const showPassword = ref(false)
const submitting = ref(false)
const errors = ref<Record<string, string>>({})

const passwordChecks = computed(() => ({
  length: form.value.mot_de_passe.length >= 8,
  uppercase: /[A-Z]/.test(form.value.mot_de_passe),
  special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(form.value.mot_de_passe)
}))

function validate() {
  const e: Record<string, string> = {}
  if (!form.value.nom) e.nom = 'Nom requis'
  if (!form.value.prenom) e.prenom = 'Prénom requis'
  if (!form.value.email) e.email = 'Email requis'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) e.email = 'Email invalide'
  if (!form.value.mot_de_passe) {
    e.mot_de_passe = 'Mot de passe requis'
  } else if (form.value.mot_de_passe.length < 8) {
    e.mot_de_passe = 'Minimum 8 caractères'
  } else if (!/[A-Z]/.test(form.value.mot_de_passe)) {
    e.mot_de_passe = 'Au moins une lettre majuscule requise'
  } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(form.value.mot_de_passe)) {
    e.mot_de_passe = 'Au moins un caractère spécial requis (!@#$%^&*...)'
  }
  if (form.value.mot_de_passe !== form.value.confirm) e.confirm = 'Les mots de passe ne correspondent pas'
  errors.value = e
  return Object.keys(e).length === 0
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  const result = await authStore.register(form.value.nom, form.value.prenom, form.value.email, form.value.mot_de_passe)
  submitting.value = false
  if (result.success) {
    toast.success('Inscription réussie !')
    router.push('/')
  } else {
    errors.value.general = result.error || 'Erreur lors de l\'inscription'
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-bg">
      <img src="https://images.pexels.com/photos/2510428/pexels-photo-2510428.jpeg" alt="" />
      <div class="auth-overlay"></div>
    </div>

    <div class="auth-card card">
      <div class="auth-brand">
        <span class="brand-icon">N</span>
        <span class="brand-text">NETFILM</span>
      </div>
      <h1 class="auth-title">Créer un compte</h1>
      <p class="auth-subtitle">Rejoignez la communauté Netfilm</p>

      <div v-if="errors.general" class="alert-error">{{ errors.general }}</div>

      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Prénom</label>
            <input v-model="form.prenom" type="text" class="form-input" :class="{ error: errors.prenom }" placeholder="Jean" />
            <p v-if="errors.prenom" class="form-error">{{ errors.prenom }}</p>
          </div>
          <div class="form-group">
            <label class="form-label">Nom</label>
            <input v-model="form.nom" type="text" class="form-input" :class="{ error: errors.nom }" placeholder="Dupont" />
            <p v-if="errors.nom" class="form-error">{{ errors.nom }}</p>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Email</label>
          <input v-model="form.email" type="email" class="form-input" :class="{ error: errors.email }" placeholder="jean.dupont@email.com" />
          <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
        </div>

        <div class="form-group">
          <label class="form-label">Mot de passe</label>
          <div class="password-wrapper">
            <input v-model="form.mot_de_passe" :type="showPassword ? 'text' : 'password'" class="form-input" :class="{ error: errors.mot_de_passe }" placeholder="Minimum 8 caractères" />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
          <p v-if="errors.mot_de_passe" class="form-error">{{ errors.mot_de_passe }}</p>
          <ul v-if="form.mot_de_passe.length > 0" class="password-requirements">
            <li :class="{ valid: passwordChecks.length, invalid: !passwordChecks.length }">
              <span class="req-icon">{{ passwordChecks.length ? '✓' : '✗' }}</span>
              Minimum 8 caractères
            </li>
            <li :class="{ valid: passwordChecks.uppercase, invalid: !passwordChecks.uppercase }">
              <span class="req-icon">{{ passwordChecks.uppercase ? '✓' : '✗' }}</span>
              Au moins une lettre majuscule
            </li>
            <li :class="{ valid: passwordChecks.special, invalid: !passwordChecks.special }">
              <span class="req-icon">{{ passwordChecks.special ? '✓' : '✗' }}</span>
              Au moins un caractère spécial (!@#$%^&*...)
            </li>
          </ul>
        </div>

        <div class="form-group">
          <label class="form-label">Confirmer le mot de passe</label>
          <input v-model="form.confirm" type="password" class="form-input" :class="{ error: errors.confirm }" placeholder="Répétez le mot de passe" />
          <p v-if="errors.confirm" class="form-error">{{ errors.confirm }}</p>
        </div>

        <button type="submit" class="btn btn-primary btn-lg auth-btn" :disabled="submitting">
          {{ submitting ? 'Création...' : 'Créer mon compte' }}
        </button>
      </form>

      <p class="auth-link">
        Déjà un compte ?
        <RouterLink to="/login">Se connecter</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; position: relative; }
.auth-bg { position: fixed; inset: 0; z-index: 0; }
.auth-bg img { width: 100%; height: 100%; object-fit: cover; }
.auth-overlay { position: absolute; inset: 0; background: rgba(15,15,15,0.8); }
.auth-card { position: relative; z-index: 1; width: 100%; max-width: 480px; padding: 40px; }
.auth-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; justify-content: center; }
.brand-icon { width: 36px; height: 36px; background: var(--color-primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: white; }
.brand-text { font-size: 18px; font-weight: 700; letter-spacing: 2px; }
.auth-title { font-size: 26px; font-weight: 700; text-align: center; margin-bottom: 8px; }
.auth-subtitle { font-size: 14px; color: var(--color-text-secondary); text-align: center; margin-bottom: 32px; }
.alert-error { background: rgba(231,76,60,0.15); border: 1px solid rgba(231,76,60,0.3); color: var(--color-error); padding: 12px 16px; border-radius: var(--radius-sm); font-size: 14px; margin-bottom: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.password-wrapper { position: relative; }
.password-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--color-text-muted); padding: 4px; display: flex; }
.password-wrapper .form-input { padding-right: 48px; }
.auth-btn { width: 100%; justify-content: center; margin-top: 4px; }
.auth-link { text-align: center; margin-top: 24px; font-size: 14px; color: var(--color-text-secondary); }
.auth-link a { color: var(--color-primary); font-weight: 500; }
.auth-link a:hover { text-decoration: underline; }
.password-requirements { list-style: none; padding: 8px 0 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
.password-requirements li { font-size: 12px; display: flex; align-items: center; gap: 6px; transition: color 0.2s; }
.password-requirements li.valid { color: #27ae60; }
.password-requirements li.invalid { color: var(--color-text-muted); }
.req-icon { font-size: 11px; font-weight: 700; width: 14px; text-align: center; }
</style>
