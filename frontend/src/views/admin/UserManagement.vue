<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h5">User Management</span>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openAddDialog">
              Add User
            </v-btn>
          </v-card-title>

          <v-card-text>
            <!-- Search Bar -->
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search users..."
              placeholder="Search"
              variant="outlined"
              density="compact"
              clearable
              class="mb-4"
              @input="loadUsers"
            />

            <!-- Users Table -->
            <v-data-table
              :headers="headers"
              :items="users"
              :loading="loading"
              :items-per-page="25"
              :items-length="pagination.total"
              @update:page="onPageChange"
            >
              <template #item.roles="{ item }">
                <v-chip
                  v-for="role in item.roles"
                  :key="role"
                  size="small"
                  class="mr-1"
                >
                  {{ role }}
                </v-chip>
              </template>

              <template #item.status="{ item }">
                <v-chip
                  :color="item.status === 'active' ? 'success' : 'error'"
                  size="small"
                >
                  {{ item.status }}
                </v-chip>
              </template>

              <template #item.lastLogin="{ item }">
                {{ formatDate(item.lastLogin) }}
              </template>

              <template #item.actions="{ item }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="openEditDialog(item)"
                />
                <v-btn
                  icon="mdi-key"
                  size="small"
                  variant="text"
                  @click="resetPassword(item)"
                />
                <v-btn
                  :icon="item.status === 'active' ? 'mdi-account-off' : 'mdi-account-check'"
                  size="small"
                  variant="text"
                  @click="toggleStatus(item)"
                />
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit User Dialog -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card>
        <v-card-title>
          {{ editMode ? 'Edit User' : 'Add User' }}
        </v-card-title>

        <v-card-text>
          <v-form ref="formRef">
            <v-text-field
              v-model="formData.username"
              label="Username *"
              :rules="[rules.required]"
              :disabled="editMode"
              variant="outlined"
              class="mb-4"
            />

            <v-select
              v-model="formData.employeeId"
              :items="employees"
              item-title="fullName"
              item-value="id"
              label="Employee *"
              :rules="[rules.required]"
              variant="outlined"
              :disabled="editMode"
              class="mb-4"
            />

            <v-text-field
              v-if="!editMode"
              v-model="formData.password"
              label="Initial Password *"
              type="password"
              :rules="[rules.required, rules.password]"
              variant="outlined"
              class="mb-4"
            />

            <v-text-field
              v-if="!editMode"
              v-model="formData.confirmPassword"
              label="Confirm Password *"
              type="password"
              :rules="[rules.required, rules.passwordMatch]"
              variant="outlined"
              class="mb-4"
            />

            <v-select
              v-model="formData.roles"
              :items="availableRoles"
              item-title="name"
              item-value="id"
              label="Roles *"
              :rules="[rules.required]"
              variant="outlined"
              multiple
              chips
              class="mb-4"
            />

            <v-select
              v-if="editMode"
              v-model="formData.status"
              :items="['active', 'inactive']"
              label="Status *"
              :rules="[rules.required]"
              variant="outlined"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" @click="saveUser" :loading="saving">
            {{ editMode ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Password Reset Dialog -->
    <v-dialog v-model="passwordDialog" max-width="400">
      <v-card>
        <v-card-title>Temporary Password</v-card-title>
        <v-card-text>
          <v-alert type="info" class="mb-4">
            User must change this password on first login
          </v-alert>
          <v-text-field
            :model-value="temporaryPassword"
            label="Temporary Password"
            readonly
            variant="outlined"
          >
            <template #append-inner>
              <v-btn
                icon="mdi-content-copy"
                size="small"
                variant="text"
                @click="copyPassword"
              />
            </template>
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="passwordDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import userService from '@/services/userService'
import employeeService from '@/services/employeeService'
import { useNotification } from '@/composables/useNotification'

const { showSuccess, showError } = useNotification()

const search = ref('')
const loading = ref(false)
const users = ref([])
const employees = ref([])
const availableRoles = ref([])
const dialog = ref(false)
const passwordDialog = ref(false)
const editMode = ref(false)
const saving = ref(false)
const temporaryPassword = ref('')
const formRef = ref(null)

const pagination = ref({
  page: 1,
  perPage: 25,
  total: 0,
  totalPages: 0
})

const headers = [
  { title: 'Username', key: 'username' },
  { title: 'Full Name', key: 'fullName' },
  { title: 'Employee ID', key: 'employeeId' },
  { title: 'Roles', key: 'roles' },
  { title: 'Status', key: 'status' },
  { title: 'Last Login', key: 'lastLogin' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const formData = ref({
  id: null,
  username: '',
  employeeId: null,
  password: '',
  confirmPassword: '',
  roles: [],
  status: 'active'
})

const rules = {
  required: (value) => !!value || 'This field is required',
  password: (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return regex.test(value) || 'Password must be 8+ chars with uppercase, lowercase, number, and special character'
  },
  passwordMatch: (value) => value === formData.value.password || 'Passwords do not match'
}

onMounted(async () => {
  await loadUsers()
  await loadEmployees()
  await loadRoles()
})

async function loadUsers() {
  loading.value = true
  try {
    const data = await userService.getUsers({
      page: pagination.value.page,
      perPage: pagination.value.perPage,
      search: search.value
    })
    users.value = data.users
    pagination.value = data.pagination
  } catch (error) {
    showError('Failed to load users')
  } finally {
    loading.value = false
  }
}

async function loadEmployees() {
  try {
    // For now, return empty array since employee endpoint doesn't exist yet
    employees.value = []
  } catch (error) {
    console.error('Failed to load employees:', error)
  }
}

async function loadRoles() {
  try {
    const response = await userService.getRoles()
    availableRoles.value = response.data
  } catch (error) {
    showError('Failed to load roles')
  }
}

function openAddDialog() {
  editMode.value = false
  formData.value = {
    id: null,
    username: '',
    employeeId: null,
    password: '',
    confirmPassword: '',
    roles: [],
    status: 'active'
  }
  dialog.value = true
}

async function openEditDialog(user) {
  editMode.value = true
  try {
    const userData = await userService.getUserById(user.id)
    formData.value = {
      id: userData.id,
      username: userData.username,
      employeeId: userData.employee_id,
      password: '',
      confirmPassword: '',
      roles: userData.roles.map(r => r.id),
      status: userData.status
    }
    dialog.value = true
  } catch (error) {
    showError('Failed to load user details')
  }
}

function closeDialog() {
  dialog.value = false
  formData.value = {
    id: null,
    username: '',
    employeeId: null,
    password: '',
    confirmPassword: '',
    roles: [],
    status: 'active'
  }
}

async function saveUser() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  
  saving.value = true
  try {
    if (editMode.value) {
      await userService.updateUser(formData.value.id, {
        roles: formData.value.roles,
        status: formData.value.status
      })
      showSuccess('User updated successfully')
    } else {
      await userService.createUser(formData.value)
      showSuccess('User created successfully')
    }
    closeDialog()
    await loadUsers()
  } catch (error) {
    showError(error.response?.data?.error?.message || 'Failed to save user')
  } finally {
    saving.value = false
  }
}

async function resetPassword(user) {
  if (!confirm(`Reset password for ${user.username}?`)) return
  
  try {
    const data = await userService.resetPassword(user.id)
    temporaryPassword.value = data.temporaryPassword
    passwordDialog.value = true
  } catch (error) {
    showError('Failed to reset password')
  }
}

async function toggleStatus(user) {
  const newStatus = user.status === 'active' ? 'inactive' : 'active'
  const action = newStatus === 'inactive' ? 'deactivate' : 'activate'
  
  if (!confirm(`Are you sure you want to ${action} ${user.username}?`)) return
  
  try {
    await userService.updateUser(user.id, { status: newStatus })
    showSuccess(`User ${action}d successfully`)
    await loadUsers()
  } catch (error) {
    showError(`Failed to ${action} user`)
  }
}

function copyPassword() {
  navigator.clipboard.writeText(temporaryPassword.value)
  showSuccess('Password copied to clipboard')
}

function formatDate(dateString) {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  return date.toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function onPageChange(page) {
  pagination.value.page = page
  loadUsers()
}
</script>

