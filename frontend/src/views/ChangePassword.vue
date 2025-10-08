<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="text-h5 bg-primary text-white">
            Change Password
          </v-card-title>

          <v-card-text class="pa-6">
            <!-- Password Expiration Warning -->
            <v-alert
              v-if="passwordStatus && passwordStatus.daysUntilExpiration <= 7 && passwordStatus.daysUntilExpiration > 0"
              type="warning"
              variant="tonal"
              class="mb-4"
            >
              Your password expires in {{ passwordStatus.daysUntilExpiration }} days.
              Please change it now.
            </v-alert>

            <!-- Force Change Alert -->
            <v-alert
              v-if="passwordStatus && passwordStatus.mustChangePassword"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              Your password has expired. You must change it to continue.
            </v-alert>

            <!-- Password Requirements -->
            <v-alert type="info" variant="tonal" class="mb-4">
              <div class="text-subtitle-2 mb-2">Password Requirements:</div>
              <ul class="text-body-2">
                <li>Minimum 8 characters</li>
                <li>At least one uppercase letter</li>
                <li>At least one lowercase letter</li>
                <li>At least one number</li>
                <li>At least one special character (!@#$%^&*)</li>
                <li>Cannot match any of your last 3 passwords</li>
              </ul>
            </v-alert>

            <v-form ref="formRef" @submit.prevent="handleChangePassword">
              <v-text-field
                v-model="currentPassword"
                label="Current Password *"
                :type="showCurrentPassword ? 'text' : 'password'"
                :append-inner-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showCurrentPassword = !showCurrentPassword"
                :rules="[rules.required]"
                variant="outlined"
                class="mb-4"
              />

              <v-text-field
                v-model="newPassword"
                label="New Password *"
                :type="showNewPassword ? 'text' : 'password'"
                :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showNewPassword = !showNewPassword"
                :rules="[rules.required, rules.passwordComplexity]"
                variant="outlined"
                class="mb-4"
                @input="updatePasswordStrength"
              />

              <v-text-field
                v-model="confirmPassword"
                label="Confirm New Password *"
                :type="showConfirmPassword ? 'text' : 'password'"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                :rules="[rules.required, rules.passwordMatch]"
                variant="outlined"
                class="mb-4"
              />

              <!-- Password Strength Indicator -->
              <div class="mb-4">
                <div class="text-caption mb-1">Password Strength:</div>
                <v-progress-linear
                  :model-value="passwordStrength"
                  :color="passwordStrengthColor"
                  height="8"
                  rounded
                />
                <div class="text-caption mt-1">{{ passwordStrengthText }}</div>
              </div>
            </v-form>
          </v-card-text>

          <v-divider />

          <v-card-actions class="pa-4 justify-end">
            <v-btn variant="text" @click="cancel" :disabled="loading">
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              @click="handleChangePassword"
              :loading="loading"
              :disabled="loading || !canSubmit"
            >
              Change Password
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const authStore = useAuthStore()
const { showSuccess, showError } = useNotification()

const formRef = ref(null)
const loading = ref(false)
const passwordStatus = ref(null)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordStrength = ref(0)

const rules = {
  required: (value) => !!value || 'This field is required',
  passwordComplexity: (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/
    return regex.test(value) || 'Password must meet complexity requirements'
  },
  passwordMatch: (value) => value === newPassword.value || 'Passwords do not match'
}

const canSubmit = computed(() => !!currentPassword.value && !!newPassword.value && !!confirmPassword.value)

const passwordStrengthColor = computed(() => {
  if (passwordStrength.value < 40) return 'error'
  if (passwordStrength.value < 70) return 'warning'
  return 'success'
})

const passwordStrengthText = computed(() => {
  if (passwordStrength.value < 40) return 'Weak'
  if (passwordStrength.value < 70) return 'Medium'
  return 'Strong'
})

onMounted(async () => {
  await loadPasswordStatus()
})

async function loadPasswordStatus() {
  try {
    const response = await axios.get('/api/auth/password-status')
    passwordStatus.value = response.data.data
  } catch (error) {
    console.error('Failed to load password status:', error)
  }
}

function updatePasswordStrength() {
  const password = newPassword.value
  let strength = 0
  
  // Length
  if (password.length >= 8) strength += 20
  if (password.length >= 12) strength += 10
  if (password.length >= 16) strength += 10
  
  // Character types
  if (/[a-z]/.test(password)) strength += 15
  if (/[A-Z]/.test(password)) strength += 15
  if (/[0-9]/.test(password)) strength += 15
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 15
  
  passwordStrength.value = Math.min(100, strength)
}

async function handleChangePassword() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  
  loading.value = true
  try {
    await axios.put('/api/auth/change-password', {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value
    })
    
    showSuccess('Password changed successfully. Please log in again.')
    
    // Logout and redirect to login
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || 'Failed to change password'
    showError(errorMessage)
  } finally {
    loading.value = false
  }
}

function cancel() {
  router.back()
}
</script>

