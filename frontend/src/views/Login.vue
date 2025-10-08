<template>
  <v-app>
    <v-main class="d-flex align-center justify-center bg-secondary-lighten-4">
      <v-card width="450" elevation="8" rounded="lg">
        <v-card-text class="text-center pa-8">
          <!-- Government Seal Placeholder -->
          <div class="mb-4">
            <v-icon 
              icon="mdi-shield-account" 
              size="120" 
              color="primary"
            />
          </div>
          
          <h1 class="text-h5 font-weight-bold text-primary mb-2">
            Philippine Government HRMS
          </h1>
          <p class="text-body-2 text-secondary mb-6">
            Human Resource Management System
          </p>

          <!-- Error Alert -->
          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            class="mb-4 v-alert--error error--text"
            closable
            @click:close="error = ''"
          >
            {{ error }}
          </v-alert>

          <!-- Login Form -->
          <v-form ref="formRef" @submit.prevent="handleLogin">
            <v-text-field
              v-model="username"
              label="Username"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              density="comfortable"
              :rules="[rules.required]"
              :disabled="loading"
              class="mb-4"
              autofocus
            />

            <v-text-field
              v-model="password"
              label="Password"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              density="comfortable"
              :rules="[rules.required]"
              :disabled="loading"
              class="mb-4"
            />

            <v-checkbox
              v-model="rememberMe"
              label="Remember me"
              density="compact"
              :disabled="loading"
              class="mb-4"
            />

            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="loading"
              :disabled="loading || !canSubmit"
            >
              Login
            </v-btn>
          </v-form>

          <p class="text-caption text-secondary mt-6">
            Forgot password? Contact system administrator
          </p>
          
          <v-divider class="my-4" />
          
          <p class="text-caption text-secondary">
            © 2025 Philippine Government. All rights reserved.
          </p>
        </v-card-text>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

// Form ref
const formRef = ref(null)

// Form fields
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// Validation rules
const rules = {
  required: (value) => !!value || 'This field is required'
}

const canSubmit = computed(() => !!username.value && !!password.value)

/**
 * Handle login form submission
 */
async function handleLogin() {
  // Validate form
  const { valid } = await formRef.value.validate()
  
  if (!valid) {
    return
  }
  
  error.value = ''
  loading.value = true
  
  try {
    await authStore.login(username.value, password.value, rememberMe.value)

    // Check if user must change password
    if (authStore.user?.mustChangePassword) {
      router.push('/change-password')
    } else {
      // Redirect to dashboard on successful login
      router.push('/dashboard')
    }
  } catch (err) {
    // Display error message
    if (err.response?.data?.error?.message) {
      error.value = err.response.data.error.message
    } else if (err.response?.status === 401) {
      error.value = 'Invalid username or password'
    } else if (err.response?.status === 500) {
      error.value = 'Server error. Please try again later.'
    } else {
      error.value = 'Login failed. Please check your connection and try again.'
    }
    // Clear password field on failure for security
    password.value = ''
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.v-main {
  min-height: 100vh;
}
</style>

