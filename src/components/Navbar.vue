<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'
import { i18n } from '@/i18n'

const router = useRouter()
const authStore = useAuthStore()
const { t, locale } = useI18n()
const mobileOpen = ref(false)
const userMenuOpen = ref(false)

const avatarUrl = computed(() => {
  if (!authStore.user?.avatar) return null
  return authStore.user.avatar.startsWith('/uploads') ? authStore.user.avatar : authStore.user.avatar
})

async function handleLogout() {
  await authStore.logout()
  userMenuOpen.value = false
  router.push('/login')
  toast.success(t('nav.loggedOut'))
}

function toggleLocale() {
  const newLocale = locale.value === 'fr' ? 'en' : 'fr'
  locale.value = newLocale
  i18n.global.locale.value = newLocale
  localStorage.setItem('locale', newLocale)
}
</script>

<template>
  <nav class="navbar">
    <div class="container navbar-inner">
      <RouterLink to="/" class="navbar-brand">
        <span class="brand-icon">N</span>
        <span class="brand-text">NETFILM</span>
      </RouterLink>

      <div class="navbar-center">
        <RouterLink to="/" class="nav-link" :class="{ active: $route.path === '/' }">{{ t('nav.home') }}</RouterLink>
        <RouterLink to="/?type=movie" class="nav-link">{{ t('nav.movies') }}</RouterLink>
        <RouterLink to="/?type=series" class="nav-link">{{ t('nav.series') }}</RouterLink>
        <template v-if="authStore.isAuthenticated">
          <RouterLink to="/favorites" class="nav-link">{{ t('nav.favorites') }}</RouterLink>
          <RouterLink to="/watchlist" class="nav-link">{{ t('nav.watchlist') }}</RouterLink>
        </template>
      </div>

      <div class="navbar-right">
        <button class="locale-toggle" @click="toggleLocale" :title="locale === 'fr' ? 'Switch to English' : 'Passer en français'">
          <span class="locale-flag">{{ locale === 'fr' ? '🇬🇧' : '🇫🇷' }}</span>
          <span class="locale-label">{{ locale === 'fr' ? 'EN' : 'FR' }}</span>
        </button>

        <template v-if="authStore.isAuthenticated">
          <div class="user-menu" @click="userMenuOpen = !userMenuOpen">
            <div class="user-avatar">
              <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" />
              <span v-else>{{ authStore.fullName.charAt(0) }}</span>
            </div>
            <span class="user-name">{{ authStore.fullName }}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z"/>
            </svg>

            <Transition name="fade">
              <div v-if="userMenuOpen" class="dropdown" @click.stop>
                <RouterLink to="/profile" class="dropdown-item" @click="userMenuOpen = false">
                  {{ t('nav.myProfile') }}
                </RouterLink>
                <RouterLink to="/favorites" class="dropdown-item" @click="userMenuOpen = false">
                  {{ t('nav.myFavorites') }}
                </RouterLink>
                <RouterLink to="/watchlist" class="dropdown-item" @click="userMenuOpen = false">
                  {{ t('nav.myWatchlist') }}
                </RouterLink>
                <template v-if="authStore.isAdmin">
                  <div class="dropdown-divider"></div>
                  <RouterLink to="/admin" class="dropdown-item dropdown-admin" @click="userMenuOpen = false">
                    {{ t('nav.admin') }}
                  </RouterLink>
                </template>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item dropdown-logout" @click="handleLogout">
                  {{ t('nav.logout') }}
                </button>
              </div>
            </Transition>
          </div>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn btn-ghost btn-sm">{{ t('nav.login') }}</RouterLink>
          <RouterLink to="/register" class="btn btn-primary btn-sm">{{ t('nav.register') }}</RouterLink>
        </template>
      </div>

      <button class="mobile-toggle" @click="mobileOpen = !mobileOpen">
        <span></span><span></span><span></span>
      </button>
    </div>

    <Transition name="slide-up">
      <div v-if="mobileOpen" class="mobile-menu">
        <RouterLink to="/" class="mobile-link" @click="mobileOpen = false">{{ t('nav.home') }}</RouterLink>
        <RouterLink to="/?type=movie" class="mobile-link" @click="mobileOpen = false">{{ t('nav.movies') }}</RouterLink>
        <RouterLink to="/?type=series" class="mobile-link" @click="mobileOpen = false">{{ t('nav.series') }}</RouterLink>
        <template v-if="authStore.isAuthenticated">
          <RouterLink to="/favorites" class="mobile-link" @click="mobileOpen = false">{{ t('nav.favorites') }}</RouterLink>
          <RouterLink to="/watchlist" class="mobile-link" @click="mobileOpen = false">{{ t('nav.watchlist') }}</RouterLink>
          <RouterLink to="/profile" class="mobile-link" @click="mobileOpen = false">{{ t('nav.profile') }}</RouterLink>
          <button class="mobile-link mobile-logout" @click="handleLogout">{{ t('nav.logout') }}</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="mobile-link" @click="mobileOpen = false">{{ t('nav.login') }}</RouterLink>
          <RouterLink to="/register" class="mobile-link" @click="mobileOpen = false">{{ t('nav.register') }}</RouterLink>
        </template>
        <button class="mobile-link mobile-locale" @click="toggleLocale">{{ locale === 'fr' ? 'English' : 'Français' }}</button>
      </div>
    </Transition>
  </nav>

  <div v-if="userMenuOpen" class="overlay" @click="userMenuOpen = false" />
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  background: rgba(15,15,15,0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
  height: 72px;
}
.navbar-inner {
  display: flex;
  align-items: center;
  height: 72px;
  gap: 32px;
}
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.brand-icon {
  width: 36px; height: 36px;
  background: var(--color-primary);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 700;
  color: white;
}
.brand-text {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--color-text);
}
.navbar-center {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}
.nav-link {
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: all var(--transition);
}
.nav-link:hover, .nav-link.active {
  color: var(--color-text);
  background: var(--color-bg-3);
}
.navbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  position: relative;
}
.locale-toggle {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  background: var(--color-bg-3);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
  letter-spacing: 0.5px;
}
.locale-toggle:hover { border-color: var(--color-border-light); color: var(--color-text); }
.locale-flag { font-size: 14px; }
.locale-label { font-size: 11px; font-weight: 700; }
.user-menu {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 6px;
  border-radius: var(--radius-md);
  cursor: pointer;
  position: relative;
  border: 1px solid var(--color-border);
  background: var(--color-bg-3);
  transition: all var(--transition);
}
.user-menu:hover { border-color: var(--color-border-light); }
.user-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--color-primary);
  display: flex; align-items: center; justify-content: center;
  font-weight: 600; font-size: 14px;
  overflow: hidden;
  flex-shrink: 0;
}
.user-avatar img { width: 100%; height: 100%; object-fit: cover; }
.user-name { font-size: 13px; font-weight: 500; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  min-width: 200px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  z-index: 100;
}
.dropdown-item {
  display: block;
  padding: 12px 16px;
  font-size: 14px;
  color: var(--color-text-secondary);
  transition: all var(--transition);
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
}
.dropdown-item:hover { background: var(--color-bg-3); color: var(--color-text); }
.dropdown-admin { color: var(--color-accent) !important; }
.dropdown-logout { color: var(--color-error) !important; }
.dropdown-divider { height: 1px; background: var(--color-border); margin: 4px 0; }
.overlay { position: fixed; inset: 0; z-index: 999; }
.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  background: none;
  border: none;
  margin-left: auto;
}
.mobile-toggle span {
  display: block;
  width: 22px; height: 2px;
  background: var(--color-text);
  border-radius: 2px;
  transition: all var(--transition);
}
.mobile-menu {
  background: var(--color-bg-2);
  border-top: 1px solid var(--color-border);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.mobile-link {
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-text-secondary);
  transition: all var(--transition);
  display: block;
  background: none;
  border: none;
  text-align: left;
  width: 100%;
  cursor: pointer;
}
.mobile-link:hover { background: var(--color-bg-3); color: var(--color-text); }
.mobile-logout { color: var(--color-error) !important; }
.mobile-locale { color: var(--color-primary) !important; font-weight: 600; }

@media (max-width: 900px) {
  .navbar-center { display: none; }
  .navbar-right { display: none; }
  .mobile-toggle { display: flex; }
}
</style>
