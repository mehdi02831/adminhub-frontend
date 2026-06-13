<script setup>
const props = defineProps({
  users: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit-user', 'delete-user'])

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const handleEdit = (user) => {
  emit('edit-user', user)
}

const handleDelete = (id) => {
  if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
    emit('delete-user', id)
  }
}
</script>

<template>
  <div class="table-container">
    <table class="custom-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td><span class="user-id">#{{ user.id }}</span></td>
          <td>
            <div class="user-name-cell">
              <span class="user-name-text">{{ user.name }}</span>
            </div>
          </td>
          <td><span class="user-email-text">{{ user.email }}</span></td>
          <td>
            <span :class="['badge', user.role === 'admin' ? 'badge-admin' : 'badge-user']">
              {{ user.role }}
            </span>
          </td>
          <td>
            <span :class="['badge', user.is_active ? 'badge-active' : 'badge-inactive']">
              {{ user.is_active ? 'active' : 'inactive' }}
            </span>
          </td>
          <td><span class="user-date">{{ formatDate(user.created_at) }}</span></td>
          <td>
            <div class="action-buttons">
              <button @click="handleEdit(user)" class="btn btn-secondary btn-sm edit-btn" title="Edit User">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>Edit</span>
              </button>
              <button @click="handleDelete(user.id)" class="btn btn-danger-outline btn-sm delete-btn" title="Delete User">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                <span>Delete</span>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="users.length === 0">
          <td colspan="7" class="no-data-cell">
            <div class="no-data-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="no-data-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <p>No users found matching your filters.</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.user-id {
  font-weight: 600;
  color: var(--text-muted);
}

.user-name-text {
  font-weight: 600;
  color: var(--text-main);
}

.user-email-text {
  color: var(--text-muted);
  word-break: break-all;
}

.user-date {
  color: var(--text-muted);
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-btn {
  border-radius: var(--radius-sm);
}

.delete-btn {
  border-radius: var(--radius-sm);
}

.no-data-cell {
  text-align: center;
  padding: 4rem 2rem;
}

.no-data-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-muted);
}

.no-data-icon {
  opacity: 0.4;
  color: var(--text-muted);
}
</style>
