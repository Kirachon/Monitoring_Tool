<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-draw" class="mr-2"></v-icon>
            Digital Signatures
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              prepend-icon="mdi-upload"
              @click="openUploadDialog"
            >
              Upload Signature
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-alert v-if="error" type="error" closable @click:close="error = null" class="mb-4">
              {{ error }}
            </v-alert>

            <v-alert v-if="success" type="success" closable @click:close="success = null" class="mb-4">
              {{ success }}
            </v-alert>

            <v-data-table
              :headers="headers"
              :items="signatures"
              :loading="loading"
              :items-per-page="25"
              class="elevation-1"
            >
              <template v-slot:item.signaturePath="{ item }">
                <v-chip v-if="item.signaturePath" color="success" size="small" variant="tonal">
                  <v-icon start icon="mdi-check"></v-icon>
                  Uploaded
                </v-chip>
                <v-chip v-else color="grey" size="small" variant="tonal">
                  <v-icon start icon="mdi-close"></v-icon>
                  Not Uploaded
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  v-if="item.signaturePath"
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  @click="viewSignature(item)"
                  title="View"
                ></v-btn>
                <v-btn
                  icon="mdi-upload"
                  size="small"
                  variant="text"
                  @click="replaceSignature(item)"
                  :title="item.signaturePath ? 'Replace' : 'Upload'"
                ></v-btn>
                <v-btn
                  v-if="item.signaturePath"
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="deleteSignature(item)"
                  title="Delete"
                ></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Upload Dialog -->
    <v-dialog v-model="uploadDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>{{ editMode ? 'Replace Signature' : 'Upload Signature' }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-autocomplete
              v-model="formData.employeeId"
              :items="employees"
              item-title="fullName"
              item-value="id"
              label="Signatory *"
              :rules="[v => !!v || 'Signatory is required']"
              :disabled="editMode"
              required
            ></v-autocomplete>

            <v-text-field
              v-model="formData.signatureTitle"
              label="Signature Title"
              hint="e.g., HR Manager, Office Director"
              persistent-hint
            ></v-text-field>

            <v-file-input
              v-model="formData.file"
              label="Signature Image *"
              accept="image/*"
              prepend-icon="mdi-image"
              :rules="[v => !!v || 'Signature image is required']"
              required
              hint="PNG format with transparent background recommended. Max 500KB."
              persistent-hint
              @change="previewFile"
            ></v-file-input>

            <v-img
              v-if="filePreview"
              :src="filePreview"
              max-height="100"
              max-width="300"
              class="mt-4"
              style="border: 1px solid #ccc; padding: 10px;"
            ></v-img>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeUploadDialog">Cancel</v-btn>
          <v-btn
            color="primary"
            @click="uploadSignature"
            :loading="uploading"
          >
            {{ editMode ? 'Replace' : 'Upload' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="600">
      <v-card>
        <v-card-title>Signature Preview</v-card-title>
        <v-card-text>
          <div class="text-center">
            <v-img
              v-if="viewSignaturePath"
              :src="`${apiBaseUrl}${viewSignaturePath}`"
              max-height="200"
              max-width="400"
              class="mx-auto"
              style="border: 1px solid #ccc; padding: 20px; background: white;"
            ></v-img>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="viewDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import signatureService from '../../services/signatureService'
import employeeService from '../../services/employeeService'
import axios from 'axios'

const signatures = ref([])
const employees = ref([])
const loading = ref(false)
const error = ref(null)
const success = ref(null)

const uploadDialog = ref(false)
const viewDialog = ref(false)
const editMode = ref(false)
const uploading = ref(false)
const form = ref(null)

const formData = ref({
  employeeId: null,
  signatureTitle: '',
  file: null
})

const filePreview = ref(null)
const viewSignaturePath = ref(null)

const apiBaseUrl = axios.defaults.baseURL || 'http://localhost:3000'

const headers = [
  { title: 'Employee Name', key: 'employeeName', sortable: true },
  { title: 'Employee ID', key: 'employeeNumber', sortable: true },
  { title: 'Position', key: 'position', sortable: true },
  { title: 'Signature Title', key: 'signatureTitle', sortable: false },
  { title: 'Status', key: 'signaturePath', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

const loadSignatures = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await signatureService.getSignatures()
    signatures.value = response?.data?.data || []
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to load signatures'
  } finally {
    loading.value = false
  }
}

const loadEmployees = async () => {
  error.value = null

  try {
    const response = await employeeService.getEmployees()
    const list = response?.data?.employees || []
    employees.value = list
      .filter(emp => emp.status === 'active')
      .map(emp => ({
        id: emp.id,
        fullName: `${emp.firstName} ${emp.lastName}`,
        position: emp.position
      }))
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to load employees'
  }
}

const openUploadDialog = () => {
  editMode.value = false
  formData.value = {
    employeeId: null,
    signatureTitle: '',
    file: null
  }
  filePreview.value = null
  uploadDialog.value = true
}

const replaceSignature = (signature) => {
  editMode.value = true
  formData.value = {
    employeeId: signature.employeeId,
    signatureTitle: signature.signatureTitle || '',
    file: null
  }
  filePreview.value = null
  uploadDialog.value = true
}

const closeUploadDialog = () => {
  uploadDialog.value = false
  formData.value = {
    employeeId: null,
    signatureTitle: '',
    file: null
  }
  filePreview.value = null
}

const previewFile = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      filePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const uploadSignature = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  uploading.value = true
  error.value = null

  try {
    const formDataToSend = new FormData()
    formDataToSend.append('employeeId', formData.value.employeeId)
    formDataToSend.append('signatureTitle', formData.value.signatureTitle || '')
    formDataToSend.append('signature', formData.value.file[0])

    await signatureService.uploadSignature(formDataToSend)
    success.value = editMode.value ? 'Signature replaced successfully' : 'Signature uploaded successfully'
    closeUploadDialog()
    await loadSignatures()
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to upload signature'
  } finally {
    uploading.value = false
  }
}


const viewSignature = (signature) => {
  viewSignaturePath.value = signature.signaturePath
  viewDialog.value = true
}

const deleteSignature = async (signature) => {
  if (!confirm(`Delete signature for ${signature.employeeName}? This action cannot be undone.`)) return

  loading.value = true
  error.value = null

  try {

    await signatureService.deleteSignature(signature.employeeId)
    success.value = 'Signature deleted successfully'
    await loadSignatures()
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to delete signature'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSignatures()
  loadEmployees()
})
</script>

