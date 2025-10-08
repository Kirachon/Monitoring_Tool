<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <span class="text-h5">Pending Pass Slip Approvals</span>
            <v-chip class="ml-4" color="warning">{{ passSlips.length }} Pending</v-chip>
            <v-spacer />
            <v-btn
              class="mr-2"
              color="success"
              variant="tonal"
              :disabled="selected.length === 0"
              @click="approveSelected"
            >
              <v-icon start>mdi-check-all</v-icon>
              Approve Selected
            </v-btn>
            <v-btn icon="mdi-refresh" variant="text" @click="loadPendingApprovals" :loading="loading" />
          </v-card-title>

          <v-card-text>
            <v-data-table
              v-model:selected="selected"
              show-select
              :headers="headers"
              :items="passSlips"
              :loading="loading"
            >
              <template #item.actions="{ item }">
                <v-btn
                  icon="mdi-check"
                  size="small"
                  variant="text"
                  color="success"
                  @click="approve(item)"
                />
                <v-btn
                  icon="mdi-close"
                  size="small"
                  variant="text"
                  color="error"
                  @click="openDenyDialog(item)"
                />
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Deny Dialog -->
    <DialogWrapper v-model="denyDialog" title="Deny Pass Slip" :max-width="500" :persistent="true">
      <v-textarea
        v-model="denialReason"
        label="Denial Reason *"
        :rules="[rules.required, rules.minLength(10)]"
        variant="outlined"
        rows="3"
      />
      <template #actions>
        <v-spacer />
        <v-btn variant="text" @click="closeDenyDialog">Cancel</v-btn>
        <v-btn color="error" @click="deny" :loading="denying">Deny</v-btn>
      </template>
    </DialogWrapper>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import passSlipService from '@/services/passSlipService'
import { useNotification } from '@/composables/useNotification'

const { showSuccess, showError } = useNotification()
import DialogWrapper from '@/components/DialogWrapper.vue'


const loading = ref(false)
const passSlips = ref([])
const selected = ref([])
const denyDialog = ref(false)
const denying = ref(false)
const selectedPassSlip = ref(null)
const denialReason = ref('')

const headers = [
  { title: 'Reference No', key: 'referenceNo' },
  { title: 'Employee', key: 'employeeName' },
  { title: 'Type', key: 'passSlipType' },
  { title: 'Date', key: 'date' },
  { title: 'Time Out', key: 'timeOut' },
  { title: 'Expected Time In', key: 'expectedTimeIn' },
  { title: 'Destination', key: 'destination' },
  { title: 'Reason', key: 'reason' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const rules = {
  required: (value) => !!value || 'This field is required',
  minLength: (min) => (value) => (value && value.length >= min) || `Minimum ${min} characters required`
}

onMounted(async () => {
  await loadPendingApprovals()
})

async function loadPendingApprovals() {
  loading.value = true
  try {
    const response = await passSlipService.getPendingApprovals()
    passSlips.value = response.data
  } catch (error) {
    showError('Failed to load pending approvals')
  } finally {
    loading.value = false
  }
}

async function approveSelected() {
  if (selected.value.length === 0) return
  try {
    for (const ps of selected.value) {
      await passSlipService.approvePassSlip(ps.id)
    }
    showSuccess(`${selected.value.length} pass slip(s) approved`)
    selected.value = []
    await loadPendingApprovals()
  } catch (error) {
    showError('Failed to approve selected pass slips')
  }
}

async function approve(passSlip) {
  if (!confirm(`Approve pass slip ${passSlip.referenceNo}?`)) return

  try {
    await passSlipService.approvePassSlip(passSlip.id)
    showSuccess('Pass slip approved successfully')
    await loadPendingApprovals()
  } catch (error) {
    showError('Failed to approve pass slip')
  }
}

function openDenyDialog(passSlip) {
  selectedPassSlip.value = passSlip
  denialReason.value = ''
  denyDialog.value = true
}

function closeDenyDialog() {
  denyDialog.value = false
  selectedPassSlip.value = null
  denialReason.value = ''
}

async function deny() {
  if (!denialReason.value || denialReason.value.length < 10) {
    showError('Denial reason must be at least 10 characters')
    return
  }

  denying.value = true
  try {
    await passSlipService.denyPassSlip(selectedPassSlip.value.id, denialReason.value)
    showSuccess('Pass slip denied')
    closeDenyDialog()
    await loadPendingApprovals()
  } catch (error) {
    showError('Failed to deny pass slip')
  } finally {
    denying.value = false
  }
}
</script>

