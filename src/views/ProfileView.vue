<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const { t } = useI18n()

const form = ref({
  nom: authStore.user?.nom || '',
  prenom: authStore.user?.prenom || '',
  email: authStore.user?.email || '',
  mot_de_passe: '',
  confirm: ''
})
const submitting = ref(false)
const uploadingAvatar = ref(false)
const errors = ref<Record<string, string>>({})
const fileInput = ref<HTMLInputElement | null>(null)

function validate() {
  const e: Record<string, string> = {}
  if (!form.value.nom) e.nom = t('register.validation.lastNameRequired')
  if (!form.value.prenom) e.prenom = t('register.validation.firstNameRequired')
  if (!form.value.email) e.email = t('register.validation.emailRequired')
  if (form.value.mot_de_passe && form.value.mot_de_passe.length < 8) e.mot_de_passe = t('register.validation.passwordMin')
  if (form.value.mot_de_passe && form.value.mot_de_passe !== form.value.confirm) e.confirm = t('register.validation.passwordMatch')
  errors.value = e
  return Object.keys(e).length === 0
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  try {
    const payload: any = { nom: form.value.nom, prenom: form.value.prenom, email: form.value.email }
    if (form.value.mot_de_passe) payload.mot_de_passe = form.value.mot_de_passe
    await authStore.updateProfile(payload)
    form.value.mot_de_passe = ''
    form.value.confirm = ''
    toast.success(t('profile.success'))
  } catch (err: any) {
    toast.error(err.response?.data?.error || t('profile.error'))
  } finally {
    submitting.value = false
  }
}

async function handleAvatarUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { toast.error(t('profile.avatarTooBig')); return }
  uploadingAvatar.value = true
  try {
    await authStore.uploadAvatar(file)
    toast.success(t('profile.avatarSuccess'))
  } catch {
    toast.error(t('profile.avatarError'))
  } finally {
    uploadingAvatar.value = false
  }
}
</script>

<template>
  <div class="profile-page container">
    <div class="page-header">
      <h1 class="page-title">{{ t('profile.title') }}</h1>
    </div>

    <div class="profile-layout">
      <div class="avatar-section card">
        <div class="avatar-container" @click="fileInput?.click()">
          <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" alt="Avatar" class="avatar-img" />
          <div v-else class="avatar-placeholder">{{ authStore.fullName.charAt(0) }}</div>
          <div class="avatar-overlay">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 15.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4z"/>
              <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z"/>
            </svg>
            <span>{{ t('profile.edit') }}</span>
          </div>
          <div v-if="uploadingAvatar" class="avatar-loading">
            <div class="spinner" style="width:24px;height:24px;border-width:2px;"></div>
          </div>
        </div>
        <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="handleAvatarUpload" />
        <div class="avatar-info">
          <h2 class="avatar-name">{{ authStore.fullName }}</h2>
          <p class="avatar-email">{{ authStore.user?.email }}</p>
          <span class="badge" :class="authStore.isAdmin ? 'badge-accent' : 'badge-success'">
            {{ authStore.isAdmin ? t('profile.roles.admin') : t('profile.roles.user') }}
          </span>
        </div>
      </div>

      <div class="form-section card">
        <h2 class="section-title">{{ t('profile.personalInfo') }}</h2>
        <div v-if="errors.general" class="alert-error">{{ errors.general }}</div>
        <form @submit.prevent="handleSubmit">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">{{ t('profile.firstName') }}</label>
              <input v-model="form.prenom" type="text" class="form-input" :class="{ error: errors.prenom }" />
              <p v-if="errors.prenom" class="form-error">{{ errors.prenom }}</p>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('profile.lastName') }}</label>
              <input v-model="form.nom" type="text" class="form-input" :class="{ error: errors.nom }" />
              <p v-if="errors.nom" class="form-error">{{ errors.nom }}</p>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('profile.email') }}</label>
            <input v-model="form.email" type="email" class="form-input" :class="{ error: errors.email }" />
            <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
          </div>

          <div class="divider">
            <span>{{ t('profile.changePassword') }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">{{ t('profile.newPassword') }}</label>
              <input v-model="form.mot_de_passe" type="password" class="form-input" :class="{ error: errors.mot_de_passe }" :placeholder="t('profile.newPasswordHint')" />
              <p v-if="errors.mot_de_passe" class="form-error">{{ errors.mot_de_passe }}</p>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('profile.confirmPassword') }}</label>
              <input v-model="form.confirm" type="password" class="form-input" :class="{ error: errors.confirm }" :placeholder="t('profile.confirmPasswordPlaceholder')" />
              <p v-if="errors.confirm" class="form-error">{{ errors.confirm }}</p>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              {{ submitting ? t('profile.saving') : t('profile.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page { padding: 40px 24px 80px; }
.page-header { margin-bottom: 32px; }
.page-title { font-size: 28px; font-weight: 700; }
.profile-layout { display: grid; grid-template-columns: 280px 1fr; gap: 24px; align-items: start; }
.avatar-section { padding: 32px; text-align: center; }
.avatar-container {
  position: relative; width: 120px; height: 120px;
  border-radius: 50%; margin: 0 auto 20px;
  cursor: pointer; overflow: hidden;
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-placeholder { width: 100%; height: 100%; background: var(--color-primary); display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: 700; }
.avatar-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; opacity: 0; transition: opacity var(--transition); font-size: 12px; color: white; }
.avatar-container:hover .avatar-overlay { opacity: 1; }
.avatar-loading { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
.avatar-name { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
.avatar-email { font-size: 13px; color: var(--color-text-muted); margin-bottom: 12px; }
.form-section { padding: 32px; }
.section-title { font-size: 18px; font-weight: 700; margin-bottom: 24px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.divider { display: flex; align-items: center; gap: 16px; margin: 24px 0; color: var(--color-text-muted); font-size: 13px; }
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--color-border); }
.form-actions { display: flex; justify-content: flex-end; margin-top: 8px; }
.alert-error { background: rgba(231,76,60,0.15); border: 1px solid rgba(231,76,60,0.3); color: var(--color-error); padding: 12px 16px; border-radius: var(--radius-sm); font-size: 14px; margin-bottom: 20px; }
@media (max-width: 800px) { .profile-layout { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } }
</style>
