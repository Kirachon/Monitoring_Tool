<template>
  <v-container fluid>
    <v-card>
      <v-card-title>Pass Slip Reports</v-card-title>
      <v-card-text>
            <v-row>
          <v-col cols="12" md="3"><v-text-field v-model="filters.dateFrom" label="From" type="date" /></v-col>
          <v-col cols="12" md="3"><v-text-field v-model="filters.dateTo" label="To" type="date" /></v-col>
          <v-col cols="12" md="3"><v-select v-model="filters.status" :items="statuses" label="Status" clearable /></v-col>
          <v-col cols="12" md="3"><v-text-field v-model="filters.search" label="Search (employee/ref no)" clearable /></v-col>
          <v-col cols="12" md="12" class="d-flex align-end gap-2">
            <v-btn color="primary" @click="load" aria-label="Run report">Run</v-btn>
            <v-spacer />
            <v-btn variant="tonal" @click="exportExcel" aria-label="Export to Excel">Export Excel</v-btn>
            <v-btn variant="tonal" @click="exportPdf" aria-label="Export to PDF">Export PDF</v-btn>
            <v-btn variant="text" @click="exportCsv" aria-label="Export CSV">CSV</v-btn>
          </v-col>
        </v-row>
        <v-alert v-if="error" type="error" class="mb-2">{{ error }}</v-alert>
        <div class="d-flex gap-4 mb-2">
          <v-chip color="info">Total: {{ summary.total }}</v-chip>
          <v-chip color="warning">Pending: {{ summary.pending }}</v-chip>
          <v-chip color="success">Approved: {{ summary.approved }}</v-chip>
          <v-chip color="error">Denied: {{ summary.denied }}</v-chip>
        </div>
        <v-skeleton-loader v-if="loading" type="table" :loading="loading" aria-label="Loading table" />
        <v-data-table v-else hover :headers="headers" :items="filteredRows" density="compact" :items-per-page="10" @click:row="onRowClick" />
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup>
import { ref, computed } from 'vue'
import reportService from '@/services/reportService'
import { exportToExcel, exportToPDF } from '@/utils/exportUtils'
const filters = ref({ dateFrom: '', dateTo: '', status: '', search: '' })
const statuses = ['Pending','Approved','Denied']
const rows = ref([])
const summary = ref({ total: 0, pending: 0, approved: 0, denied: 0 })
const loading = ref(false)
const error = ref(null)
const headers = [
  { title: 'Ref No', key: 'referenceNo' },
  { title: 'Employee', key: 'employeeName' },
  { title: 'Department', key: 'departmentName' },
  { title: 'Time Out', key: 'timeOut' },
  { title: 'Time In', key: 'timeIn' },
  { title: 'Status', key: 'status' },
  { title: 'Created', key: 'createdAt' }
]

const filteredRows = computed(() => {
  const q = (filters.value.search || '').toLowerCase()
  if (!q) return rows.value
  return rows.value.filter(r =>
    String(r.referenceNo || '').toLowerCase().includes(q) ||
    String(r.employeeName || '').toLowerCase().includes(q)
  )
})
async function load(){
  loading.value = true; error.value = null
  try{ const res = await reportService.passSlips(filters.value); rows.value = res.data.rows; summary.value = res.data.summary }
  catch(e){ error.value = e.response?.data?.error?.message || 'Failed to load' }
  finally{ loading.value = false }
}
async function exportCsv(){
  try{
    const resp = await reportService.passSlipsExport(filters.value)
    const blob = new Blob([resp.data], { type: 'text/csv' }); const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download='pass_slips.csv'; a.click(); URL.revokeObjectURL(url)
  } catch(e){ error.value = 'Export failed' }
}
function exportExcel(){
  exportToExcel({ columns: headers, rows: filteredRows.value, filename: 'pass_slips.xlsx' })
}
function exportPdf(){
  exportToPDF({ columns: headers, rows: filteredRows.value, filename: 'pass_slips.pdf', title: 'Pass Slip Report' })
}
function onRowClick(event, row){
  // Simple drill-down: open reference in new tab if a route exists, else no-op
  const refNo = row?.item?.referenceNo
  if (refNo) {
    // assumes a detail route exists like /pass-slips/:refNo
    window.open(`/pass-slips/${encodeURIComponent(refNo)}`,'_blank')
  }
}
</script>

