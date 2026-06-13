<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  type: {
    type: String,
    default: 'default' // 'total' | 'active' | 'inactive' | 'admins'
  }
})

const iconClass = computed(() => {
  return `stats-icon-container stats-icon-${props.type}`
})
</script>

<template>
  <div class="card stats-card">
    <div class="stats-card-content">
      <div class="stats-info">
        <span class="stats-label">{{ label }}</span>
        <h3 class="stats-value">{{ value }}</h3>
      </div>
      <div :class="iconClass">
        <!-- Total Users Icon -->
        <svg v-if="type === 'total'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>

        <!-- Active Users Icon -->
        <svg v-else-if="type === 'active'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>

        <!-- Inactive Users Icon -->
        <svg v-else-if="type === 'inactive'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <line x1="18" y1="8" x2="22" y2="12"></line>
          <line x1="22" y1="8" x2="18" y2="12"></line>
        </svg>

        <!-- Admins Icon -->
        <svg v-else-if="type === 'admins'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>

        <!-- Default Icon -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-card {
  display: block;
}

.stats-card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stats-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
}

.stats-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
}

.stats-icon-container {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-fast);
}

.stats-card:hover .stats-icon-container {
  transform: scale(1.1);
}

.stats-icon-total {
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
}

.stats-icon-active {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--badge-active-text);
}

.stats-icon-inactive {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--badge-inactive-text);
}

.stats-icon-admins {
  background-color: rgba(139, 92, 246, 0.1);
  color: var(--badge-admin-text);
}

.stats-icon-default {
  background-color: rgba(107, 114, 128, 0.1);
  color: var(--text-muted);
}
</style>
