<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-certificate-outline" class="mr-2"></v-icon>
            Generate Certificate
          </v-card-title>

          <v-card-text>
            <v-alert v-if="error" type="error" closable @click:close="error = null" class="mb-4">
              {{ error }}
            </v-alert>

            <v-alert v-if="success" type="success" closable @click:close="success = null" class="mb-4">
              {{ success }}
            </v-alert>

            <v-form ref="form">
              <v-row>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="selectedEmployee"
                    :items="employees"
                    :loading="loadingEmployees"
                    :search-input.sync="employeeSearch"
                    item-title="fullName"
                    item-value="id"
                    label="Select Employee *"
                    prepend-icon="mdi-account"
                    :rules="[v => !!v || 'Employee is required']"
                    return-object
                    clearable
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template v-slot:title>
                          {{ item.raw.fullName }}
                        </template>
                        <template v-slot:subtitle>
                          {{ item.raw.employeeId }} - {{ item.raw.position }}
                        </template>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="selectedTemplate"
                    :items="templates"
                    item-title="name"
                    item-value="id"
                    label="Certificate Type *"
                    prepend-icon="mdi-file-document"
                    :rules="[v => !!v || 'Certificate type is required']"
                    return-object
                  ></v-select>
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
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template v-slot:title>
                          {{ item.raw.fullName }}
                        </template>
                        <template v-slot:subtitle>
                          {{ item.raw.position }}
                        </template>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>

              <v-row class="mt-4">
                <v-col cols="12">
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-eye"
                    @click="previewCertificate"
                    :loading="previewing"
                    :disabled="!selectedEmployee || !selectedTemplate"
                    class="mr-2"
                  >
                    Preview Certificate
                  </v-btn>

                  <v-btn
                    color="success"
                    prepend-icon="mdi-file-pdf-box"
                    @click="generateCertificate"
                    :loading="generating"
                    :disabled="!selectedEmployee || !selectedTemplate"
                  >
                    Generate PDF
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Preview Dialog -->
    <v-dialog v-model="previewDialog" max-width="900" scrollable>
      <v-card>
        <v-card-title>Certificate Preview</v-card-title>
        <v-card-text style="max-height: 600px;">
          <div v-html="previewContent" style="border: 1px solid #ccc; padding: 40px; background: white;"></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="previewDialog = false">Close</v-btn>
          <v-btn
            color="success"
            prepend-icon="mdi-file-pdf-box"
            @click="generateFromPreview"
            :loading="generating"
          >
            Generate PDF
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import certificateService from '../../services/certificateService'
import employeeService from '../../services/employeeService'

const employees = ref([])
const templates = ref([])
const signatories = ref([])
const loadingEmployees = ref(false)
const employeeSearch = ref('')
const error = ref(null)
const success = ref(null)

const selectedEmployee = ref(null)
const selectedTemplate = ref(null)
const selectedSignatory = ref(null)

const previewing = ref(false)
const generating = ref(false)
const previewDialog = ref(false)
const previewContent = ref('')

const form = ref(null)

const loadEmployees = async () => {
  loadingEmployees.value = true
  error.value = null

  try {
    const response = await employeeService.getEmployees()
    const list = response?.data?.employees || []
    employees.value = list.map(emp => ({
      id: emp.id,
      fullName: `${emp.firstName} ${emp.lastName}`,
      employeeId: emp.employeeId,
      position: emp.position
    }))
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to load employees'
  } finally {
    loadingEmployees.value = false
  }
}

const loadTemplates = async () => {
  error.value = null

  try {
    const response = await certificateService.getTemplates()
    templates.value = response.data
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to load templates'
  }
}

const loadSignatories = async () => {
  error.value = null

  try {
    // Load active employees to serve as signatories
    const response = await employeeService.getEmployees()
    const list = response?.data?.employees || []
    signatories.value = list
      .filter(emp => emp.status === 'active')
      .map(emp => ({
        id: emp.id,
        fullName: `${emp.firstName} ${emp.lastName}`,
        position: emp.position
      }))
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to load signatories'
  }
}

// Retry helper for transient failures
const withRetry = async (fn, retries = 2, baseDelay = 200) => {
  let attempt = 0
  while (true) {
    try { return await fn() } catch (e) {
      if (attempt++ >= retries) throw e
      const ms = baseDelay * Math.pow(2, attempt - 1)
      await new Promise(r => setTimeout(r, ms))
    }
  }
}


const previewCertificate = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  previewing.value = true
  error.value = null

  try {
    const response = await certificateService.previewCertificate({
      employeeId: selectedEmployee.value.id,
      templateId: selectedTemplate.value.id,
      signatoryId: selectedSignatory.value?.id || null
    })

    previewContent.value = response.data.content
    previewDialog.value = true
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to preview certificate'
  } finally {
    previewing.value = false
  }
}

const generateCertificate = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  generating.value = true
  error.value = null

  try {
    const response = await certificateService.generateCertificate({
      employeeId: selectedEmployee.value.id,
      templateId: selectedTemplate.value.id,
      signatoryId: selectedSignatory.value?.id || null
    })

    success.value = `Certificate ${response.data.referenceNo} generated successfully`

    // Download the PDF
    await downloadCertificate(response.data.id)

    // Reset form
    selectedEmployee.value = null
    selectedTemplate.value = null
    selectedSignatory.value = null
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to generate certificate'
  } finally {
    generating.value = false
  }
}

const generateFromPreview = async () => {
  previewDialog.value = false
  await generateCertificate()
}

const downloadCertificate = async (certificateId) => {
  try {
    const response = await certificateService.downloadCertificate(certificateId)

    // Create blob and download
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `certificate-${certificateId}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    error.value = 'Failed to download certificate'
  }
}

onMounted(() => {
  loadEmployees()
  loadTemplates()
  loadSignatories()
})
</script>

