# Story 1.5: User Management Interface

**Epic:** 1 - Foundation & Authentication  
**Story ID:** 1.5  
**Story Type:** Feature Development  
**Priority:** High  
**Estimated Effort:** 6-8 hours  
**Dependencies:** Story 1.4 (RBAC)  
**Status:** Ready for Development

---

## User Story

As a **system administrator**,  
I want **to create, modify, and deactivate user accounts with role assignments**,  
so that **I can manage system access for all employees**.

---

## Acceptance Criteria

1. ✅ User management page displays searchable, sortable table of all users with columns: username, full name, roles, status (active/inactive), last login
2. ✅ "Add User" button opens modal form with fields: username, full name, email, employee_id (dropdown), initial password, confirm password, roles (multi-select checkboxes)
3. ✅ POST /api/users endpoint creates new user with validation: username unique, password meets complexity requirements (8+ chars, uppercase, lowercase, number, special char), employee_id exists
4. ✅ "Edit User" button opens modal pre-populated with user data, allows modification of: full name, email, roles, status
5. ✅ PUT /api/users/:id endpoint updates user with validation
6. ✅ "Deactivate User" button changes user status to inactive (soft delete, no data deletion)
7. ✅ Inactive users cannot log in, receive message: "Account deactivated. Contact system administrator."
8. ✅ "Reset Password" button generates temporary password, displays to admin (no email sent)
9. ✅ User must change temporary password on first login
10. ✅ All user management actions logged to audit log with admin user attribution
11. ✅ Search functionality filters users by username, full name, or employee ID
12. ✅ Pagination displays 25 users per page with page navigation

---

## Technical Specifications

### API Endpoints

**GET /api/users**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "username": "jdoe",
        "fullName": "Juan Dela Cruz",
        "email": "jdoe@agency.gov.ph",
        "employeeId": "2025-0001",
        "roles": ["Employee"],
        "status": "active",
        "lastLogin": "2025-01-06T08:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "perPage": 25,
      "total": 150,
      "totalPages": 6
    }
  }
}
```

**POST /api/users**
```json
{
  "username": "msmith",
  "fullName": "Maria Smith",
  "email": "msmith@agency.gov.ph",
  "employeeId": 5,
  "password": "TempPass123!",
  "roles": [1, 2]
}
```

**PUT /api/users/:id**
```json
{
  "fullName": "Maria Santos-Smith",
  "email": "msantos@agency.gov.ph",
  "roles": [1, 2, 3],
  "status": "active"
}
```

**POST /api/users/:id/reset-password**
```json
{
  "success": true,
  "data": {
    "temporaryPassword": "Temp2025!Abc"
  },
  "message": "Temporary password generated. User must change on first login."
}
```

---

## Frontend Implementation

### User Management Component (src/views/admin/UserManagement.vue)

```vue
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
              variant="outlined"
              density="compact"
              clearable
              class="mb-4"
            />

            <!-- Users Table -->
            <v-data-table
              :headers="headers"
              :items="users"
              :loading="loading"
              :search="search"
              :items-per-page="25"
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
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>
          {{ editMode ? 'Edit User' : 'Add User' }}
        </v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="formData.username"
              label="Username *"
              :rules="[rules.required]"
              :disabled="editMode"
              variant="outlined"
              class="mb-4"
            />

            <v-text-field
              v-model="formData.fullName"
              label="Full Name *"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-4"
            />

            <v-text-field
              v-model="formData.email"
              label="Email *"
              :rules="[rules.required, rules.email]"
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
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
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

const headers = [
  { title: 'Username', key: 'username' },
  { title: 'Full Name', key: 'fullName' },
  { title: 'Roles', key: 'roles' },
  { title: 'Status', key: 'status' },
  { title: 'Last Login', key: 'lastLogin' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const formData = ref({
  username: '',
  fullName: '',
  email: '',
  employeeId: null,
  password: '',
  confirmPassword: '',
  roles: []
})

const rules = {
  required: (v) => !!v || 'This field is required',
  email: (v) => /.+@.+\..+/.test(v) || 'Invalid email format',
  password: (v) => {
    if (!v) return 'Password is required'
    if (v.length < 8) return 'Minimum 8 characters'
    if (!/[A-Z]/.test(v)) return 'Must contain uppercase letter'
    if (!/[a-z]/.test(v)) return 'Must contain lowercase letter'
    if (!/[0-9]/.test(v)) return 'Must contain number'
    if (!/[!@#$%^&*]/.test(v)) return 'Must contain special character'
    return true
  },
  passwordMatch: (v) => v === formData.value.password || 'Passwords must match'
}

async function loadUsers() {
  loading.value = true
  try {
    const response = await userService.getAll()
    users.value = response.data.users
  } catch (error) {
    showError('Failed to load users')
  } finally {
    loading.value = false
  }
}

async function loadEmployees() {
  const response = await employeeService.getAll()
  employees.value = response.data.employees
}

async function loadRoles() {
  const response = await userService.getRoles()
  availableRoles.value = response.data.roles
}

function openAddDialog() {
  editMode.value = false
  formData.value = {
    username: '',
    fullName: '',
    email: '',
    employeeId: null,
    password: '',
    confirmPassword: '',
    roles: []
  }
  dialog.value = true
}

function openEditDialog(user) {
  editMode.value = true
  formData.value = {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    employeeId: user.employeeId,
    roles: user.roleIds
  }
  dialog.value = true
}

async function saveUser() {
  saving.value = true
  try {
    if (editMode.value) {
      await userService.update(formData.value.id, formData.value)
      showSuccess('User updated successfully')
    } else {
      await userService.create(formData.value)
      showSuccess('User created successfully')
    }
    dialog.value = false
    loadUsers()
  } catch (error) {
    showError(error.response?.data?.error?.message || 'Failed to save user')
  } finally {
    saving.value = false
  }
}

async function resetPassword(user) {
  try {
    const response = await userService.resetPassword(user.id)
    temporaryPassword.value = response.data.data.temporaryPassword
    passwordDialog.value = true
  } catch (error) {
    showError('Failed to reset password')
  }
}

async function toggleStatus(user) {
  try {
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    await userService.update(user.id, { status: newStatus })
    showSuccess(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`)
    loadUsers()
  } catch (error) {
    showError('Failed to update user status')
  }
}

function copyPassword() {
  navigator.clipboard.writeText(temporaryPassword.value)
  showSuccess('Password copied to clipboard')
}

function formatDate(date) {
  return date ? new Date(date).toLocaleString() : 'Never'
}

onMounted(() => {
  loadUsers()
  loadEmployees()
  loadRoles()
})
</script>
```

---

## Testing Checklist

- [ ] User management page displays all users
- [ ] Search filters users correctly
- [ ] Add user dialog opens and validates input
- [ ] New user created with valid data
- [ ] Password complexity validation works
- [ ] Edit user dialog pre-populates data
- [ ] User updated successfully
- [ ] Deactivate user changes status
- [ ] Inactive users cannot log in
- [ ] Reset password generates temporary password
- [ ] Temporary password displayed to admin
- [ ] All actions logged to audit log

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Frontend component implemented
- [ ] Backend API endpoints implemented
- [ ] Validation working
- [ ] Audit logging implemented
- [ ] Tests passing
- [ ] Ready for Story 1.6 (Password Management)

---

**Next Story:** 1.6 - Password Management

