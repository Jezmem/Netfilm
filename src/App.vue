<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const route = useRoute()
const hideNavbar = ['admin-login', 'admin', 'admin-dashboard', 'admin-movies', 'admin-series', 'admin-categories']
</script>

<template>
  <div id="app-wrapper">
    <Navbar v-if="!hideNavbar.includes(String(route.name))" />
    <main class="main-content" :class="{ 'with-navbar': !hideNavbar.includes(String(route.name)) }">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style>
#app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
}
.main-content.with-navbar {
  padding-top: 72px;
}
</style>
