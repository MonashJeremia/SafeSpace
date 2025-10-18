<template>
  <div class="admin-container">
    <MainHeader />
    
    <!-- Admin Dashboard Content -->
    <main id="main-content" class="content" role="main">
      <div class="admin-header">
        <h1>Admin Dashboard</h1>
        <p class="header-subtitle">System administration and analytics</p>
      </div>

      <div class="admin-content">
        <!-- Stats Overview -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-info">
              <h3>{{ userStats.total }}</h3>
              <p>Total Users</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-info">
              <h3>{{ journalStats.totalEntries }}</h3>
              <p>Journal Entries</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-info">
              <h3>{{ Math.round(journalStats.averageMood * 10) / 10 }}</h3>
              <p>Average Mood</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-info">
              <h3>{{ journalStats.supportNeeded }}</h3>
              <p>Need Support</p>
            </div>
          </div>
        </div>

        <!-- User Management -->
        <div class="admin-section">
          <h2>User Management</h2>
          <div class="user-breakdown">
            <div class="user-type-card">
              <h4>Youth Users</h4>
              <p class="user-count">{{ userStats.youth }}</p>
              <small>{{ Math.round((userStats.youth / userStats.total) * 100) }}% of total</small>
            </div>
            <div class="user-type-card">
              <h4>Advisors</h4>
              <p class="user-count">{{ userStats.advisors }}</p>
              <small>{{ Math.round((userStats.advisors / userStats.total) * 100) }}% of total</small>
            </div>
            <div class="user-type-card">
              <h4>Administrators</h4>
              <p class="user-count">{{ userStats.admins }}</p>
              <small>{{ Math.round((userStats.admins / userStats.total) * 100) }}% of total</small>
            </div>
          </div>
          
          <div class="users-list">
            <h3>Recent Users</h3>
            <div class="users-table">
              <div class="table-header">
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
                <span>Joined</span>
              </div>
              <div v-for="user in recentUsers" :key="user.id" class="table-row">
                <span>{{ user.firstName }} {{ user.lastName }}</span>
                <span>{{ user.email }}</span>
                <span class="role-badge" :class="getRoleClass(user.userType)">{{ user.userType }}</span>
                <span>{{ formatDate(user.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Journal Analytics -->
        <div class="admin-section">
          <h2>Journal Analytics</h2>
          <div class="journal-analytics">
            <div class="analytics-card">
              <h4>Mood Trends</h4>
              <div class="mood-breakdown">
                <div class="mood-item">
                  <span class="mood-indicator low"></span>
                  <span>Low (1-3): {{ journalStats.moodBreakdown.low }} entries</span>
                </div>
                <div class="mood-item">
                  <span class="mood-indicator medium"></span>
                  <span>Medium (4-6): {{ journalStats.moodBreakdown.medium }} entries</span>
                </div>
                <div class="mood-item">
                  <span class="mood-indicator high"></span>
                  <span>High (7-10): {{ journalStats.moodBreakdown.high }} entries</span>
                </div>
              </div>
            </div>
            
            <div class="analytics-card">
              <h4>Recent Activity</h4>
              <p>Entries this week: {{ journalStats.thisWeek }}</p>
              <p>Entries this month: {{ journalStats.thisMonth }}</p>
              <p>Support requests: {{ journalStats.supportNeeded }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../main.js'
import MainHeader from '../components/MainHeader.vue'

export default {
  name: 'AdminDashboardView',
  components: {
    MainHeader
  },
  setup() {
    const router = useRouter()
    
    // Auth state using Firebase (same as MainHeader)
    const currentUser = ref(null)
    const isAuthenticated = computed(() => currentUser.value !== null)
    
    // Listen to Firebase auth state changes
    let unsubscribe = null
    onMounted(() => {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // Check if user has userType stored in localStorage from registration
          const storedUsers = JSON.parse(localStorage.getItem('safespace_users') || '[]')
          const userProfile = storedUsers.find(u => u.email.toLowerCase() === user.email.toLowerCase())
          
          currentUser.value = {
            email: user.email,
            firstName: userProfile?.firstName || user.email?.split("@")[0] || "User",
            lastName: userProfile?.lastName || "",
            userType: userProfile?.userType || "youth",
          }
        } else {
          currentUser.value = null
        }
      })
    })

    onUnmounted(() => {
      if (unsubscribe) unsubscribe()
    })
    
    // Data
    const userStats = ref({
      total: 0,
      youth: 0,
      advisors: 0,
      admins: 0
    })
    
    const journalStats = ref({
      totalEntries: 0,
      averageMood: 0,
      supportNeeded: 0,
      thisWeek: 0,
      thisMonth: 0,
      moodBreakdown: {
        low: 0,
        medium: 0,
        high: 0
      }
    })
    
    const recentUsers = ref([])

    // Load admin data
    const loadAdminData = () => {
      // Load user statistics
      const users = JSON.parse(localStorage.getItem('safespace_users') || '[]')
      userStats.value = {
        total: users.length,
        youth: users.filter(u => u.userType === 'youth').length,
        advisors: users.filter(u => u.userType === 'advisor').length,
        admins: users.filter(u => u.userType === 'admin').length
      }
      
      // Get recent users (last 5)
      recentUsers.value = users
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
      
      // Load journal analytics
      const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]')
      
      if (journalEntries.length > 0) {
        const totalMood = journalEntries.reduce((sum, entry) => sum + parseInt(entry.mood), 0)
        const averageMood = totalMood / journalEntries.length
        
        const now = new Date()
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        
        const thisWeekEntries = journalEntries.filter(entry => 
          new Date(entry.date) >= oneWeekAgo
        ).length
        
        const thisMonthEntries = journalEntries.filter(entry => 
          new Date(entry.date) >= oneMonthAgo
        ).length
        
        const supportNeeded = journalEntries.filter(entry => entry.needsSupport).length
        
        // Mood breakdown
        const moodBreakdown = journalEntries.reduce((acc, entry) => {
          const mood = parseInt(entry.mood)
          if (mood <= 3) acc.low++
          else if (mood <= 6) acc.medium++
          else acc.high++
          return acc
        }, { low: 0, medium: 0, high: 0 })
        
        journalStats.value = {
          totalEntries: journalEntries.length,
          averageMood,
          supportNeeded,
          thisWeek: thisWeekEntries,
          thisMonth: thisMonthEntries,
          moodBreakdown
        }
      }
    }

    // Utility methods
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const getRoleClass = (role) => {
      switch (role) {
        case 'admin': return 'admin'
        case 'advisor': return 'advisor'
        case 'youth': return 'youth'
        default: return 'unknown'
      }
    }

    onMounted(() => {
      loadAdminData()
    })

    return {
      isAuthenticated,
      currentUser,
      userStats,
      journalStats,
      recentUsers,
      formatDate,
      getRoleClass
    }
  }
}
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.content {
  padding: 0;
}

/* Access Control Styles */
.access-denied-container,
.login-required-container {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.access-denied-message,
.login-required-message {
  max-width: 600px;
  margin: 2rem auto;
  padding: 3rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.access-denied-icon,
.login-required-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.access-denied-message h1,
.login-required-message h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #212529;
  margin: 0 0 1rem 0;
}

.access-denied-text,
.login-required-text {
  font-size: 1.1rem;
  color: #6c757d;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.access-denied-actions,
.login-required-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Admin Header */
.admin-header {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.admin-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.header-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

/* Admin Content */
.admin-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border-left: 4px solid #007bff;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-info h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #212529;
  margin: 0 0 0.25rem 0;
}

.stat-info p {
  color: #6c757d;
  margin: 0;
  font-weight: 500;
}

/* Admin Sections */
.admin-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.admin-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #212529;
  margin: 0 0 1.5rem 0;
  border-bottom: 2px solid #f8f9fa;
  padding-bottom: 0.5rem;
}

/* User Management */
.user-breakdown {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.user-type-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  border: 2px solid #e9ecef;
}

.user-type-card h4 {
  color: #495057;
  margin: 0 0 1rem 0;
  font-size: 1rem;
}

.user-count {
  font-size: 2rem;
  font-weight: 700;
  color: #007bff;
  margin: 0 0 0.5rem 0;
}

.user-type-card small {
  color: #6c757d;
}

/* Users Table */
.users-table {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1.5fr;
  gap: 1rem;
  padding: 1rem;
  align-items: center;
}

.table-header {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
  border-bottom: 1px solid #e9ecef;
}

.table-row {
  border-bottom: 1px solid #f8f9fa;
}

.table-row:last-child {
  border-bottom: none;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.admin {
  background: #007bff;
  color: white;
}

.role-badge.advisor {
  background: #6c757d;
  color: white;
}

.role-badge.youth {
  background: #28a745;
  color: white;
}

/* Journal Analytics */
.journal-analytics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.analytics-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.analytics-card h4 {
  margin: 0 0 1rem 0;
  color: #495057;
}

.mood-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mood-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mood-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.mood-indicator.low {
  background: #dc3545;
}

.mood-indicator.medium {
  background: #ffc107;
}

.mood-indicator.high {
  background: #28a745;
}

@media (max-width: 768px) {
  .admin-header {
    padding: 2rem 1rem;
  }

  .admin-header h1 {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 1.5rem;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .table-header span,
  .table-row span {
    padding: 0.25rem 0;
  }

  .user-breakdown {
    grid-template-columns: 1fr;
  }

  .journal-analytics {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>