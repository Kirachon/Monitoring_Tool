<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-history" class="mr-2"></v-icon>
            Certificate Issuance Log
          </v-card-title>

          <v-card-text>
            <v-alert v-if="error" type="error" closable @click:close="error = null" class="mb-4">
              {{ error }}
            </v-alert>

            <v-alert v-if="success" type="success" closable @click:close="success = null" class="mb-4">
              {{ success }}
            </v-alert>

            <!-- Filters -->
            <v-row class="mb-4">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="filters.search"
                  label="Search"
                  prepend-icon="mdi-magnify"
                  hint="Employee name, reference number, or certificate type"
                  persistent-hint
                  clearable
                  @input="loadCertificates"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.status"
                  :items="['Issued', 'Revoked', 'Reissued']"
                  label="Status"
                  prepend-icon="mdi-filter"
                  clearable
                  @update:modelValue="loadCertificates"
                ></v-select>
              </v-col>

              <v-col cols="12" md="2">
                <v-text-field
                  v-model="filters.dateFrom"
                  label="Date From"
                  type="date"
                  clearable
                  @input="loadCertificates"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="2">
                <v-text-field
                  v-model="filters.dateTo"
                  label="Date To"
                  type="date"
                  clearable
                  @input="loadCertificates"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-data-table
              :headers="headers"
              :items="certificates"
              :loading="loading"
              :items-per-page="25"
              class="elevation-1"
            >
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status)"
                  size="small"
                  variant="tonal"
                >
                  {{ item.status }}
                </v-chip>
              </template>

              <template v-slot:item.issuedDate="{ item }">
                {{ formatDate(item.issuedDate) }}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  @click="viewCertificate(item)"
                  title="View"
                ></v-btn>
                <v-btn
                  icon="mdi-download"
                  size="small"
                  variant="text"
                  @click="downloadCertificate(item)"
                  title="Download"
                ></v-btn>
                <v-btn
                  v-if="item.status === 'Issued'"
                  icon="mdi-cancel"
                  size="small"
                  variant="text"
                  color="error"
                  @click="revokeCertificate(item)"
                  title="Revoke"
                ></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Revoke Dialog -->
    <v-dialog v-model="revokeDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>Revoke Certificate</v-card-title>
        <v-card-text>
          <p class="mb-4">
            Are you sure you want to revoke certificate <strong>{{ selectedCertificate?.referenceNo }}</strong>?
          </p>
          <v-form ref="revokeForm">
            <v-textarea
              v-model="revocationReason"
              label="Revocation Reason *"
              rows="3"
              :rules="[v => !!v || 'Reason is required', v => v.length >= 10 || 'Reason must be at least 10 characters']"
              required
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeRevokeDialog">Cancel</v-btn>
          <v-btn
            color="error"
            @click="confirmRevoke"
            :loading="revoking"
          >
            Revoke
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import certificateService from '../../services/certificateService'
import axios from 'axios'

const certificates = ref([])
const loading = ref(false)
const error = ref(null)
const success = ref(null)

const filters = ref({
  search: '',
  status: null,
  dateFrom: null,
  dateTo: null
})

const revokeDialog = ref(false)
const selectedCertificate = ref(null)
const revocationReason = ref('')
const revoking = ref(false)
const revokeForm = ref(null)

const apiBaseUrl = axios.defaults.baseURL || 'http://localhost:3000'

const headers = [
  { title: 'Reference No', key: 'referenceNo', sortable: true },
  { title: 'Employee', key: 'employeeName', sortable: true },
  { title: 'Certificate Type', key: 'templateName', sortable: true },
  { title: 'Issued Date', key: 'issuedDate', sortable: true },
  { title: 'Issued By', key: 'issuedBy', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

const loadCertificates = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await certificateService.getCertificates(filters.value)
    certificates.value = response.data
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to load certificates'
  } finally {
    loading.value = false
  }
}

const viewCertificate = (certificate) => {
  const url = `${apiBaseUrl}${certificate.filePath}`
  window.open(url, '_blank')
}

const downloadCertificate = async (certificate) => {
  try {
    const response = await certificateService.downloadCertificate(certificate.id)
    
    // Create blob and download
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${certificate.referenceNo}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    error.value = 'Failed to download certificate'
  }
}

const revokeCertificate = (certificate) => {
  selectedCertificate.value = certificate
  revocationReason.value = ''
  revokeDialog.value = true
}

const closeRevokeDialog = () => {
  revokeDialog.value = false
  selectedCertificate.value = null
  revocationReason.value = ''
}

const confirmRevoke = async () => {
  const { valid } = await revokeForm.value.validate()
  if (!valid) return

  revoking.value = true
  error.value = null
  
  try {
    await certificateService.revokeCertificate(selectedCertificate.value.id, revocationReason.value)
    success.value = `Certificate ${selectedCertificate.value.referenceNo} revoked successfully`
    closeRevokeDialog()
    await loadCertificates()
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to revoke certificate'
  } finally {
    revoking.value = false
  }
}

const getStatusColor = (status) => {
  const colors = {
    'Issued': 'success',
    'Revoked': 'error',
    'Reissued': 'warning'
  }
  return colors[status] || 'grey'
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(() => {
  loadCertificates()
})
</script>

