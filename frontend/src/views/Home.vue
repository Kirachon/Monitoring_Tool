<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="d-flex align-center">
        <h1 class="text-h4">Dashboard</h1>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-refresh"
          variant="text"
          @click="loadDashboard"
          :loading="loading"
          title="Refresh"
        ></v-btn>
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" closable @click:close="error = null" class="mb-4">
      {{ error }}
    </v-alert>

    <!-- Employee Dashboard -->
    <v-row v-if="userRole === 'Employee' && dashboardData">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Leave Balance</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <div class="text-center">
                  <div class="text-h3 text-primary">{{ dashboardData.leaveBalance.vacationLeave }}</div>
                  <div class="text-caption">Vacation Leave</div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="text-center">
                  <div class="text-h3 text-success">{{ dashboardData.leaveBalance.sickLeave }}</div>
                  <div class="text-caption">Sick Leave</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Pending Requests</v-card-title>
          <v-card-text>
            <div class="text-center">
              <div class="text-h2 text-warning">{{ dashboardData.pendingRequests }}</div>
              <div class="text-caption">Awaiting Approval</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card>
          <v-card-title>Upcoming Leaves</v-card-title>
          <v-card-text>
            <v-list v-if="dashboardData.upcomingLeaves.length > 0">
              <v-list-item v-for="leave in dashboardData.upcomingLeaves" :key="leave.id">
                <v-list-item-title>{{ leave.leaveType }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatDate(leave.startDate) }} - {{ formatDate(leave.endDate) }} ({{ leave.days }} days)
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <div v-else class="text-center text-grey">No upcoming leaves</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Supervisor Dashboard -->
    <v-row v-if="userRole === 'Supervisor' && dashboardData">
      <v-col cols="12" md="4">
        <v-card class="cursor-pointer" @click="$router.push('/pass-slips/approvals')">
          <v-card-title>Pending Approvals</v-card-title>
          <v-card-text>
            <div class="text-center">
              <div class="text-h2 text-warning">{{ dashboardData.pendingApprovals.total }}</div>
              <div class="text-caption">
                {{ dashboardData.pendingApprovals.passSlips }} Pass Slips, 
                {{ dashboardData.pendingApprovals.leaveRequests }} Leave Requests
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Team on Leave Today</v-card-title>
          <v-card-text>
            <v-list v-if="dashboardData.teamOnLeave.length > 0">
              <v-list-item v-for="(member, idx) in dashboardData.teamOnLeave" :key="idx">
                <v-list-item-title>{{ member.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ member.leaveType }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <div v-else class="text-center text-grey">No one on leave</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Department Leave Utilization</v-card-title>
          <v-card-text>
            <div class="text-center">
              <div class="text-h2 text-info">{{ dashboardData.departmentLeaveUtilization }}%</div>
              <div class="text-caption">This Year</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- HR Admin Dashboard -->
    <v-row v-if="(userRole === 'HR Administrator' || userRole === 'System Administrator') && dashboardData">
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>System Overview</v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item>
                <v-list-item-title>Total Employees</v-list-item-title>
                <template v-slot:append>
                  <strong>{{ dashboardData.systemOverview.totalEmployees }}</strong>
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Active Users</v-list-item-title>
                <template v-slot:append>
                  <strong>{{ dashboardData.systemOverview.activeUsers }}</strong>
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Pending Approvals</v-list-item-title>
                <template v-slot:append>
                  <strong class="text-warning">{{ dashboardData.systemOverview.pendingApprovals }}</strong>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Leave Statistics</v-card-title>
          <v-card-text>
            <div class="text-center mb-4">
              <div class="text-h3 text-primary">{{ dashboardData.leaveStatistics.totalDays }}</div>
              <div class="text-caption">Total Days This Month</div>
            </div>
            <div class="text-center">
              <div class="text-subtitle-2">Most Used: {{ dashboardData.leaveStatistics.mostUsedType }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Certificate Requests</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <div class="text-center">
                  <div class="text-h3 text-warning">{{ dashboardData.certificateRequests.pending }}</div>
                  <div class="text-caption">Pending</div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="text-center">
                  <div class="text-h3 text-success">{{ dashboardData.certificateRequests.completed }}</div>
                  <div class="text-caption">Completed</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card>
          <v-card-title>Recent Activities</v-card-title>
          <v-card-text>
            <v-list v-if="dashboardData.recentActivities.length > 0">
              <v-list-item v-for="activity in dashboardData.recentActivities.slice(0, 10)" :key="activity.id">
                <v-list-item-title>{{ activity.username }} - {{ activity.module }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ activity.action }} {{ activity.entityType }} | {{ formatDateTime(activity.timestamp) }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <div v-else class="text-center text-grey">No recent activities</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- System Admin Additional Widgets -->
    <v-row v-if="userRole === 'System Administrator' && dashboardData && dashboardData.systemHealth">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>System Health</v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item>
                <v-list-item-title>Database Size</v-list-item-title>
                <template v-slot:append>
                  <strong>{{ dashboardData.systemHealth.databaseSize }}</strong>
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Active Sessions</v-list-item-title>
                <template v-slot:append>
                  <strong>{{ dashboardData.systemHealth.activeSessions }}</strong>
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Errors (24h)</v-list-item-title>
                <template v-slot:append>
                  <strong :class="dashboardData.systemHealth.errorCount > 0 ? 'text-error' : ''">
                    {{ dashboardData.systemHealth.errorCount }}
                  </strong>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>User Activity</v-card-title>
          <v-card-text>
            <div class="text-center mb-4">
              <div class="text-h3 text-success">{{ dashboardData.userActivity.loginsToday }}</div>
              <div class="text-caption">Logins Today</div>
            </div>
            <div class="text-subtitle-2 mb-2">Most Active Users (7 days):</div>
            <v-list density="compact">
              <v-list-item v-for="user in dashboardData.userActivity.mostActiveUsers" :key="user.username">
                <v-list-item-title>{{ user.username }}</v-list-item-title>
                <template v-slot:append>
                  <strong>{{ user.actions }} actions</strong>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import dashboardService from '../services/dashboardService'

const authStore = useAuthStore()
const userRole = computed(() => authStore.user?.role)

const dashboardData = ref(null)
const loading = ref(false)
const error = ref(null)

const loadDashboard = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await dashboardService.getDashboard()
    dashboardData.value = response.data
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to load dashboard'
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadDashboard()
  
  // Auto-refresh every 5 minutes
  setInterval(loadDashboard, 5 * 60 * 1000)
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>

