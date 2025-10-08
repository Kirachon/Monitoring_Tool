<template>
  <v-container fluid>
    <v-card>
      <v-card-title>Employee Reports</v-card-title>
      <v-card-text>
            <v-row>
          <v-col cols="12" md="3"><v-text-field v-model="filters.dateFrom" label="From" type="date" /></v-col>
          <v-col cols="12" md="3"><v-text-field v-model="filters.dateTo" label="To" type="date" /></v-col>
          <v-col cols="12" md="3"><v-select v-model="filters.department" :items="departments" label="Department" clearable /></v-col>
          <v-col cols="12" md="3"><v-select v-model="filters.status" :items="empStatuses" label="Employment Status" clearable /></v-col>
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
        </div>
        <v-skeleton-loader v-if="loading" type="table" :loading="loading" aria-label="Loading table" />
        <v-data-table v-else hover :headers="headers" :items="filteredRows" density="compact" />
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup>
import { ref, computed } from 'vue'
import reportService from '@/services/reportService'
import { exportToExcel, exportToPDF } from '@/utils/exportUtils'
const filters = ref({ dateFrom: '', dateTo: '', department: '', status: '' })
const departments = ['HR','Finance','IT','Admin']
const empStatuses = ['Active','Separated','Probationary']
const rows = ref([])
const summary = ref({ total: 0 })
const loading = ref(false)
const error = ref(null)
const headers = [
  { title: 'Employee', key: 'employeeName' },
  { title: 'Department', key: 'departmentName' },
  { title: 'Position', key: 'position' },
  { title: 'Status', key: 'status' },
  { title: 'Date Hired', key: 'dateHired' },
  { title: 'Date Separated', key: 'dateSeparated' }
]
const filteredRows = computed(() => rows.value)
async function load(){
  loading.value = true; error.value = null
  try{ const res = await reportService.employees(filters.value); rows.value = res.data.rows; summary.value = res.data.summary }
  catch(e){ error.value = e.response?.data?.error?.message || 'Failed to load' }
  finally{ loading.value = false }
}
async function exportCsv(){
  try{
    const resp = await reportService.employeesExport(filters.value)
    const blob = new Blob([resp.data], { type: 'text/csv' }); const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download='employees.csv'; a.click(); URL.revokeObjectURL(url)
  } catch(e){ error.value = 'Export failed' }
}
function exportExcel(){
  exportToExcel({ columns: headers, rows: filteredRows.value, filename: 'employees.xlsx' })
}
function exportPdf(){
  exportToPDF({ columns: headers, rows: filteredRows.value, filename: 'employees.pdf', title: 'Employee Report' })
}
</script>

