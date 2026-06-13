<script setup>
import Sidebar from './components/Sidebar.vue'
import { useUserStore } from './stores/userStore'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { loading, error } = storeToRefs(userStore)

const closeError = () => {
  userStore.error = null
}
</script>

<template>
  <div class="app-container">
    <!-- Sidebar Component -->
    <Sidebar />

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Global Error Alert -->
      <div v-if="error" class="error-alert">
        <span><strong>Error:</strong> {{ error }}</span>
        <button @click="closeError" class="error-close" aria-label="Close error">&times;</button>
      </div>

      <!-- Global Loading Spinner overlay -->
      <div v-if="loading" class="spinner-overlay">
        <div class="spinner"></div>
      </div>

      <!-- Router View with fade transition -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
