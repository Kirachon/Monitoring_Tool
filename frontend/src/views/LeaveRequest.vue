<template>
  <FormViewLayout
    title="Request Leave"
    subtitle="Submit a new leave request"
    :breadcrumbs="[{ title: 'Dashboard', to: '/dashboard' }, { title: 'Leave', to: '/leave/requests' }, { title: 'Request' }]"
  >
    <!-- Leave Balance -->
    <v-alert type="info" class="mb-4">
      <div><strong>Your Leave Balance:</strong></div>
      <div v-for="(bal, code) in balance" :key="code">
        {{ bal.name }}: {{ bal.available }} days available ({{ bal.balance }} total, {{ bal.used }} used)
      </div>
    </v-alert>

    <v-form ref="formRef">
      <!-- Place Reason first so the first input is not the v-select combobox -->
      <v-textarea
        v-model="formData.reason"
        label="Reason"
        variant="outlined"
        rows="3"
        class="mb-4"
      />

      <v-select
        v-model="formData.leaveTypeId"
        :items="leaveTypes"
        item-title="name"
        item-value="id"
        label="Leave Type *"
        :rules="[rules.required]"
        variant="outlined"
        class="mb-4"
      />

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.dateFrom"
            label="Date From *"
            type="date"
            :rules="[rules.required]"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.dateTo"
            label="Date To *"
            type="date"
            :rules="[rules.required]"
            variant="outlined"
          />
        </v-col>
      </v-row>

      <v-checkbox
        v-model="formData.halfDay"
        label="Half Day"
      />

      <v-select
        v-if="formData.halfDay"
        v-model="formData.halfDayPeriod"
        :items="['AM', 'PM']"
        label="Half Day Period"
        variant="outlined"
      />
    </v-form>

    <template #actions>
      <v-btn variant="text" @click="$router.push('/leave/requests')">Cancel</v-btn>
      <v-spacer />
      <v-btn color="primary" @click="submit" :loading="submitting">
        Submit Request
      </v-btn>
    </template>

    <v-dialog v-model="conflictDialog" max-width="560">
      <v-card>
        <v-card-title>Potential Conflict Detected</v-card-title>
        <v-card-text>
          <v-alert type="warning" variant="tonal">
            {{ conflictWarning }}
          </v-alert>
          Do you want to proceed and submit this leave request for supervisor approval?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="conflictDialog=false">Cancel</v-btn>
          <v-btn color="primary" @click="confirmSubmit">Proceed</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </FormViewLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import leaveService from '@/services/leaveService'
import { useNotification } from '@/composables/useNotification'
import FormViewLayout from '@/components/FormViewLayout.vue'

const router = useRouter()
const route = useRoute()
const { showSuccess, showError } = useNotification()

const formRef = ref(null)
const submitting = ref(false)
const balance = ref({})
const leaveTypes = ref([])

const conflictDialog = ref(false)
const conflictWarning = ref('')
let pendingSubmit = false

const formData = ref({
  leaveTypeId: null,
  dateFrom: '',
  dateTo: '',
  halfDay: false,
  halfDayPeriod: null,
  reason: ''
})
const mode = ref('create')
const requestId = ref(null)

const rules = {
  required: (value) => !!value || 'This field is required'
}

onMounted(async () => {
  await loadBalance()
  await loadLeaveTypes()
  // If modifying an existing request, load it
  if (route.query.id) {
    try {
      const r = await leaveService.getLeaveRequestById(route.query.id)
      formData.value = {
        leaveTypeId: r.leaveTypeId,
        dateFrom: r.dateFrom?.substring(0,10),
        dateTo: r.dateTo?.substring(0,10),
        halfDay: r.halfDay,
        halfDayPeriod: r.halfDayPeriod,
        reason: r.reason || ''
      }
      mode.value = 'edit'
      requestId.value = r.id
    } catch (e) {
      console.warn('Failed to load request', e)
    }
  }
})

async function loadBalance() {
  try {
    const data = await leaveService.getLeaveBalance()
    balance.value = data
  } catch (error) {
    showError('Failed to load leave balance')
  }
}

async function loadLeaveTypes() {
  try {
    const data = await leaveService.getLeaveTypes()
    leaveTypes.value = data
  } catch (error) {
    showError('Failed to load leave types')
  }
}

async function submit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  // Check department conflicts before submission
  try {
    const conflict = await leaveService.checkConflicts(formData.value.dateFrom, formData.value.dateTo)
    if (conflict?.hasConflict) {
      conflictWarning.value = data.warning || 'High overlap detected in your department during this period.'
      conflictDialog.value = true
      pendingSubmit = true
      return
    }
  } catch (e) {
    // Non-blocking: just log to console and continue
    console.warn('Conflict check failed:', e)
  }

  await doSubmit()
}

async function confirmSubmit() {
  conflictDialog.value = false
  if (pendingSubmit) {
    await doSubmit()
    pendingSubmit = false
  }
}

async function doSubmit() {
  submitting.value = true
  try {
    if (mode.value === 'edit' && requestId.value) {
      await leaveService.updateLeaveRequest(requestId.value, formData.value)
      showSuccess('Leave request updated and sent for re-approval')
    } else {
      const created = await leaveService.createLeaveRequest(formData.value)
      showSuccess(`Leave request ${created.referenceNo} created successfully`)
    }
    setTimeout(() => {
      router.push('/leave/requests')
    }, 1200)
  } catch (error) {
    showError(error.response?.data?.error?.message || 'Failed to submit leave request')
  } finally {
    submitting.value = false
  }
}
</script>

