<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    @click="rail = false"
  >
    <v-list-item
      :prepend-avatar="avatar"
      :title="authStore.fullName"
      :subtitle="authStore.rolesString"
      nav
    >
      <template v-slot:append>
        <v-btn
          icon="mdi-chevron-left"
          variant="text"
          @click.stop="rail = !rail"
        />
      </template>
    </v-list-item>

    <v-divider />

    <v-list density="compact" nav>
      <v-list-subheader>Self Service</v-list-subheader>

      <!-- Dashboard - visible to all -->
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        value="dashboard"
        to="/dashboard"
      />

      <!-- Pass Slips -->
      <v-list-item
        v-if="hasPermission('pass_slip.create')"
        prepend-icon="mdi-file-document"
        title="Pass Slips"
        value="pass-slips"
        to="/pass-slips"
      />

      <!-- Leave -->
      <v-list-item
        v-if="hasPermission('leave.create')"
        prepend-icon="mdi-calendar-check"
        title="Leave"
        value="leave"
        to="/leave"
      />

      <!-- Certificate Request -->
      <v-list-item
        v-if="hasPermission('certificate.request')"
        prepend-icon="mdi-certificate"
        title="Request Certificate"
        value="certificate-request"
        to="/certificates/request"
      />

      <!-- Approvals section - only show if user can approve -->
      <template v-if="canApprove">
        <v-list-subheader>Approvals</v-list-subheader>

        <v-list-group value="approvals">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-check-circle"
              title="Approvals"
            >
              <template v-if="pendingCount > 0" v-slot:append>
                <v-badge
                  :content="pendingCount"
                  color="error"
                  inline
                />
              </template>
            </v-list-item>
          </template>

          <v-list-item
            v-if="hasPermission('pass_slip.approve')"
            prepend-icon="mdi-clipboard-check"
            title="Pass Slips"
            value="pass-slip-approvals"
            to="/pass-slips/approvals"
          />

          <v-list-item
            v-if="hasPermission('leave.approve')"
            prepend-icon="mdi-calendar-check"
            title="Leave Requests"
            value="leave-approvals"
            to="/leave/approvals"
          />
        </v-list-group>
      </template>

      <!-- HR Management section - only show if user can manage employees -->
      <template v-if="canManageEmployees">
        <v-divider class="my-2" />

        <v-list-subheader>HR Management</v-list-subheader>

        <!-- Departments -->
        <v-list-item
          prepend-icon="mdi-office-building"
          title="Departments"
          value="departments"
          to="/departments"
        />

        <!-- Employees -->
        <v-list-item
          prepend-icon="mdi-account-multiple"
          title="Employees"
          value="employees"
          to="/employees"
        />
      </template>

      <!-- Certificates section - only show if user can generate certificates -->
      <template v-if="canGenerateCertificates">
        <v-list-subheader>Certificates</v-list-subheader>

        <v-list-group value="certificates">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-certificate"
              title="Certificates"
            />
          </template>

          <v-list-item
            v-if="hasPermission('certificate.manage_templates')"
            prepend-icon="mdi-file-document-multiple"
            title="Templates"
            value="certificate-templates"
            to="/certificates/templates"
          />

          <v-list-item
            v-if="hasPermission('certificate.generate')"
            prepend-icon="mdi-certificate-outline"
            title="Generate"
            value="certificate-generate"
            to="/certificates/generate"
          />

          <v-list-item
            v-if="hasPermission('certificate.generate')"
            prepend-icon="mdi-history"
            title="Issuance Log"
            value="certificate-log"
            to="/certificates/log"
          />

          <v-list-item
            v-if="hasPermission('certificate.manage_templates')"
            prepend-icon="mdi-draw"
            title="Digital Signatures"
            value="digital-signatures"
            to="/signatures"
          />
        </v-list-group>
      </template>

      <!-- Reports section - only show if user can view reports or has system access -->
      <template v-if="canViewReports || hasSystemAccess">
        <v-list-subheader>Reports</v-list-subheader>

        <v-list-group value="reports">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-chart-bar" title="Reports" />
          </template>

          <v-list-item
            v-if="canViewReports"
            prepend-icon="mdi-chart-bar"
            title="Pass Slips"
            value="reports-pass-slips"
            to="/reports/pass-slips"
          />

          <v-list-item
            v-if="canViewReports"
            prepend-icon="mdi-calendar"
            title="Leave"
            value="reports-leave"
            to="/reports/leave"
          />

          <v-list-item
            v-if="canViewReports"
            prepend-icon="mdi-certificate"
            title="Certificates"
            value="reports-certificates"
            to="/reports/certificates"
          />

          <v-list-item
            v-if="hasSystemAccess"
            prepend-icon="mdi-shield-key"
            title="Audit Logs"
            value="reports-audit"
            to="/reports/audit-logs"
          />

          <v-list-item
            v-if="canViewReports"
            prepend-icon="mdi-account"
            title="Employees"
            value="reports-employees"
            to="/reports/employees"
          />
        </v-list-group>
      </template>

      <!-- System section - only show if user has system access -->
      <template v-if="hasSystemAccess">
        <v-divider class="my-2" />

        <v-list-subheader>System</v-list-subheader>

        <!-- User Management -->
        <v-list-item
          prepend-icon="mdi-account-cog"
          title="User Management"
          value="users"
          to="/users"
        />

        <!-- System Settings -->
        <v-list-item
          prepend-icon="mdi-cog"
          title="System Settings"
          value="settings"
          to="/settings"
        />
      </template>


    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { usePermissions } from '@/composables/usePermissions'

const authStore = useAuthStore()
const {
  hasPermission,
  canApprove,
  canManageEmployees,
  canGenerateCertificates,
  canViewReports,
  hasSystemAccess
} = usePermissions()

const drawer = ref(true)
const rail = ref(false)

// Placeholder for pending approvals count
const pendingCount = ref(0)

// Placeholder avatar
const avatar = computed(() => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.fullName)}&background=0038A8&color=fff`
})
</script>

