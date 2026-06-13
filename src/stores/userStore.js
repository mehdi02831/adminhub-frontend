import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    stats: {
      total_users: 0,
      active_users: 0,
      inactive_users: 0,
      admins: 0
    },
    loading: false,
    error: null
  }),

  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE}/users`);
        this.users = response.data;
      } catch (err) {
        this.error = err.response?.data?.error || err.message || 'Failed to fetch users';
        console.error('Error fetching users:', err);
      } finally {
        this.loading = false;
      }
    },

    async fetchStats() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE}/stats`);
        this.stats = response.data;
      } catch (err) {
        this.error = err.response?.data?.error || err.message || 'Failed to fetch stats';
        console.error('Error fetching stats:', err);
      } finally {
        this.loading = false;
      }
    },

    async createUser(userData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post(`${API_BASE}/users`, userData);
        this.users.push(response.data);
        // Trigger background update of stats to keep Dashboard synchronized
        this.fetchStats();
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.error || err.message || 'Failed to create user';
        console.error('Error creating user:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(id, userData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(`${API_BASE}/users/${id}`, userData);
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
          this.users[index] = response.data;
        }
        // Trigger background update of stats to keep Dashboard synchronized
        this.fetchStats();
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.error || err.message || 'Failed to update user';
        console.error('Error updating user:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id) {
      this.loading = true;
      this.error = null;
      try {
        await axios.delete(`${API_BASE}/users/${id}`);
        this.users = this.users.filter(u => u.id !== id);
        // Trigger background update of stats to keep Dashboard synchronized
        this.fetchStats();
      } catch (err) {
        this.error = err.response?.data?.error || err.message || 'Failed to delete user';
        console.error('Error deleting user:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
