<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path) => {
  return route.path === path
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <line x1="9" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="15" x2="21" y2="15"></line>
        </svg>
      </div>
      <span class="brand-name">AdminHub</span>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/" class="nav-item" :class="{ active: isActive('/') }">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
          <rect x="3" y="3" width="7" height="9"></rect>
          <rect x="14" y="3" width="7" height="5"></rect>
          <rect x="14" y="12" width="7" height="9"></rect>
          <rect x="3" y="16" width="7" height="5"></rect>
        </svg>
        <span>Dashboard</span>
      </router-link>

      <router-link to="/users" class="nav-item" :class="{ active: isActive('/users') }">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <span>Users</span>
      </router-link>
    </nav>
    
    <div class="sidebar-footer">
      <div class="footer-user">
        <div class="user-avatar">AH</div>
        <div class="user-info">
          <div class="user-name">Admin User</div>
          <div class="user-role">Super Admin</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 250px;
  background-color: var(--bg-sidebar);
  color: #ffffff;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 100;
  transition: transform var(--transition-normal);
}

.sidebar-brand {
  height: 70px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.brand-logo {
  background-color: var(--primary-color);
  color: #ffffff;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1rem;
  color: var(--text-sidebar);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.03);
  color: var(--text-sidebar-active);
}

.nav-item.active {
  background-color: var(--primary-color);
  color: var(--text-sidebar-active);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
}

.nav-icon {
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}

.nav-item:hover .nav-icon,
.nav-item.active .nav-icon {
  opacity: 1;
}

.sidebar-footer {
  padding: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background-color: rgba(0, 0, 0, 0.1);
}

.footer-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color) 0%, #8b5cf6 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: var(--shadow-sm);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-sidebar-active);
}

.user-role {
  font-size: 0.75rem;
  color: var(--text-sidebar);
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
}
</style>
