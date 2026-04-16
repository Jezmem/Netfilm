import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/movies/:id',
      name: 'movie-detail',
      component: () => import('@/views/MovieDetailView.vue')
    },
    {
      path: '/series/:id',
      name: 'series-detail',
      component: () => import('@/views/SeriesDetailView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guest: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/FavoritesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/watchlist',
      name: 'watchlist',
      component: () => import('@/views/WatchlistView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin-login',
      name: 'admin-login',
      component: () => import('@/views/admin/AdminLoginView.vue'),
      meta: { guest: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/AdminDashboardView.vue')
        },
        {
          path: 'movies',
          name: 'admin-movies',
          component: () => import('@/views/admin/AdminMoviesView.vue')
        },
        {
          path: 'series',
          name: 'admin-series',
          component: () => import('@/views/admin/AdminSeriesView.vue')
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: () => import('@/views/admin/AdminCategoriesView.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (authStore.accessToken && !authStore.user) {
    await authStore.init()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return { name: 'home' }
  }

  if (to.meta.guest && authStore.isAuthenticated) {
    return { name: 'home' }
  }
})

export default router
