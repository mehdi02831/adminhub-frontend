<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import UserTable from '../components/UserTable.vue'
import UserModal from '../components/UserModal.vue'

const userStore = useUserStore()

// Filter states
const searchQuery = ref('')
const filterRole = ref('all')
const filterStatus = ref('all') // 'all' | 'active' | 'inactive'

// Modal states
const showModal = ref(false)
const selectedUser = ref(null)

onMounted(async () => {
  await userStore.fetchUsers()
})

// Filter logic
const filteredUsers = computed(() => {
  return userStore.users.filter(user => {
    const nameMatch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const emailMatch = user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesSearch = searchQuery.value.trim() === '' || nameMatch || emailMatch

    const matchesRole = filterRole.value === 'all' || user.role === filterRole.value

    let matchesStatus = true
    if (filterStatus.value === 'active') {
      matchesStatus = user.is_active
    } else if (filterStatus.value === 'inactive') {
      matchesStatus = !user.is_active
    }

    return matchesSearch && matchesRole && matchesStatus
  })
})

const openAddModal = () => {
  selectedUser.value = null
  showModal.value = true
}

const openEditModal = (user) => {
  selectedUser.value = user
  showModal.value = true
}

const handleSaveUser = async (formData) => {
  try {
    if (selectedUser.value) {
      await userStore.updateUser(selectedUser.value.id, formData)
    } else {
      await userStore.createUser(formData)
    }
    showModal.value = false
  } catch (err) {
    // Errors are stored in state and displayed globally
  }
}

const handleDeleteUser = async (id) => {
  try {
    await userStore.deleteUser(id)
  } catch (err) {
    // Errors are stored in state and displayed globally
  }
}
</script>

<template>
  <div class="users-view">
    <div class="page-header">
      <h1 class="page-title">User Management</h1>
      <button @click="openAddModal" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Add User</span>
      </button>
    </div>

    <!-- Filters Panel Card -->
    <div class="card filter-panel">
      <div class="filter-group-search">
        <div class="search-input-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="form-control search-input" 
            placeholder="Search by name or email..."
          />
        </div>
      </div>

      <div class="filter-actions">
        <!-- Role Dropdown -->
        <div class="filter-item">
          <label for="role-filter" class="filter-label">Role</label>
          <select id="role-filter" v-model="filterRole" class="form-control filter-select">
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        <!-- Status Filter Tabs / Button Group -->
        <div class="filter-item">
          <span class="filter-label">Status</span>
          <div class="status-btn-group">
            <button 
              @click="filterStatus = 'all'" 
              class="status-tab-btn" 
              :class="{ active: filterStatus === 'all' }"
            >
              All
            </button>
            <button 
              @click="filterStatus = 'active'" 
              class="status-tab-btn" 
              :class="{ active: filterStatus === 'active' }"
            >
              Active
            </button>
            <button 
              @click="filterStatus = 'inactive'" 
              class="status-tab-btn" 
              :class="{ active: filterStatus === 'inactive' }"
            >
              Inactive
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <UserTable 
      :users="filteredUsers" 
      @edit-user="openEditModal" 
      @delete-user="handleDeleteUser"
    />

    <!-- User Edit/Create Modal -->
    <UserModal 
      :show="showModal" 
      :user="selectedUser" 
      @close="showModal = false" 
      @save="handleSaveUser"
    />
  </div>
</template>

<style scoped>
.filter-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  padding: 1.25rem 1.5rem;
}

.filter-group-search {
  flex: 1;
  min-width: 280px;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 0.875rem;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  padding-left: 2.5rem;
  height: 42px;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
}

.filter-select {
  height: 42px;
  min-width: 130px;
  background-color: #ffffff;
}

.status-btn-group {
  display: flex;
  background-color: #f3f4f6;
  padding: 3px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  height: 42px;
  align-items: center;
}

.status-tab-btn {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.status-tab-btn:hover {
  color: var(--text-main);
}

.status-tab-btn.active {
  background-color: #ffffff;
  color: var(--primary-color);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

@media (max-width: 992px) {
  .filter-panel {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 576px) {
  .filter-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .filter-item {
    justify-content: space-between;
  }
}
</style>
