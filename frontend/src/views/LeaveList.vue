<template>
  <ListViewLayout
    title="My Leave Requests"
    subtitle="File and track your leave"
    :search-enabled="true"
    v-model:search="filters.search"
    :breadcrumbs="[{ title: 'Dashboard', to: '/dashboard' }, { title: 'Leave' }]"
  >
    <template #actions>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="$router.push('/leave/request')">Request Leave</v-btn>
    </template>

    <template #filters>
      <HelpTooltip text="Search by type or reason. Use status to filter results." aria-label="Search help" />
      <v-select
        v-model="filters.status"
        :items="['Pending', 'Approved', 'Completed', 'Denied', 'Cancelled']"
        label="Status"
        prepend-icon="mdi-filter"
        density="compact"
        clearable
        style="max-width: 220px;"
      />
      <v-text-field v-model="filters.dateFrom" label="Date From" type="date" density="compact" clearable style="max-width: 200px;" />
      <v-text-field v-model="filters.dateTo" label="Date To" type="date" density="compact" clearable style="max-width: 200px;" />
    </template>

    <template #default>
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :loading="loading"
      >
        <template #item.status="{ item }">
          <StatusChip :status="item.status.toLowerCase()" />
        </template>
        <template #item.actions="{ item }">
          <v-btn size="x-small" variant="text" color="primary" icon="mdi-pencil" class="mr-1" v-if="item.status==='Pending' && !isPastDate(item.dateFrom)" @click="modifyRequest(item)"></v-btn>
          <v-tooltip :text="isPastDate(item.dateFrom) ? 'Cannot cancel past leave requests' : ''" location="top">
            <template v-slot:activator="{ props }">
              <span v-bind="props">
                <v-btn
                  size="x-small"
                  variant="text"
                  color="error"
                  icon="mdi-cancel"
                  v-if="item.status==='Pending' || item.status==='Approved'"
                  :disabled="isPastDate(item.dateFrom)"
                  @click="promptCancel(item)"
                ></v-btn>
              </span>
            </template>
          </v-tooltip>
        </template>
      </v-data-table>

      <DialogWrapper v-model="cancelDialog" title="Cancel Leave Request" max-width="520" @confirm="confirmCancel">
        <template #default>
          Are you sure you want to cancel leave request <strong>{{ selected?.referenceNo }}</strong>?
          <v-textarea v-model="cancelReason" label="Reason (optional)" rows="2" class="mt-3" />
        </template>
        <template #actions>
          <v-spacer />
          <v-btn variant="text" @click="cancelDialog=false">Close</v-btn>
          <v-btn color="error" @click="confirmCancel" :loading="loading">Cancel Request</v-btn>
        </template>
      </DialogWrapper>
    </template>
  </ListViewLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import leaveService from '@/services/leaveService'
import { useNotification } from '@/composables/useNotification'
import ListViewLayout from '@/components/ListViewLayout.vue'
import HelpTooltip from '@/components/HelpTooltip.vue'
import StatusChip from '@/components/StatusChip.vue'
import DialogWrapper from '@/components/DialogWrapper.vue'

const { showError, showSuccess } = useNotification()

const loading = ref(false)
const leaveRequests = ref([])
const cancelDialog = ref(false)
const selected = ref(null)
const cancelReason = ref('')

const filters = ref({ search: '', status: null, dateFrom: null, dateTo: null })
const filteredItems = computed(() => {
  let items = [...leaveRequests.value]
  if (filters.value.search) {
    const q = filters.value.search.toLowerCase()
    items = items.filter(i => (i.leaveTypeName || '').toLowerCase().includes(q) || (i.reason || '').toLowerCase().includes(q))
  }
  if (filters.value.status) items = items.filter(i => i.status === filters.value.status)
  // Simple date filtering if dateFrom/dateTo present
  return items
})

function promptCancel(item) {
  selected.value = item
  cancelReason.value = ''
  cancelDialog.value = true
}

async function confirmCancel() {
  try {
    await leaveService.cancelLeaveRequest(selected.value.id, cancelReason.value)
    showSuccess('Leave request cancelled')
    cancelDialog.value = false
    await loadLeaveRequests()
  } catch (e) {
    showError(e.response?.data?.error?.message || 'Cancellation failed')
  }
}

function modifyRequest(item) {
  // Navigate to request page with query id
  window.location.href = `/leave/request?id=${encodeURIComponent(item.id)}`
}

const isPastDate = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

const headers = [
  { title: 'Reference No', key: 'referenceNo' },
  { title: 'Leave Type', key: 'leaveTypeName' },
  { title: 'Date From', key: 'dateFrom' },
  { title: 'Date To', key: 'dateTo' },
  { title: 'Days', key: 'days' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false }
]

onMounted(async () => {
  await loadLeaveRequests()
})

async function loadLeaveRequests() {
  loading.value = true
  try {
    const data = await leaveService.getLeaveRequests()
    leaveRequests.value = data
  } catch (error) {
    showError('Failed to load leave requests')
  } finally {
    loading.value = false
  }
}

function getStatusColor(status) {
  const colors = {
    'Pending': 'warning',
    'Approved': 'success',
    'Denied': 'error',
    'Cancelled': 'grey'
  }
  return colors[status] || 'default'
}
</script>

