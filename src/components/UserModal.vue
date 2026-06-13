<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  name: '',
  email: '',
  role: 'user',
  is_active: true
})

const errors = reactive({
  name: '',
  email: ''
})

// Sync form state when user changes
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      form.name = newUser.name
      form.email = newUser.email
      form.role = newUser.role
      form.is_active = newUser.is_active !== undefined ? newUser.is_active : true
    } else {
      form.name = ''
      form.email = ''
      form.role = 'user'
      form.is_active = true
    }
    // Clear validation errors
    errors.name = ''
    errors.email = ''
  },
  { immediate: true }
)

// Clear form when opening for a fresh Create User
watch(
  () => props.show,
  (newShow) => {
    if (newShow && !props.user) {
      form.name = ''
      form.email = ''
      form.role = 'user'
      form.is_active = true
      errors.name = ''
      errors.email = ''
    }
  }
)

const validateForm = () => {
  let isValid = true
  errors.name = ''
  errors.email = ''

  if (!form.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email.trim())) {
      errors.email = 'Please enter a valid email address'
      isValid = false
    }
  }

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('save', {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      is_active: form.is_active
    })
  }
}
</script>

<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-backdrop" @click.self="emit('close')">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">{{ user ? 'Edit User' : 'Add New User' }}</h3>
          <button @click="emit('close')" class="modal-close" aria-label="Close modal">&times;</button>
        </div>

        <form @submit.prevent="handleSubmit" novalidate>
          <div class="modal-body">
            <!-- Name Field -->
            <div class="form-group">
              <label for="name" class="form-label">Full Name</label>
              <input 
                id="name"
                v-model="form.name" 
                type="text" 
                class="form-control" 
                :class="{ 'is-invalid': errors.name }" 
                placeholder="e.g. John Doe"
                required
              />
              <span v-if="errors.name" class="invalid-feedback">{{ errors.name }}</span>
            </div>

            <!-- Email Field -->
            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <input 
                id="email"
                v-model="form.email" 
                type="email" 
                class="form-control" 
                :class="{ 'is-invalid': errors.email }" 
                placeholder="e.g. john@example.com"
                required
              />
              <span v-if="errors.email" class="invalid-feedback">{{ errors.email }}</span>
            </div>

            <!-- Role Field -->
            <div class="form-group">
              <label for="role" class="form-label">System Role</label>
              <select id="role" v-model="form.role" class="form-control">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <!-- Status Toggle -->
            <div class="form-group status-toggle-group">
              <span class="form-label">Account Status</span>
              <label class="toggle-container">
                <input 
                  v-model="form.is_active" 
                  type="checkbox" 
                  class="toggle-input"
                />
                <span class="toggle-switch"></span>
                <span class="toggle-label-text">
                  {{ form.is_active ? 'Active' : 'Inactive' }}
                </span>
              </label>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" @click="emit('close')" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">
              {{ user ? 'Save Changes' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1.5rem;
}

.modal-dialog {
  background-color: #ffffff;
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  overflow: hidden;
  transform: scale(1);
  transition: transform var(--transition-normal);
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9fafb;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-main);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--text-muted);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.modal-close:hover {
  color: var(--text-main);
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  background-color: #f9fafb;
}

/* Invalid validations */
.form-control.is-invalid {
  border-color: #f87171;
}

.form-control.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.invalid-feedback {
  display: block;
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.375rem;
  font-weight: 500;
}

.status-toggle-group {
  margin-top: 1.5rem;
}

.toggle-label-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-main);
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-dialog,
.modal-fade-leave-active .modal-dialog {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-fade-enter-from .modal-dialog {
  transform: scale(0.92);
}

.modal-fade-leave-to .modal-dialog {
  transform: scale(0.96);
  transition: transform 0.2s ease;
}
</style>
