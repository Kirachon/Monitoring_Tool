<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-clipboard-check" class="mr-2"></v-icon>
            Pending Leave Approvals
            <v-chip v-if="approvals?.length > 0" class="ml-2" color="warning" size="small">
              {{ approvals.length }}
            </v-chip>
            <v-spacer></v-spacer>
            <v-btn
              class="mr-2"
              color="success"
              variant="tonal"
              :disabled="selected?.length === 0"
              @click="approveSelected"
            >
              <v-icon start>mdi-check-all</v-icon>
              Approve Selected
            </v-btn>
            <v-btn
              icon="mdi-refresh"
              variant="text"
              @click="loadApprovals"
              :loading="loading"
            ></v-btn>
          </v-card-title>

          <v-card-text>
            <v-alert v-if="error" type="error" closable @click:close="error = null" class="mb-4">
              {{ error }}
            </v-alert>

            <v-alert v-if="success" type="success" closable @click:close="success = null" class="mb-4">
              {{ success }}
            </v-alert>

            <v-data-table
              v-model:selected="selected"
              show-select
              :headers="headers"
              :items="approvals"
              :loading="loading"
              :items-per-page="25"
              class="elevation-1"
            >
              <template v-slot:item.employeeName="{ item }">
                <div>
                  <div class="font-weight-medium">{{ item.employeeName }}</div>
                  <div class="text-caption text-grey">{{ item.employeeNumber }}</div>
                </div>
              </template>

              <template v-slot:item.dates="{ item }">
                <div>
                  <div>{{ formatDate(item.dateFrom) }} - {{ formatDate(item.dateTo) }}</div>
                  <div class="text-caption">
                    {{ item.days }} {{ item.days === 1 ? 'day' : 'days' }}
                    <span v-if="item.halfDay">({{ item.halfDay }})</span>
                  </div>
                </div>
              </template>

              <template v-slot:item.leaveTypeName="{ item }">
                <v-chip size="small" color="primary" variant="tonal">
                  {{ item.leaveTypeName }}
                </v-chip>
              </template>

              <template v-slot:item.currentBalance="{ item }">
                <v-chip
                  size="small"
                  :color="item.currentBalance >= item.days ? 'success' : 'error'"
                  variant="tonal"
                >
                  {{ item.currentBalance }} days
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-tooltip :text="getActionDisabledReason(item)" location="top">
                  <template v-slot:activator="{ props }">
                    <span v-bind="props">
                      <v-btn
                        color="success"
                        size="small"
                        variant="tonal"
                        class="mr-2"
                        @click="approveRequest(item)"
                        :disabled="isActionDisabled(item)"
                      >
                        <v-icon start>mdi-check</v-icon>
                        Approve
                      </v-btn>
                    </span>
                  </template>
                </v-tooltip>
                <v-tooltip :text="getActionDisabledReason(item)" location="top">
                  <template v-slot:activator="{ props }">
                    <span v-bind="props">
                      <v-btn
                        color="error"
                        size="small"
                        variant="tonal"
                        @click="openDenyDialog(item)"
                        :disabled="isActionDisabled(item)"
                      >
                        <v-icon start>mdi-close</v-icon>
                        Deny
                      </v-btn>
                    </span>
                  </template>
                </v-tooltip>
              </template>

              <template v-slot:no-data>
                <div class="text-center py-8">
                  <v-icon size="64" color="grey-lighten-1">mdi-clipboard-check-outline</v-icon>
                  <div class="text-h6 mt-4">No Pending Approvals</div>
                  <div class="text-body-2 text-grey">All leave requests have been processed</div>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Deny Dialog -->
    <DialogWrapper v-model="denyDialog" title="Deny Leave Request" :max-width="500">
      <p class="mb-4">
        You are about to deny the leave request from <strong>{{ selectedRequest?.employeeName }}</strong>.
      </p>
      <v-textarea
        v-model="denialReason"
        label="Reason for Denial *"
        placeholder="Please provide a reason for denying this request (minimum 10 characters)"
        rows="4"
        :rules="[
          v => !!v || 'Reason is required',
          v => (v && v.length >= 10) || 'Reason must be at least 10 characters'
        ]"
        counter
        required
      />
      <template #actions>
        <v-spacer />
        <v-btn variant="text" @click="closeDenyDialog">Cancel</v-btn>
        <v-btn color="error" @click="denyRequest" :disabled="!denialReason || denialReason.length < 10" :loading="denying">Deny Request</v-btn>
      </template>
    </DialogWrapper>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import leaveService from '../services/leaveService'

const router = useRouter()

const approvals = ref([])
const selected = ref([])
const loading = ref(false)
const error = ref(null)
const success = ref(null)

import DialogWrapper from '@/components/DialogWrapper.vue'

const denyDialog = ref(false)
const selectedRequest = ref(null)
const denialReason = ref('')
const denying = ref(false)

const headers = [
  { title: 'Employee', key: 'employeeName', sortable: true },
  { title: 'Leave Type', key: 'leaveTypeName', sortable: true },
  { title: 'Dates', key: 'dates', sortable: false },
  { title: 'Current Balance', key: 'currentBalance', sortable: true },
  { title: 'Reason', key: 'reason', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

const loadApprovals = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await leaveService.getPendingApprovals()
    // Service already extracts response.data?.data, so data is the array directly
    approvals.value = Array.isArray(data) ? data : []
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to load pending approvals'
    approvals.value = [] // Ensure approvals is always an array
  } finally {
    loading.value = false
  }
}

const approveRequest = async (request) => {
  if (!confirm(`Are you sure you want to approve this leave request from ${request.employeeName}?`)) {
    return
  }
  loading.value = true
  error.value = null
  try {
    await leaveService.approveLeaveRequest(request.id)
    success.value = `Leave request approved successfully. Balance updated.`
    await loadApprovals()
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to approve leave request'
  } finally {
    loading.value = false
  }
}


const approveSelected = async () => {
  if (selected.value.length === 0) return
  loading.value = true
  error.value = null
  try {
    for (const req of selected.value) {
      await leaveService.approveLeaveRequest(req.id)
    }
    success.value = `${selected.value.length} request(s) approved.`
    selected.value = []
    await loadApprovals()
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to approve selected requests'
  } finally {
    loading.value = false
  }
}

const openDenyDialog = (request) => {
  selectedRequest.value = request
  denialReason.value = ''
  denyDialog.value = true
}

const closeDenyDialog = () => {
  denyDialog.value = false
  selectedRequest.value = null
  denialReason.value = ''
}

const denyRequest = async () => {
  if (!denialReason.value || denialReason.value.length < 10) {
    return
  }

  denying.value = true
  error.value = null

  try {
    await leaveService.denyLeaveRequest(selectedRequest.value.id, denialReason.value)
    success.value = `Leave request denied successfully.`
    closeDenyDialog()
    await loadApprovals()
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to deny leave request'
  } finally {
    denying.value = false
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const isPastDate = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

const isActionDisabled = (item) => {
  // Disable if insufficient balance
  if (item.currentBalance < item.days) {
    return true
  }
  // Disable if leave start date has passed
  if (isPastDate(item.dateFrom)) {
    return true
  }
  return false
}

const getActionDisabledReason = (item) => {
  if (item.currentBalance < item.days) {
    return 'Insufficient leave balance'
  }
  if (isPastDate(item.dateFrom)) {
    return 'Cannot modify past leave requests'
  }
  return ''
}

onMounted(() => {
  loadApprovals()
})
</script>

