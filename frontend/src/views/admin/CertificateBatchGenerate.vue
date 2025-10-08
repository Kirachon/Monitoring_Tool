<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-certificate-multiple-outline" class="mr-2" />
            Batch Certificate Generation
          </v-card-title>
          <v-card-text>
            <v-alert v-if="error" type="error" closable @click:close="error=null" class="mb-4">{{ error }}</v-alert>
            <v-alert v-if="success" type="success" closable @click:close="success=null" class="mb-4">{{ success }}</v-alert>

            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="selectedTemplate"
                  :items="templates"
                  item-title="name"
                  item-value="id"
                  label="Certificate Template *"
                  prepend-icon="mdi-file-document"
                  :loading="loadingTemplates"
                  return-object
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="selectedSignatory"
                  :items="signatories"
                  item-title="fullName"
                  item-value="id"
                  label="Signatory (Optional)"
                  prepend-icon="mdi-account-tie"
                  return-object
                  clearable
                />
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="selectedEmployees"
                  :items="employees"
                  :loading="loadingEmployees"
                  item-title="fullName"
                  item-value="id"
                  label="Select Employees *"
                  prepend-icon="mdi-account-multiple"
                  multiple chips closable-chips
                  :search-input.sync="employeeSearch"
                  return-object
                />
              </v-col>
              <v-col cols="12" class="d-flex">
                <v-btn color="primary" :loading="processing" @click="runBatch" prepend-icon="mdi-play">Generate</v-btn>
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <v-data-table :headers="headers" :items="results" :loading="processing" density="compact">
              <template #item.status="{ item }">
                <v-chip size="small" :color="item.success ? 'success' : 'error'">{{ item.success ? 'Success' : 'Failed' }}</v-chip>
              </template>
              <template #item.actions="{ item }">
                <v-btn v-if="item.success" size="x-small" variant="text" icon="mdi-download" @click="download(item)"></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import certificateService from '@/services/certificateService'
import employeeService from '@/services/employeeService'

const loadingTemplates = ref(false)
const loadingEmployees = ref(false)
const processing = ref(false)
const error = ref(null)
const success = ref(null)

const templates = ref([])
const employees = ref([])
const signatories = ref([])

const selectedTemplate = ref(null)
const selectedSignatory = ref(null)
const selectedEmployees = ref([])
const employeeSearch = ref('')

const headers = [
  { title: 'Employee', key: 'employeeName' },
  { title: 'Employee ID', key: 'employeeId' },
  { title: 'Reference No', key: 'referenceNo' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false }
]

onMounted(async () => {
  await loadTemplates()
  await loadEmployees()
  await loadSignatories()
})

async function loadTemplates(){
  loadingTemplates.value = true
  try { const res = await certificateService.getTemplates(); templates.value = res.data } catch(e) { error.value = 'Failed to load templates' } finally { loadingTemplates.value = false }
}

async function loadEmployees(){
  loadingEmployees.value = true
  try {
    const res = await employeeService.getEmployees({ q: employeeSearch.value, limit: 100 })
    employees.value = (res?.data?.employees || []).map(e => ({ id: e.id, fullName: `${e.firstName} ${e.lastName}`, employeeId: e.employeeId }))
    signatories.value = employees.value
  } catch(e){ error.value = 'Failed to load employees' } finally { loadingEmployees.value = false }
}

async function runBatch(){
  if (!selectedTemplate.value || selectedEmployees.value.length===0){ error.value = 'Template and employees are required'; return }
  processing.value = true; error.value = null; success.value = null
  try {
    const payload = { templateId: selectedTemplate.value.id, signatoryId: selectedSignatory.value?.id || null, employeeIds: selectedEmployees.value.map(e=>e.id) }
    const res = await certificateService.batchGenerate(payload)
    results.value = (res.data?.results||[]).map(r => ({
      ...r,
      employeeName: employees.value.find(e => e.id===r.employeeId)?.fullName || r.employeeId,
      employeeId: employees.value.find(e => e.id===r.employeeId)?.employeeId || ''
    }))
    success.value = 'Batch generation completed'
  } catch(e){ error.value = e.response?.data?.error?.message || 'Batch generation failed' } finally { processing.value = false }
}

const results = ref([])

async function download(item){
  try{
    const resp = await certificateService.downloadCertificate(item.id)
    const blob = new Blob([resp.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download = `${item.referenceNo}.pdf`; a.click(); URL.revokeObjectURL(url)
  } catch(e){ error.value = 'Failed to download' }
}
</script>

