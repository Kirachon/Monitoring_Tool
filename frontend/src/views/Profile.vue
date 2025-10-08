<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-account" class="mr-2"></v-icon>
            My Profile
          </v-card-title>

          <v-card-text>
            <v-alert v-if="error" type="error" closable @click:close="error = null" class="mb-4">
              {{ error }}
            </v-alert>

            <v-alert v-if="success" type="success" closable @click:close="success = null" class="mb-4">
              {{ success }}
            </v-alert>

            <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4"></v-progress-linear>

            <v-row v-if="!loading && employee">
              <!-- Personal Information -->
              <v-col cols="12">
                <v-card variant="outlined">
                  <v-card-title class="text-h6">Personal Information</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.employee_id"
                          label="Employee ID"
                          readonly
                          variant="outlined"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="fullName"
                          label="Full Name"
                          readonly
                          variant="outlined"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.date_of_birth"
                          label="Date of Birth"
                          readonly
                          variant="outlined"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.gender"
                          label="Gender"
                          readonly
                          variant="outlined"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.civil_status"
                          label="Civil Status"
                          readonly
                          variant="outlined"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Employment Information -->
              <v-col cols="12">
                <v-card variant="outlined">
                  <v-card-title class="text-h6">Employment Information</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.position"
                          label="Position"
                          readonly
                          variant="outlined"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.salary_grade"
                          label="Salary Grade"
                          readonly
                          variant="outlined"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="departmentName"
                          label="Department"
                          readonly
                          variant="outlined"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.employment_status"
                          label="Employment Status"
                          readonly
                          variant="outlined"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.date_hired"
                          label="Date Hired"
                          readonly
                          variant="outlined"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.date_regularized"
                          label="Date Regularized"
                          readonly
                          variant="outlined"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-chip :color="getStatusColor(employee.status)" variant="tonal">
                          {{ employee.status }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Contact Information -->
              <v-col cols="12">
                <v-card variant="outlined">
                  <v-card-title class="text-h6">Contact Information</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.email"
                          label="Email"
                          readonly
                          variant="outlined"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="employee.mobile_number"
                          label="Mobile Number"
                          readonly
                          variant="outlined"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="fullAddress"
                          label="Address"
                          readonly
                          variant="outlined"
                          density="comfortable"
                          rows="2"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import employeeService from '@/services/employeeService'

const authStore = useAuthStore()
const loading = ref(false)
const error = ref(null)
const success = ref(null)
const employee = ref(null)
const department = ref(null)

const fullName = computed(() => {
  if (!employee.value) return ''
  const parts = [
    employee.value.first_name,
    employee.value.middle_name,
    employee.value.last_name,
    employee.value.suffix
  ].filter(Boolean)
  return parts.join(' ')
})

const departmentName = computed(() => {
  return department.value?.name || 'N/A'
})

const fullAddress = computed(() => {
  if (!employee.value) return ''
  const parts = [
    employee.value.address_street,
    employee.value.address_barangay,
    employee.value.address_city,
    employee.value.address_province,
    employee.value.address_postal_code
  ].filter(Boolean)
  return parts.join(', ') || 'N/A'
})

const getStatusColor = (status) => {
  const colors = {
    'active': 'success',
    'inactive': 'error',
    'on_leave': 'warning',
    'suspended': 'error',
    'retired': 'grey'
  }
  return colors[status] || 'grey'
}

const loadProfile = async () => {
  loading.value = true
  error.value = null

  try {
    // Get all employees and find the current user's employee record
    const response = await employeeService.getEmployees({
      search: authStore.user?.employeeId
    })

    if (!response.data || response.data.length === 0) {
      throw new Error('Employee record not found')
    }

    // Find the employee with matching employee_id
    const emp = response.data.find(e => e.employeeId === authStore.user?.employeeId)
    if (!emp) {
      throw new Error('Employee record not found')
    }

    employee.value = {
      employee_id: emp.employeeId,
      first_name: emp.firstName,
      middle_name: emp.middleName,
      last_name: emp.lastName,
      suffix: emp.suffix,
      date_of_birth: emp.dateOfBirth,
      gender: emp.gender,
      civil_status: emp.civilStatus,
      position: emp.position,
      salary_grade: emp.salaryGrade,
      department_id: emp.departmentId,
      employment_status: emp.employmentStatus,
      date_hired: emp.dateHired,
      date_regularized: emp.dateRegularized,
      email: emp.email,
      mobile_number: emp.mobileNumber,
      address_street: emp.street,
      address_barangay: emp.barangay,
      address_city: emp.city,
      address_province: emp.province,
      address_postal_code: emp.postalCode,
      status: emp.status
    }

    department.value = { name: emp.departmentName }
  } catch (err) {
    error.value = err.response?.data?.error?.message || err.message || 'Failed to load profile'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

