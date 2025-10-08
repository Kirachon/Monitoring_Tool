<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-certificate" class="mr-2"></v-icon>
            Request Certificate
          </v-card-title>

          <v-card-text>
            <v-alert v-if="error" type="error" closable @click:close="error = null" class="mb-4">
              {{ error }}
            </v-alert>

            <v-alert v-if="success" type="success" closable @click:close="success = null" class="mb-4">
              {{ success }}
            </v-alert>

            <v-form ref="form" @submit.prevent="submitRequest">
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="formData.certificateType"
                    :items="certificateTypes"
                    label="Certificate Type *"
                    :rules="[v => !!v || 'Certificate type is required']"
                    required
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="formData.purpose"
                    :items="purposes"
                    label="Purpose *"
                    :rules="[v => !!v || 'Purpose is required']"
                    required
                  ></v-select>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="formData.additionalDetails"
                    label="Additional Details (Optional)"
                    rows="3"
                    hint="Provide any additional information that may be relevant to your request"
                  ></v-textarea>
                </v-col>

                <v-col cols="12">
                  <v-alert type="info" variant="tonal" class="mb-4">
                    <div class="text-subtitle-2 mb-2">Important Notes:</div>
                    <ul class="ml-4">
                      <li>Certificate requests are subject to approval by HR Administrator</li>
                      <li>Processing time is typically 3-5 business days</li>
                      <li>You will be notified once your certificate is ready</li>
                      <li>Certificates can be downloaded from the Certificate Log page</li>
                    </ul>
                  </v-alert>
                </v-col>

                <v-col cols="12">
                  <v-btn
                    type="submit"
                    color="primary"
                    :loading="loading"
                    :disabled="loading"
                  >
                    <v-icon start>mdi-send</v-icon>
                    Submit Request
                  </v-btn>
                  <v-btn
                    variant="text"
                    class="ml-2"
                    @click="resetForm"
                    :disabled="loading"
                  >
                    Reset
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- My Certificate Requests -->
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-history" class="mr-2"></v-icon>
            My Certificate Requests
            <v-spacer></v-spacer>
            <v-btn
              icon="mdi-refresh"
              variant="text"
              @click="loadRequests"
              :loading="loadingRequests"
            ></v-btn>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="requests"
              :loading="loadingRequests"
              :items-per-page="10"
              class="elevation-1"
            >
              <template v-slot:item.certificateType="{ item }">
                <v-chip size="small" color="primary" variant="tonal">
                  {{ item.certificateType }}
                </v-chip>
              </template>

              <template v-slot:item.status="{ item }">
                <v-chip size="small" :color="getStatusColor(item.status)" variant="tonal">
                  {{ item.status }}
                </v-chip>
              </template>

              <template v-slot:item.requestedAt="{ item }">
                {{ formatDate(item.requestedAt) }}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  v-if="item.status === 'Completed' && item.certificateId"
                  size="small"
                  color="primary"
                  variant="tonal"
                  @click="downloadCertificate(item.certificateId)"
                >
                  <v-icon start>mdi-download</v-icon>
                  Download
                </v-btn>
                <v-chip v-else-if="item.status === 'Pending'" size="small" color="warning" variant="tonal">
                  Awaiting Approval
                </v-chip>
                <v-chip v-else-if="item.status === 'Denied'" size="small" color="error" variant="tonal">
                  {{ item.denialReason || 'Denied' }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import certificateService from '@/services/certificateService'

const form = ref(null)
const loading = ref(false)
const loadingRequests = ref(false)
const error = ref(null)
const success = ref(null)
const requests = ref([])

const formData = ref({
  certificateType: '',
  purpose: '',
  additionalDetails: ''
})

const certificateTypes = [
  'Certificate of Employment',
  'Certificate of Compensation',
  'Certificate of Service',
  'Certificate of Good Moral Character',
  'Certificate of No Pending Case',
  'Certificate of Clearance'
]

const purposes = [
  'Bank Loan Application',
  'Visa Application',
  'Government Requirements',
  'Personal Records',
  'Employment Application',
  'Other'
]

const headers = [
  { title: 'Certificate Type', key: 'certificateType' },
  { title: 'Purpose', key: 'purpose' },
  { title: 'Status', key: 'status' },
  { title: 'Requested', key: 'requestedAt' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const submitRequest = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true
  error.value = null

  try {
    await certificateService.requestCertificate(formData.value)
    success.value = 'Certificate request submitted successfully'
    resetForm()
    await loadRequests()
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to submit certificate request'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    certificateType: '',
    purpose: '',
    additionalDetails: ''
  }
  form.value?.resetValidation()
}

const loadRequests = async () => {
  loadingRequests.value = true
  error.value = null

  try {
    const response = await certificateService.getMyCertificateRequests()
    requests.value = response.data || []
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to load certificate requests'
  } finally {
    loadingRequests.value = false
  }
}

const downloadCertificate = async (certificateId) => {
  try {
    const response = await certificateService.downloadCertificate(certificateId)
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `certificate-${certificateId}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to download certificate'
  }
}

const getStatusColor = (status) => {
  const colors = {
    'Pending': 'warning',
    'Approved': 'info',
    'Completed': 'success',
    'Denied': 'error'
  }
  return colors[status] || 'grey'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  loadRequests()
})
</script>

