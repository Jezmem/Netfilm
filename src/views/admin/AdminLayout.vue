<script setup lang="ts">
import { RouterView, RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push('/admin-login')
  toast.success('Déconnexion réussie')
}

const navItems = [
  { name: 'admin-dashboard', path: '/admin', label: 'Dashboard', icon: 'M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z' },
  { name: 'admin-movies', path: '/admin/movies', label: 'Films', icon: 'M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z' },
  { name: 'admin-series', path: '/admin/series', label: 'Séries', icon: 'M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z' },
  { name: 'admin-categories', path: '/admin/categories', label: 'Catégories', icon: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z' }
]
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <span class="brand-icon">N</span>
          <div>
            <div class="brand-name">NETFILM</div>
            <div class="brand-sub">Admin Panel</div>
          </div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="nav-item"
          :class="{ active: route.name === item.name }"
          :exact="item.path === '/admin'"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path :d="item.icon" />
          </svg>
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <RouterLink to="/" class="sidebar-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Voir le site
        </RouterLink>
        <button class="sidebar-link logout-btn" @click="handleLogout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Déconnexion
        </button>
      </div>
    </aside>

    <div class="admin-main">
      <header class="admin-topbar">
        <div class="topbar-left">
          <div class="admin-user">
            <div class="user-avatar-sm">{{ authStore.fullName.charAt(0) }}</div>
            <span>{{ authStore.fullName }}</span>
            <span class="badge badge-accent">Admin</span>
          </div>
        </div>
      </header>

      <main class="admin-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; background: var(--color-bg); }
.admin-sidebar {
  width: 250px; flex-shrink: 0;
  background: var(--color-bg-card);
  border-right: 1px solid var(--color-border);
  display: flex; flex-direction: column;
  position: fixed; top: 0; left: 0; bottom: 0;
  z-index: 100;
}
.sidebar-header { padding: 24px; border-bottom: 1px solid var(--color-border); }
.sidebar-brand { display: flex; align-items: center; gap: 12px; }
.brand-icon { width: 38px; height: 38px; background: var(--color-primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: white; flex-shrink: 0; }
.brand-name { font-size: 15px; font-weight: 700; letter-spacing: 1.5px; }
.brand-sub { font-size: 11px; color: var(--color-text-muted); }
.sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
.nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px; border-radius: var(--radius-sm);
  color: var(--color-text-muted); font-size: 14px; font-weight: 500;
  transition: all var(--transition);
}
.nav-item:hover { background: var(--color-bg-3); color: var(--color-text); }
.nav-item.active { background: rgba(229,9,20,0.15); color: var(--color-primary); }
.sidebar-footer { padding: 16px 12px; border-top: 1px solid var(--color-border); display: flex; flex-direction: column; gap: 4px; }
.sidebar-link {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; border-radius: var(--radius-sm);
  color: var(--color-text-muted); font-size: 13px;
  transition: all var(--transition); background: none; border: none; width: 100%; text-align: left; cursor: pointer;
}
.sidebar-link:hover { background: var(--color-bg-3); color: var(--color-text); }
.logout-btn:hover { color: var(--color-error) !important; }
.admin-main { margin-left: 250px; flex: 1; display: flex; flex-direction: column; }
.admin-topbar {
  height: 64px; background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  display: flex; align-items: center; justify-content: flex-end;
  padding: 0 28px;
}
.admin-user { display: flex; align-items: center; gap: 10px; font-size: 14px; }
.user-avatar-sm { width: 32px; height: 32px; border-radius: 50%; background: var(--color-primary); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 13px; }
.admin-content { flex: 1; padding: 32px 28px; overflow-y: auto; }
</style>
