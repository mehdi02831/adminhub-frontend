<script setup>
import { onMounted, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import StatsCard from '../components/StatsCard.vue'
import { Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Legend
)

const userStore = useUserStore()

onMounted(async () => {
  // Fetch users and stats in parallel on load
  await Promise.all([
    userStore.fetchUsers(),
    userStore.fetchStats()
  ])
})

// Calculate recent users (last 5 by created_at date descending)
const recentUsers = computed(() => {
  return [...userStore.users]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
})

// Date formatter
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Doughnut Chart Data (Admin vs User)
const roleChartData = computed(() => {
  const adminsCount = userStore.stats.admins
  const usersCount = Math.max(0, userStore.stats.total_users - adminsCount)

  return {
    labels: ['Admins', 'Users'],
    datasets: [
      {
        data: [adminsCount, usersCount],
        backgroundColor: ['#8b5cf6', '#a5b4fc'], // Purple for admin, soft indigo for user
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 4
      }
    ]
  }
})

// Doughnut Options
const roleChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: { family: 'Inter', size: 12, weight: '500' },
        color: '#1f2937',
        padding: 15
      }
    }
  },
  cutout: '70%'
}

// Bar Chart Data (Active vs Inactive)
const statusChartData = computed(() => {
  return {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        label: 'Users Status',
        data: [userStore.stats.active_users, userStore.stats.inactive_users],
        backgroundColor: ['#10b981', '#ef4444'], // Emerald green vs Rose red
        borderRadius: 6,
        barThickness: 32,
        borderWidth: 0
      }
    ]
  }
})

// Bar Options
const statusChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        font: { family: 'Inter', size: 11 },
        color: '#6b7280'
      },
      grid: {
        color: '#e5e7eb',
        drawBorder: false
      }
    },
    x: {
      ticks: {
        font: { family: 'Inter', size: 11, weight: '500' },
        color: '#6b7280'
      },
      grid: {
        display: false
      }
    }
  }
}
</script>

<template>
  <div class="dashboard-view">
    <div class="page-header">
      <h1 class="page-title">Dashboard Overview</h1>
      <span class="date-badge">{{ formatDate(new Date().toISOString()) }}</span>
    </div>

    <!-- Stats Section -->
    <div class="stats-grid">
      <StatsCard 
        label="Total Users" 
        :value="userStore.stats.total_users" 
        type="total" 
      />
      <StatsCard 
        label="Active Users" 
        :value="userStore.stats.active_users" 
        type="active" 
      />
      <StatsCard 
        label="Inactive Users" 
        :value="userStore.stats.inactive_users" 
        type="inactive" 
      />
      <StatsCard 
        label="Administrators" 
        :value="userStore.stats.admins" 
        type="admins" 
      />
    </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      <!-- Doughnut Chart Card -->
      <div class="card chart-card">
        <h3 class="chart-title">User Roles Breakdown</h3>
        <div class="chart-container">
          <Doughnut :data="roleChartData" :options="roleChartOptions" />
        </div>
      </div>

      <!-- Bar Chart Card -->
      <div class="card chart-card">
        <h3 class="chart-title">User Status Breakdown</h3>
        <div class="chart-container">
          <Bar :data="statusChartData" :options="statusChartOptions" />
        </div>
      </div>
    </div>

    <!-- Recent Users Section -->
    <div class="card recent-users-card">
      <div class="card-header">
        <h3 class="card-title">Recent Registrations</h3>
        <router-link to="/users" class="btn btn-secondary btn-sm">View All Users</router-link>
      </div>

      <div class="table-container recent-table-container">
        <table class="custom-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in recentUsers" :key="user.id">
              <td>
                <div class="recent-user-cell">
                  <div class="user-avatar-small">{{ user.name.charAt(0) }}</div>
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
            </tr>
            <tr v-if="recentUsers.length === 0">
              <td colspan="5" class="no-data-cell">No users registered yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.date-badge {
  background-color: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  box-shadow: var(--shadow-sm);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 1.25rem;
  border-left: 3px solid var(--primary-color);
  padding-left: 0.625rem;
}

.chart-container {
  position: relative;
  height: 250px;
  width: 100%;
}

.recent-users-card {
  padding: 1.5rem 0 0 0;
  overflow: hidden;
}

.card-header {
  padding: 0 1.5rem 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main);
}

.recent-table-container {
  border: none;
  border-radius: 0;
  border-top: 1px solid var(--border-color);
}

.recent-user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar-small {
  width: 28px;
  height: 28px;
  background-color: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--text-main);
  font-size: 0.75rem;
  border: 1px solid var(--border-color);
}

.user-name-text {
  font-weight: 600;
  color: var(--text-main);
}

.user-email-text {
  color: var(--text-muted);
}

.user-date {
  color: var(--text-muted);
  white-space: nowrap;
}

.no-data-cell {
  text-align: center;
  color: var(--text-muted);
  padding: 3rem;
}

@media (max-width: 480px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-container {
    height: 220px;
  }
}
</style>
