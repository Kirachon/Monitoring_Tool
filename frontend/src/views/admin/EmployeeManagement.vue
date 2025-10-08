<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h5">Employee Management</span>
            <div>
              <v-btn color="secondary" prepend-icon="mdi-upload" class="mr-2" @click="importDialog = true">
                Import Employees
              </v-btn>
              <v-btn color="primary" prepend-icon="mdi-plus" @click="openAddDialog">
                Add Employee
              </v-btn>
            </div>
          </v-card-title>

          <v-card-text>
            <!-- Search and Filters -->
            <v-row class="mb-4">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  label="Search employees..."
                  placeholder="Search"
                  variant="outlined"
                  density="compact"
                  clearable
                  @input="debouncedSearch"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.department"
                  :items="flatDepartments"
                  item-title="name"
                  item-value="id"
                  label="Department"
                  variant="outlined"
                  density="compact"
                  clearable
                  @update:model-value="loadEmployees"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.employmentStatus"
                  :items="employmentStatuses"
                  label="Employment Status"
                  variant="outlined"
                  density="compact"
                  clearable
                  @update:model-value="loadEmployees"
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-btn color="secondary" variant="outlined" @click="showAdvancedFilters = !showAdvancedFilters">
                  {{ showAdvancedFilters ? 'Hide' : 'Show' }} Filters
                </v-btn>
              </v-col>
            </v-row>

            <!-- Advanced Filters -->
            <v-expand-transition>
              <v-row v-if="showAdvancedFilters" class="mb-4">
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filters.salaryGradeMin"
                    label="Salary Grade Min"
                    type="number"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filters.salaryGradeMax"
                    label="Salary Grade Max"
                    type="number"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filters.dateHiredFrom"
                    label="Date Hired From"
                    type="date"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filters.dateHiredTo"
                    label="Date Hired To"
                    type="date"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="12">
                  <v-btn color="primary" @click="loadEmployees">Apply Filters</v-btn>
                  <v-btn variant="text" class="ml-2" @click="clearFilters">Clear Filters</v-btn>
                  <v-btn color="success" variant="outlined" class="ml-2" @click="exportCSV">
                    <v-icon left>mdi-download</v-icon> Export CSV
                  </v-btn>
                </v-col>
              </v-row>
            </v-expand-transition>

            <!-- Results Count -->
            <v-alert v-if="employees.length > 0" type="info" density="compact" class="mb-4">
              Showing {{ employees.length }} of {{ pagination.total }} employees
            </v-alert>

            <!-- Employees Table -->
            <v-data-table
              :headers="headers"
              :items="employees"
              :loading="loading"
              :items-per-page="25"
              :items-length="pagination.total"
              @update:page="onPageChange"
            >
              <template #item.employmentStatus="{ item }">
                <v-chip size="small" :color="getStatusColor(item.employmentStatus)">
                  {{ item.employmentStatus }}
                </v-chip>
              </template>

              <template #item.actions="{ item }">
                <v-btn
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  @click="viewEmployee(item)"
                />
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="openEditDialog(item)"
                />
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit Employee Dialog -->
    <v-dialog v-model="dialog" max-width="900" persistent scrollable>
      <v-card>
        <v-card-title>
          {{ editMode ? 'Edit Employee' : 'Add Employee' }}
        </v-card-title>

        <v-card-text>
          <v-tabs v-model="tab" class="mb-4">
            <v-tab value="personal">Personal Information</v-tab>
            <v-tab value="employment">Employment Details</v-tab>
            <v-tab value="contact">Contact Information</v-tab>
          </v-tabs>

          <v-form ref="formRef">
            <v-window v-model="tab">
              <!-- Personal Information Tab -->
              <v-window-item value="personal">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.employeeId"
                      label="Employee ID"
                      variant="outlined"
                      :disabled="editMode"
                      hint="Leave empty for auto-generation"
                      persistent-hint
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.firstName"
                      label="First Name *"
                      :rules="[rules.required]"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.middleName"
                      label="Middle Name"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="formData.lastName"
                      label="Last Name *"
                      :rules="[rules.required]"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="1">
                    <v-text-field
                      v-model="formData.suffix"
                      label="Suffix"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.dateOfBirth"
                      label="Date of Birth *"
                      type="date"
                      :rules="[rules.required]"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="formData.gender"
                      :items="['Male', 'Female']"
                      label="Gender *"
                      :rules="[rules.required]"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="formData.civilStatus"
                      :items="['Single', 'Married', 'Widowed', 'Separated', 'Divorced']"
                      label="Civil Status *"
                      :rules="[rules.required]"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </v-window-item>

              <!-- Employment Details Tab -->
              <v-window-item value="employment">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.position"
                      label="Position/Title *"
                      :rules="[rules.required]"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="formData.salaryGrade"
                      :items="salaryGrades"
                      label="Salary Grade *"
                      :rules="[rules.required]"
                      variant="outlined"
                      data-testid="salary-grade-select"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="formData.departmentId"
                      :items="flatDepartments"
                      item-title="name"
                      item-value="id"
                      label="Department *"
                      :rules="[flatDepartments.length ? rules.required : (() => true)]"
                      variant="outlined"
                      data-testid="department-select"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="formData.employmentStatus"
                      :items="employmentStatuses"
                      label="Employment Status *"
                      :rules="[rules.required]"
                      variant="outlined"
                      data-testid="employment-status-select"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.dateHired"
                      label="Date Hired *"
                      type="date"
                      :rules="[rules.required]"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.dateRegularized"
                      label="Date Regularized"
                      type="date"
                      variant="outlined"
                      hint="Optional"
                      persistent-hint
                    />
                  </v-col>
                </v-row>
              </v-window-item>

              <!-- Contact Information Tab -->
              <v-window-item value="contact">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.email"
                      label="Email"
                      type="email"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.mobileNumber"
                      label="Mobile Number"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.street"
                      label="Street"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.barangay"
                      label="Barangay"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.city"
                      label="City"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.province"
                      label="Province"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.postalCode"
                      label="Postal Code"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" @click="saveEmployee" :loading="saving">
            {{ editMode ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Employee Dialog -->
    <v-dialog v-model="viewDialog" max-width="800" scrollable>
      <v-card v-if="viewedEmployee">
        <v-card-title>Employee Profile</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <h3 class="text-h6 mb-2">Personal Information</h3>
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title>Employee ID</v-list-item-title>
                  <v-list-item-subtitle>{{ viewedEmployee.employeeId }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Full Name</v-list-item-title>
                  <v-list-item-subtitle>{{ viewedEmployee.fullName }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Date of Birth</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDate(viewedEmployee.dateOfBirth) }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Gender</v-list-item-title>
                  <v-list-item-subtitle>{{ viewedEmployee.gender }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Civil Status</v-list-item-title>
                  <v-list-item-subtitle>{{ viewedEmployee.civilStatus }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="viewDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Import Dialog -->
    <EmployeeImportDialog
      v-model="importDialog"
      :departments="flatDepartments"
      @imported="loadEmployees"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import employeeService from '@/services/employeeService'
import departmentService from '@/services/departmentService'
import EmployeeImportDialog from '@/components/EmployeeImportDialog.vue'
import { useNotification } from '@/composables/useNotification'

const { showSuccess, showError } = useNotification()

const loading = ref(false)
const employees = ref([])
const departments = ref([])
const dialog = ref(false)
const viewDialog = ref(false)
const importDialog = ref(false)
const editMode = ref(false)
const saving = ref(false)
const formRef = ref(null)
const tab = ref('personal')
const viewedEmployee = ref(null)

const search = ref('')
const showAdvancedFilters = ref(false)
const filters = ref({
  department: null,
  employmentStatus: null,
  salaryGrade: null,
  salaryGradeMin: null,
  salaryGradeMax: null,
  dateHiredFrom: null,
  dateHiredTo: null
})

let searchTimeout = null

const pagination = ref({
  page: 1,
  perPage: 25,
  total: 0,
  totalPages: 0
})

const employmentStatuses = ['Regular', 'Casual', 'Contractual', 'Co-terminus']
const salaryGrades = Array.from({ length: 33 }, (_, i) => (i + 1).toString())

const headers = [
  { title: 'Employee ID', key: 'employeeId' },
  { title: 'Full Name', key: 'fullName' },
  { title: 'Position', key: 'position' },
  { title: 'Department', key: 'departmentName' },
  { title: 'Employment Status', key: 'employmentStatus' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const formData = ref({
  id: null,
  employeeId: '',
  firstName: '',
  middleName: '',
  lastName: '',
  suffix: '',
  dateOfBirth: '',
  gender: '',
  civilStatus: '',
  position: '',
  salaryGrade: '',
  departmentId: null,
  employmentStatus: '',
  dateHired: '',
  dateRegularized: '',
  email: '',
  mobileNumber: '',
  street: '',
  barangay: '',
  city: '',
  province: '',
  postalCode: ''
})

const rules = {
  required: (value) => !!value || 'This field is required'
}

// Flatten department tree for dropdown
const flatDepartments = computed(() => {
  const flatten = (depts, level = 0) => {
    let result = []
    for (const dept of depts) {
      result.push({
        id: dept.id,
        name: '  '.repeat(level) + dept.name
      })
      if (dept.children && dept.children.length > 0) {
        result = result.concat(flatten(dept.children, level + 1))
      }
    }
    return result
  }
  return flatten(departments.value)
})

onMounted(async () => {
  await loadEmployees()
  await loadDepartments()
})

function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadEmployees()
  }, 300)
}

async function loadEmployees() {
  loading.value = true
  try {
    const data = await employeeService.getEmployees({
      page: pagination.value.page,
      perPage: pagination.value.perPage,
      search: search.value,
      department: filters.value.department,
      employmentStatus: filters.value.employmentStatus,
      salaryGrade: filters.value.salaryGrade,
      salaryGradeMin: filters.value.salaryGradeMin,
      salaryGradeMax: filters.value.salaryGradeMax,
      dateHiredFrom: filters.value.dateHiredFrom,
      dateHiredTo: filters.value.dateHiredTo
    })
    employees.value = data?.data?.employees || []
    pagination.value = data?.data?.pagination || pagination.value
  } catch (error) {
    showError('Failed to load employees')
  } finally {
    loading.value = false
  }
}

function clearFilters() {
  search.value = ''
  filters.value = {
    department: null,
    employmentStatus: null,
    salaryGrade: null,
    salaryGradeMin: null,
    salaryGradeMax: null,
    dateHiredFrom: null,
    dateHiredTo: null
  }
  loadEmployees()
}

function exportCSV() {
  const headers = ['Employee ID', 'Full Name', 'Position', 'Department', 'Employment Status', 'Date Hired']
  const rows = employees.value.map(emp => [
    emp.employeeId,
    emp.fullName,
    emp.position,
    emp.departmentName,
    emp.employmentStatus,
    emp.dateHired
  ])

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `employees_export_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

async function loadDepartments() {
  try {
    const data = await departmentService.getDepartments()
    departments.value = data
    // Auto-select first department if dialog is open and none selected yet
    if (dialog.value && !formData.value.departmentId && flatDepartments.value && flatDepartments.value.length) {
      formData.value.departmentId = flatDepartments.value[0].id
    }
  } catch (error) {
    console.error('Failed to load departments:', error)
  }
}

async function openAddDialog() {
  editMode.value = false
  tab.value = 'personal'
  formData.value = {
    id: null,
    employeeId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    dateOfBirth: '',
    gender: '',
    civilStatus: '',
    position: '',
    salaryGrade: '',
    departmentId: null,
    employmentStatus: '',
    dateHired: '',
    dateRegularized: '',
    email: '',
    mobileNumber: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    postalCode: ''
  }
  // Ensure departments are loaded before setting defaults
  if (!flatDepartments.value || flatDepartments.value.length === 0) {
    await loadDepartments()
  }
  // Pre-fill sensible defaults to improve UX and testability
  if (employmentStatuses.length) formData.value.employmentStatus = employmentStatuses[0]
  if (flatDepartments.value && flatDepartments.value.length) formData.value.departmentId = flatDepartments.value[0].id
  if (!formData.value.salaryGrade) formData.value.salaryGrade = salaryGrades[0]
  dialog.value = true
}

async function openEditDialog(employee) {
  editMode.value = true
  tab.value = 'personal'
  try {
    const emp = await employeeService.getEmployeeById(employee.id)
    formData.value = {
      id: emp.id,
      employeeId: emp.employeeId,
      firstName: emp.firstName,
      middleName: emp.middleName || '',
      lastName: emp.lastName,
      suffix: emp.suffix || '',
      dateOfBirth: emp.dateOfBirth,
      gender: emp.gender,
      civilStatus: emp.civilStatus,
      position: emp.position,
      salaryGrade: emp.salaryGrade,
      departmentId: emp.departmentId,
      employmentStatus: emp.employmentStatus,
      dateHired: emp.dateHired,
      dateRegularized: emp.dateRegularized || '',
      email: emp.email || '',
      mobileNumber: emp.mobileNumber || '',
      street: emp.street || '',
      barangay: emp.barangay || '',
      city: emp.city || '',
      province: emp.province || '',
      postalCode: emp.postalCode || ''
    }
    dialog.value = true
  } catch (error) {
    showError('Failed to load employee details')
  }
}

async function viewEmployee(employee) {
  try {
    const emp = await employeeService.getEmployeeById(employee.id)
    viewedEmployee.value = emp
    viewedEmployee.value.fullName = `${response.data.firstName} ${response.data.middleName ? response.data.middleName + ' ' : ''}${response.data.lastName}${response.data.suffix ? ' ' + response.data.suffix : ''}`
    viewDialog.value = true
  } catch (error) {
    showError('Failed to load employee details')
  }
}

function closeDialog() {
  dialog.value = false
}

async function saveEmployee() {
  // Fallback defaults to ensure required fields are set
  if (!formData.value.salaryGrade) formData.value.salaryGrade = salaryGrades[0]
  if (!formData.value.employmentStatus && employmentStatuses.length) formData.value.employmentStatus = employmentStatuses[0]
  if (!formData.value.departmentId && flatDepartments.value && flatDepartments.value.length) {
    formData.value.departmentId = flatDepartments.value[0].id
  }
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (editMode.value) {
      await employeeService.updateEmployee(formData.value.id, formData.value)
      showSuccess('Employee updated successfully')
    } else {
      await employeeService.createEmployee(formData.value)
      showSuccess('Employee created successfully')
    }
    closeDialog()
    await loadEmployees()
  } catch (error) {
    showError(error.response?.data?.error?.message || 'Failed to save employee')
  } finally {
    saving.value = false
  }
}

function getStatusColor(status) {
  const colors = {
    'Regular': 'success',
    'Casual': 'info',
    'Contractual': 'warning',
    'Co-terminus': 'secondary'
  }
  return colors[status] || 'default'
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function onPageChange(page) {
  pagination.value.page = page
  loadEmployees()
}
</script>

