<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'

const router = useRouter()
const authStore = useAuthStore()
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
  toast.success('Déconnexion réussie')
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
        <RouterLink to="/" class="nav-link" :class="{ active: $route.path === '/' }">Accueil</RouterLink>
        <RouterLink to="/?type=movie" class="nav-link">Films</RouterLink>
        <RouterLink to="/?type=series" class="nav-link">Séries</RouterLink>
        <template v-if="authStore.isAuthenticated">
          <RouterLink to="/favorites" class="nav-link">Favoris</RouterLink>
          <RouterLink to="/watchlist" class="nav-link">Ma Liste</RouterLink>
        </template>
      </div>

      <div class="navbar-right">
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
                  Mon Profil
                </RouterLink>
                <RouterLink to="/favorites" class="dropdown-item" @click="userMenuOpen = false">
                  Mes Favoris
                </RouterLink>
                <RouterLink to="/watchlist" class="dropdown-item" @click="userMenuOpen = false">
                  Ma Watchlist
                </RouterLink>
                <template v-if="authStore.isAdmin">
                  <div class="dropdown-divider"></div>
                  <RouterLink to="/admin" class="dropdown-item dropdown-admin" @click="userMenuOpen = false">
                    Administration
                  </RouterLink>
                </template>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item dropdown-logout" @click="handleLogout">
                  Déconnexion
                </button>
              </div>
            </Transition>
          </div>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn btn-ghost btn-sm">Connexion</RouterLink>
          <RouterLink to="/register" class="btn btn-primary btn-sm">Inscription</RouterLink>
        </template>
      </div>

      <button class="mobile-toggle" @click="mobileOpen = !mobileOpen">
        <span></span><span></span><span></span>
      </button>
    </div>

    <Transition name="slide-up">
      <div v-if="mobileOpen" class="mobile-menu">
        <RouterLink to="/" class="mobile-link" @click="mobileOpen = false">Accueil</RouterLink>
        <RouterLink to="/?type=movie" class="mobile-link" @click="mobileOpen = false">Films</RouterLink>
        <RouterLink to="/?type=series" class="mobile-link" @click="mobileOpen = false">Séries</RouterLink>
        <template v-if="authStore.isAuthenticated">
          <RouterLink to="/favorites" class="mobile-link" @click="mobileOpen = false">Favoris</RouterLink>
          <RouterLink to="/watchlist" class="mobile-link" @click="mobileOpen = false">Ma Liste</RouterLink>
          <RouterLink to="/profile" class="mobile-link" @click="mobileOpen = false">Profil</RouterLink>
          <button class="mobile-link mobile-logout" @click="handleLogout">Déconnexion</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="mobile-link" @click="mobileOpen = false">Connexion</RouterLink>
          <RouterLink to="/register" class="mobile-link" @click="mobileOpen = false">Inscription</RouterLink>
        </template>
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

@media (max-width: 900px) {
  .navbar-center { display: none; }
  .navbar-right { display: none; }
  .mobile-toggle { display: flex; }
}
</style>
