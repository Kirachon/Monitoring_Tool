<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h5">Department Management</span>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openAddDialog">
              Add Department
            </v-btn>
          </v-card-title>

          <v-card-text>
            <!-- Department Tree -->
            <v-treeview
              :items="departments"
              item-value="id"
              item-title="name"
              :loading="loading"
              open-all
            >
              <template #prepend="{ item }">
                <v-icon>mdi-office-building</v-icon>
              </template>

              <template #append="{ item }">
                <div class="d-flex align-center">
                  <v-chip size="small" class="mr-2">
                    {{ item.employee_count }} employees
                  </v-chip>
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    variant="text"
                    @click.stop="openEditDialog(item)"
                  />
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    @click.stop="deleteDepartment(item)"
                  />
                </div>
              </template>

              <template #title="{ item }">
                <div class="d-flex align-center">
                  <span class="font-weight-medium">{{ item.name }}</span>
                  <span v-if="item.dept_head_name" class="text-caption ml-2 text-grey">
                    (Head: {{ item.dept_head_name }})
                  </span>
                </div>
              </template>
            </v-treeview>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit Department Dialog -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card>
        <v-card-title>
          {{ editMode ? 'Edit Department' : 'Add Department' }}
        </v-card-title>

        <v-card-text>
          <v-form ref="formRef">
            <v-text-field
              v-model="formData.name"
              label="Department Name *"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-4"
            />

            <v-select
              v-model="formData.parentId"
              :items="flatDepartments"
              item-title="name"
              item-value="id"
              label="Parent Department"
              variant="outlined"
              clearable
              class="mb-4"
              hint="Leave empty for top-level department"
              persistent-hint
            />

            <v-select
              v-model="formData.deptHeadId"
              :items="employees"
              item-title="fullName"
              item-value="id"
              label="Department Head"
              variant="outlined"
              clearable
              class="mb-4"
              hint="Optional"
              persistent-hint
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" @click="saveDepartment" :loading="saving">
            {{ editMode ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import departmentService from '@/services/departmentService'
import employeeService from '@/services/employeeService'
import { useNotification } from '@/composables/useNotification'

const { showSuccess, showError } = useNotification()

const loading = ref(false)
const departments = ref([])
const employees = ref([])
const dialog = ref(false)
const editMode = ref(false)
const saving = ref(false)
const formRef = ref(null)

const formData = ref({
  id: null,
  name: '',
  parentId: null,
  deptHeadId: null
})

const rules = {
  required: (value) => !!value || 'This field is required'
}

// Flatten department tree for parent dropdown
const flatDepartments = computed(() => {
  const flatten = (depts, level = 0) => {
    let result = []
    for (const dept of depts) {
      // Exclude current department when editing (prevent self-parent)
      if (!editMode.value || dept.id !== formData.value.id) {
        result.push({
          id: dept.id,
          name: '  '.repeat(level) + dept.name
        })
      }
      if (dept.children && dept.children.length > 0) {
        result = result.concat(flatten(dept.children, level + 1))
      }
    }
    return result
  }
  return flatten(departments.value)
})

onMounted(async () => {
  await loadDepartments()
  await loadEmployees()
})

async function loadDepartments() {
  loading.value = true
  try {
    const data = await departmentService.getDepartments()
    departments.value = data
  } catch (error) {
    showError('Failed to load departments')
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

function openAddDialog() {
  editMode.value = false
  formData.value = {
    id: null,
    name: '',
    parentId: null,
    deptHeadId: null
  }
  dialog.value = true
}

function openEditDialog(department) {
  editMode.value = true
  formData.value = {
    id: department.id,
    name: department.name,
    parentId: department.parent_id,
    deptHeadId: department.dept_head_id
  }
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
  formData.value = {
    id: null,
    name: '',
    parentId: null,
    deptHeadId: null
  }
}

async function saveDepartment() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  
  saving.value = true
  try {
    if (editMode.value) {
      await departmentService.updateDepartment(formData.value.id, {
        name: formData.value.name,
        parentId: formData.value.parentId,
        deptHeadId: formData.value.deptHeadId
      })
      showSuccess('Department updated successfully')
    } else {
      await departmentService.createDepartment({
        name: formData.value.name,
        parentId: formData.value.parentId,
        deptHeadId: formData.value.deptHeadId
      })
      showSuccess('Department created successfully')
    }
    closeDialog()
    await loadDepartments()
  } catch (error) {
    showError(error.response?.data?.error?.message || 'Failed to save department')
  } finally {
    saving.value = false
  }
}

async function deleteDepartment(department) {
  if (department.employee_count > 0) {
    showError('Cannot delete department with assigned employees. Reassign employees first.')
    return
  }
  
  if (!confirm(`Are you sure you want to delete "${department.name}"?`)) return
  
  try {
    await departmentService.deleteDepartment(department.id)
    showSuccess('Department deleted successfully')
    await loadDepartments()
  } catch (error) {
    showError(error.response?.data?.error?.message || 'Failed to delete department')
  }
}
</script>

