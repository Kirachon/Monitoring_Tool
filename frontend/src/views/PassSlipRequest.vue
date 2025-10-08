<template>
  <FormViewLayout
    title="Request Pass Slip"
    subtitle="Submit a new pass slip request"
    :breadcrumbs="[{ title: 'Dashboard', to: '/dashboard' }, { title: 'Pass Slips', to: '/pass-slips' }, { title: 'Request' }]"
  >
    <!-- Employee Info (Read-only) -->
    <v-alert type="info" class="mb-4">
      <div><strong>Name:</strong> {{ user.fullName }}</div>
      <div><strong>Employee ID:</strong> {{ user.employeeId }}</div>
      <div><strong>Position:</strong> {{ user.position }}</div>
      <div><strong>Department:</strong> {{ user.department }}</div>
    </v-alert>

    <v-form ref="formRef">
      <v-select
        v-model="formData.passSlipType"
        :items="['Planned', 'Emergency']"
        label="Pass Slip Type *"
        :rules="[rules.required]"
        variant="outlined"
      />

      <v-text-field
        v-model="formData.date"
        label="Date *"
        type="date"
        :rules="[rules.required, rules.notPastDate]"
        variant="outlined"
      />

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.timeOut"
            label="Time Out *"
            type="time"
            :rules="[rules.required]"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.expectedTimeIn"
            label="Expected Time In *"
            :rules="[rules.required, rules.timeInAfterOut]"
            type="time"
            variant="outlined"
          />
        </v-col>
      </v-row>

      <v-text-field
        v-model="formData.destination"
        label="Destination *"
        :rules="[rules.required, rules.minLength(10)]"
        variant="outlined"
      />

      <v-textarea
        v-model="formData.reason"
        label="Reason for Leaving *"
        :rules="[rules.required, rules.minLength(10)]"
        variant="outlined"
        rows="3"
      />
    </v-form>

    <template #actions>
      <v-btn variant="text" @click="cancel">Cancel</v-btn>
      <v-spacer />
      <v-btn color="primary" @click="submit" :loading="submitting">
        Submit Request
      </v-btn>
    </template>
  </FormViewLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import passSlipService from '@/services/passSlipService'
import { useNotification } from '@/composables/useNotification'
import FormViewLayout from '@/components/FormViewLayout.vue'

const router = useRouter()
const authStore = useAuthStore()
const { showSuccess, showError } = useNotification()

const formRef = ref(null)
const submitting = ref(false)

const user = ref({
  fullName: authStore.fullName || 'N/A',
  employeeId: 'N/A',
  position: 'N/A',
  department: 'N/A'
})

const formData = ref({
  passSlipType: 'Planned',
  date: new Date().toISOString().split('T')[0],
  timeOut: '',
  expectedTimeIn: '',
  destination: '',
  reason: ''
})

const rules = {
  required: (value) => !!value || 'This field is required',
  minLength: (min) => (value) => (value && value.length >= min) || `Minimum ${min} characters required`,
  notPastDate: (value) => {
    if (!value) return true
    return new Date(value) >= new Date().setHours(0, 0, 0, 0) || 'Cannot select past dates'
  },
  timeInAfterOut: (value) => {
    if (!value || !formData.value.timeOut) return true
    return value > formData.value.timeOut || 'Expected time in must be after time out'
  }
}

// Load form data from localStorage
onMounted(() => {
  const saved = localStorage.getItem('passSlipFormData')
  if (saved) {
    formData.value = JSON.parse(saved)
  }
})

// Save form data to localStorage on changes
const saveToLocalStorage = () => {
  localStorage.setItem('passSlipFormData', JSON.stringify(formData.value))
}

// Watch for changes and save
let saveTimeout
const watchFormData = () => {
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(saveToLocalStorage, 500)
}

onUnmounted(() => {
  clearTimeout(saveTimeout)
})

async function submit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  
  submitting.value = true
  try {
    const response = await passSlipService.createPassSlip(formData.value)
    showSuccess(`Pass slip ${response.data.referenceNo} created successfully`)
    localStorage.removeItem('passSlipFormData')
    
    setTimeout(() => {
      router.push('/pass-slips')
    }, 2000)
  } catch (error) {
    showError('Failed to create pass slip')
  } finally {
    submitting.value = false
  }
}

function cancel() {
  if (confirm('Discard changes?')) {
    localStorage.removeItem('passSlipFormData')
    router.push('/dashboard')
  }
}
</script>

