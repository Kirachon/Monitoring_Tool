<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <span class="text-h5">Leave Monetization</span>
          </v-card-title>
          <v-card-text>
            <v-tabs v-model="tab" bg-color="primary" dark>
              <v-tab value="calc">Calculate</v-tab>
              <v-tab value="history">History</v-tab>
            </v-tabs>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item value="calc">
                <v-row class="mt-4" align="end" dense>
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      v-model="form.employeeId"
                      :items="employeeItems"
                      item-title="label"
                      item-value="id"
                      label="Employee"
                      :loading="loadingEmployees"
                      :filter-keys="['label']"
                      clearable
                      @update:search="onEmployeeSearch"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field v-model="form.retirementDate" type="date" label="Retirement Date" />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field v-model.number="form.dailyRate" type="number" step="0.01" min="0" label="Daily Rate (PHP)" />
                  </v-col>
                  <v-col cols="12" class="d-flex gap-2">
                    <v-btn color="primary" :loading="loading" @click="doPreview" prepend-icon="mdi-calculator">Preview</v-btn>
                    <v-btn color="success" :disabled="!preview" :loading="loading" @click="doCreate" prepend-icon="mdi-content-save">Save</v-btn>
                  </v-col>
                </v-row>

                <v-divider class="my-4" />

                <v-row v-if="preview">
                  <v-col cols="12" md="8">
                    <v-card variant="tonal">
                      <v-card-title>Calculation Preview</v-card-title>
                      <v-card-text>
                        <v-table density="compact">
                          <tbody>
                            <tr><th>VL Balance</th><td class="text-right">{{ fmt(preview.vlBalance) }}</td></tr>
                            <tr><th>SL Balance</th><td class="text-right">{{ fmt(preview.slBalance) }}</td></tr>
                            <tr><th>Total Monetizable Days</th><td class="text-right">{{ fmt(preview.totalDays) }}</td></tr>
                            <tr><th>Daily Rate (PHP)</th><td class="text-right">{{ money(preview.dailyRate) }}</td></tr>
                            <tr><th>Total Amount (PHP)</th><td class="text-right"><strong>{{ money(preview.totalAmount) }}</strong></td></tr>
                          </tbody>
                        </v-table>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-tabs-window-item>

              <v-tabs-window-item value="history">
                <v-row class="mt-4">
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      v-model="historyEmployeeId"
                      :items="employeeItems"
                      item-title="label"
                      item-value="id"
                      label="Employee"
                      :loading="loadingEmployees"
                      :filter-keys="['label']"
                      clearable
                      @update:search="onEmployeeSearch"
                    />
                  </v-col>
                  <v-col cols="12" md="6" class="d-flex align-end">
                    <v-btn color="primary" @click="loadHistory" :loading="loading">Load History</v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-data-table :headers="histHeaders" :items="history" :loading="loading" density="compact">
                      <template #item.actions="{ item }">
                        <v-btn size="x-small" variant="text" icon="mdi-download" @click="downloadReport(item)"></v-btn>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useNotification } from '@/composables/useNotification'
import employeeService from '@/services/employeeService'
import leaveMonetizationService from '@/services/leaveMonetizationService'

const { showError, showSuccess } = useNotification()

const tab = ref('calc')
const loading = ref(false)
const loadingEmployees = ref(false)
const employeeItems = ref([])

const form = ref({ employeeId: null, retirementDate: '', dailyRate: null })
const preview = ref(null)

const historyEmployeeId = ref(null)
const history = ref([])
const histHeaders = [
  { title: 'Date', key: 'createdAt' },
  { title: 'Employee ID', key: 'employeeId' },
  { title: 'Retirement Date', key: 'retirementDate' },
  { title: 'Days', key: 'totalDays' },
  { title: 'Daily Rate', key: 'dailyRate' },
  { title: 'Total Amount', key: 'totalAmount' },
  { title: 'Actions', key: 'actions', sortable: false }
]

async function onEmployeeSearch(q) {
  loadingEmployees.value = true
  try {
    const res = await employeeService.getEmployees({ q, limit: 10 })
    employeeItems.value = (res?.data?.employees || []).map(e => ({ id: e.id, label: `${e.employeeNo || ''} - ${e.lastName}, ${e.firstName}` }))
  } catch (e) {
    // ignore
  } finally {
    loadingEmployees.value = false
  }
}

function fmt(n) { return Number(n || 0).toFixed(2) }
function money(n) { return Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

async function doPreview() {
  if (!form.value.employeeId || !form.value.retirementDate || !form.value.dailyRate) {
    showError('Please fill employee, retirement date and daily rate')
    return
  }
  loading.value = true
  try {
    const res = await leaveMonetizationService.preview(form.value)
    preview.value = res.data
    showSuccess('Preview ready')
  } catch (e) {
    showError(e.response?.data?.error?.message || 'Failed to preview calculation')
  } finally {
    loading.value = false
  }
}

async function doCreate() {
  if (!preview.value) return
  loading.value = true
  try {
    const res = await leaveMonetizationService.create(form.value)
    showSuccess('Monetization record saved')
    // refresh history if same employee selected
    if (historyEmployeeId.value === form.value.employeeId) await loadHistory()
  } catch (e) {
    showError(e.response?.data?.error?.message || 'Failed to save record')
  } finally {
    loading.value = false
  }
}

async function loadHistory() {
  if (!historyEmployeeId.value) { showError('Select an employee'); return }
  loading.value = true
  try {
    const res = await leaveMonetizationService.history(historyEmployeeId.value)
    history.value = (res.data || []).map(r => ({
      ...r,
      dailyRate: money(r.dailyRate),
      totalAmount: money(r.totalAmount)
    }))
  } catch (e) {
    showError('Failed to load history')
  } finally {
    loading.value = false
  }
}

async function downloadReport(item) {
  try {
    const blob = await leaveMonetizationService.downloadReport(item.id)
    const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `leave_monetization_${item.id}.pdf`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (e) {
    showError('Failed to download report')
  }
}
</script>

