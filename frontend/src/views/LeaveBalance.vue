<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <span class="text-h5">Leave Balance</span>
            <v-btn prepend-icon="mdi-file-excel" color="success" @click="exportExcel" :loading="exporting">
              Export to Excel
            </v-btn>
          </v-card-title>

          <v-card-text>
            <!-- Balance Cards -->
            <v-row>
              <v-col v-for="bal in balancesArray" :key="bal.leaveTypeId" cols="12" sm="6" md="4" lg="3">
                <v-card variant="outlined">
                  <v-card-text>
                    <div class="text-subtitle-1 font-weight-medium">{{ bal.name }} ({{ bal.code }})</div>
                    <div class="d-flex align-center mt-2">
                      <div class="text-h4 mr-2">{{ bal.currentBalance }}</div>
                      <div class="text-caption">days</div>
                    </div>
                    <div class="text-caption mt-2">
                      Used YTD: <strong>{{ bal.usedYtd }}</strong> • Accrued YTD: <strong>{{ bal.accruedYtd }}</strong>
                    </div>
                    <div class="text-caption">Max Balance: {{ bal.maxBalance }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Filters -->
            <v-row class="mt-4">
              <v-col cols="12" sm="3">
                <v-select v-model="filters.leaveTypeId" :items="leaveTypes" item-title="name" item-value="id" label="Leave Type" clearable />
              </v-col>
              <v-col cols="12" sm="3">
                <v-select v-model="filters.transactionType" :items="transactionTypes" label="Transaction Type" clearable />
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field v-model="filters.from" type="date" label="From" />
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field v-model="filters.to" type="date" label="To" />
              </v-col>
            </v-row>

            <!-- Transactions -->
            <v-data-table :headers="headers" :items="transactions" :loading="loading" class="mt-2">
              <template #item.amount="{ item }">
                <span :class="item.amount >= 0 ? 'text-success' : 'text-error'">{{ formatAmount(item.amount) }}</span>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/store/auth'
import leaveService from '@/services/leaveService'
import { useNotification } from '@/composables/useNotification'

const { showError } = useNotification()
const auth = useAuthStore()

const loading = ref(false)
const exporting = ref(false)
const balances = ref([])
const leaveTypes = ref([])
const transactions = ref([])

const transactionTypes = ['Monthly Accrual', 'Leave Approved', 'Leave Cancelled', 'Manual Adjustment', 'Opening Balance']

const headers = [
  { title: 'Date', key: 'createdAt' },
  { title: 'Type', key: 'transactionType' },
  { title: 'Leave Type', key: 'leaveTypeName' },
  { title: 'Amount (days)', key: 'amount' },
  { title: 'Balance After', key: 'balanceAfter' },
  { title: 'Remarks', key: 'reason' }
]

const filters = ref({ leaveTypeId: null, transactionType: null, from: null, to: null })

const balancesArray = computed(() => balances.value.map(b => ({
  leaveTypeId: b.leaveTypeId,
  name: b.name,
  code: b.code,
  currentBalance: parseFloat(b.currentBalance),
  usedYtd: parseFloat(b.usedYtd || 0),
  accruedYtd: parseFloat(b.accruedYtd || 0),
  maxBalance: parseFloat(b.maxBalance || 0)
})))

onMounted(async () => {
  await Promise.all([loadBalances(), loadLeaveTypes(), loadTransactions()])
})

watch(filters, async () => {
  await loadTransactions()
}, { deep: true })

async function loadBalances() {
  loading.value = true
  try {
    const res = await leaveService.getBalances(auth.user.employeeId)
    // Expect array of balances with fields: leaveTypeId, name, code, currentBalance, usedYtd, accruedYtd, maxBalance
    balances.value = res.data || []
  } catch (e) {
    showError('Failed to load balances')
  } finally {
    loading.value = false
  }
}

async function loadLeaveTypes() {
  try {
    const res = await leaveService.getLeaveTypes()
    leaveTypes.value = res.data
  } catch {}
}

async function loadTransactions() {
  loading.value = true
  try {
    const res = await leaveService.getCreditHistory(auth.user.employeeId, filters.value)
    transactions.value = (res.data || []).map(x => ({
      createdAt: x.createdAt || x.created_at || '',
      transactionType: x.transactionType,
      leaveTypeName: x.leaveTypeName,
      amount: x.amount,
      balanceAfter: x.balanceAfter,
      reason: x.reason
    }))
  } catch (e) {
    showError('Failed to load transaction history')
  } finally {
    loading.value = false
  }
}

function formatAmount(a) {
  const n = Number(a)
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}`
}

function exportExcel() {
  try {
    exporting.value = true
    const balancesCsv = toCsv(['Leave Type','Code','Current Balance','Used YTD','Accrued YTD','Max Balance'], balancesArray.value.map(b => [b.name,b.code,b.currentBalance,b.usedYtd,b.accruedYtd,b.maxBalance]))
    const txCsv = toCsv(['Date','Transaction Type','Leave Type','Amount (days)','Balance After','Remarks'], transactions.value.map(t => [t.createdAt,t.transactionType,t.leaveTypeName,t.amount,t.balanceAfter,t.reason]))

    downloadBlob(balancesCsv, 'leave-balances.csv', 'text/csv')
    downloadBlob(txCsv, 'leave-transactions.csv', 'text/csv')
  } finally {
    exporting.value = false
  }
}

function toCsv(headers, rows) {
  const escape = (v) => `"${String(v ?? '').replace(/"/g,'""')}"`
  const lines = [headers.map(escape).join(','), ...rows.map(r => r.map(escape).join(','))]
  return new Blob(["\ufeff", lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
}

function downloadBlob(blob, filename, type) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}
</script>

