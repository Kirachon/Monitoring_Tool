<template>
  <ListViewLayout
    title="My Pass Slips"
    subtitle="Manage your pass slip requests"
    :search-enabled="true"
    v-model:search="filters.search"
    :breadcrumbs="[{ title: 'Dashboard', to: '/dashboard' }, { title: 'Pass Slips' }]"
  >
    <template #actions>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="$router.push('/pass-slips/request')">Request Pass Slip</v-btn>
    </template>

    <template #filters>
      <HelpTooltip text="Search by destination or reason. Use filters to narrow results." aria-label="Search help" />
      <v-select
        v-model="filters.status"
        :items="['Pending', 'Approved', 'Completed', 'Denied', 'Cancelled']"
        label="Status"
        prepend-icon="mdi-filter"
        density="compact"
        clearable
        @update:modelValue="loadPassSlips"
        style="max-width: 220px;"
      />
      <v-text-field v-model="filters.dateFrom" label="Date From" type="date" density="compact" clearable @input="loadPassSlips" style="max-width: 200px;" />
      <v-text-field v-model="filters.dateTo" label="Date To" type="date" density="compact" clearable @input="loadPassSlips" style="max-width: 200px;" />
    </template>

    <template #default>
            <v-alert v-if="error" type="error" closable @click:close="error = null" class="mb-4">
              {{ error }}
            </v-alert>

            <v-alert v-if="success" type="success" closable @click:close="success = null" class="mb-4">
              {{ success }}
            </v-alert>

            <!-- Filters -->


            <v-data-table
              :headers="headers"
              :items="passSlips"
              :loading="loading"
              :items-per-page="25"
            >
              <template #item.status="{ item }">
                <StatusChip :status="item.status.toLowerCase()" />
                <StatusChip v-if="isOverdue(item)" status="overdue" :icon="'mdi-alert'" variant="tonal" />
              </template>

              <template #item.actualTimeIn="{ item }">
                {{ item.actualTimeIn || '-' }}
              </template>

              <template #item.duration="{ item }">
                {{ calculateDuration(item) }}
              </template>

              <template #item.actions="{ item }">
                <v-btn
                  v-if="canRecordReturn(item)"
                  icon="mdi-clock-check"
                  size="small"
                  variant="text"
                  color="primary"
                  @click="openRecordReturnDialog(item)"
                  title="Record Return"
                />
                <v-btn
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  @click="viewPassSlip(item)"
                  title="View"
                />
              </template>
            </v-data-table>
    </template>
  </ListViewLayout>

  <!-- Record Return Dialog -->
    <DialogWrapper v-model="recordReturnDialog" title="Record Return Time" :max-width="500" :persistent="true">
      <v-form ref="returnForm">
        <p class="mb-4">
          Recording return for pass slip <strong>{{ selectedPassSlip?.referenceNo }}</strong>
        </p>
        <v-text-field
          v-model="actualTimeIn"
          label="Actual Time In *"
          type="time"
          :rules="[v => !!v || 'Actual time in is required']"
          required
        />
      </v-form>
      <template #actions>
        <v-spacer />
        <v-btn variant="text" @click="closeRecordReturnDialog">Cancel</v-btn>
        <v-btn color="primary" @click="recordReturn" :loading="recording">Record</v-btn>
      </template>
    </DialogWrapper>
</template>

<script setup>
import ListViewLayout from '@/components/ListViewLayout.vue'
import HelpTooltip from '@/components/HelpTooltip.vue'
import StatusChip from '@/components/StatusChip.vue'
import { ref, onMounted } from 'vue'
import passSlipService from '@/services/passSlipService'
import { useNotification } from '@/composables/useNotification'

const { showError } = useNotification()

const loading = ref(false)
const passSlips = ref([])
const error = ref(null)
const success = ref(null)

import DialogWrapper from '@/components/DialogWrapper.vue'

const filters = ref({
  search: '',
  status: null,
  dateFrom: null,
  dateTo: null
})

const recordReturnDialog = ref(false)
const selectedPassSlip = ref(null)
const actualTimeIn = ref('')
const recording = ref(false)
const returnForm = ref(null)

const headers = [
  { title: 'Reference No', key: 'referenceNo' },
  { title: 'Type', key: 'passSlipType' },
  { title: 'Date', key: 'date' },
  { title: 'Time Out', key: 'timeOut' },
  { title: 'Expected Time In', key: 'expectedTimeIn' },
  { title: 'Actual Time In', key: 'actualTimeIn' },
  { title: 'Duration', key: 'duration' },
  { title: 'Destination', key: 'destination' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false }
]

onMounted(async () => {
  await loadPassSlips()
})

async function loadPassSlips() {
  loading.value = true
  error.value = null
  try {
    const params = {}
    if (filters.value.search) params.search = filters.value.search
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.dateFrom) params.dateFrom = filters.value.dateFrom
    if (filters.value.dateTo) params.dateTo = filters.value.dateTo

    const response = await passSlipService.getPassSlips(params)
    passSlips.value = response.data
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to load pass slips'
  } finally {
    loading.value = false
  }
}

function getStatusColor(status) {
  const colors = {
    'Pending': 'warning',
    'Approved': 'success',
    'Completed': 'info',
    'Denied': 'error',
    'Cancelled': 'grey'
  }
  return colors[status] || 'default'
}

function canRecordReturn(passSlip) {
  if (passSlip.status !== 'Approved' || passSlip.actualTimeIn) return false

  const now = new Date()
  const passSlipDate = new Date(passSlip.date)
  const [hours, minutes] = passSlip.timeOut.split(':')
  passSlipDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

  return now >= passSlipDate
}

function isOverdue(passSlip) {
  if (passSlip.status !== 'Approved' || passSlip.actualTimeIn) return false

  const now = new Date()
  const passSlipDate = new Date(passSlip.date)
  const [hours, minutes] = passSlip.expectedTimeIn.split(':')
  passSlipDate.setHours(parseInt(hours), parseInt(minutes) + 30, 0, 0)

  return now > passSlipDate
}

function calculateDuration(passSlip) {
  if (!passSlip.actualTimeIn || !passSlip.timeOut) return '-'

  const [outHours, outMinutes] = passSlip.timeOut.split(':').map(Number)
  const [inHours, inMinutes] = passSlip.actualTimeIn.split(':').map(Number)

  const outTotalMinutes = outHours * 60 + outMinutes
  const inTotalMinutes = inHours * 60 + inMinutes

  const durationMinutes = inTotalMinutes - outTotalMinutes
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60

  return `${hours}h ${minutes}m`
}

function openRecordReturnDialog(passSlip) {
  selectedPassSlip.value = passSlip
  const now = new Date()
  actualTimeIn.value = now.toTimeString().substring(0, 5)
  recordReturnDialog.value = true
}

function closeRecordReturnDialog() {
  recordReturnDialog.value = false
  selectedPassSlip.value = null
  actualTimeIn.value = ''
}

async function recordReturn() {
  const { valid } = await returnForm.value.validate()
  if (!valid) return

  recording.value = true
  error.value = null

  try {
    await passSlipService.recordReturn(selectedPassSlip.value.id, actualTimeIn.value)
    success.value = `Return time recorded successfully for ${selectedPassSlip.value.referenceNo}`
    closeRecordReturnDialog()
    await loadPassSlips()
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to record return time'
  } finally {
    recording.value = false
  }
}

function viewPassSlip(passSlip) {
  // Navigate to detail view
  console.log('View pass slip:', passSlip)
}
</script>

