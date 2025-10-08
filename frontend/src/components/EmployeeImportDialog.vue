<template>
  <v-dialog v-model="show" max-width="800" persistent scrollable>
    <v-card>
      <v-card-title>Import Employees</v-card-title>
      
      <v-card-text>
        <v-stepper v-model="step" alt-labels>
          <v-stepper-header>
            <v-stepper-item value="1" title="Download Template" />
            <v-divider />
            <v-stepper-item value="2" title="Upload File" />
            <v-divider />
            <v-stepper-item value="3" title="Review & Import" />
          </v-stepper-header>

          <v-stepper-window>
            <!-- Step 1: Download Template -->
            <v-stepper-window-item value="1">
              <v-card flat>
                <v-card-text>
                  <p class="mb-4">Download the CSV template and fill in employee data.</p>
                  <v-btn color="primary" prepend-icon="mdi-download" @click="downloadTemplate">
                    Download CSV Template
                  </v-btn>
                  <v-alert type="info" class="mt-4">
                    <div class="text-subtitle-2 mb-2">Required Fields:</div>
                    <ul class="text-body-2">
                      <li>employee_id, first_name, last_name, date_of_birth</li>
                      <li>gender, civil_status, position, salary_grade</li>
                      <li>department_name, employment_status, date_hired</li>
                    </ul>
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-stepper-window-item>

            <!-- Step 2: Upload File -->
            <v-stepper-window-item value="2">
              <v-card flat>
                <v-card-text>
                  <v-file-input
                    v-model="file"
                    label="Upload CSV File"
                    accept=".csv"
                    prepend-icon="mdi-file-upload"
                    variant="outlined"
                    :rules="[rules.required, rules.fileSize]"
                    @change="parseFile"
                  />
                  <v-alert v-if="parseError" type="error" class="mt-4">
                    {{ parseError }}
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-stepper-window-item>

            <!-- Step 3: Review & Import -->
            <v-stepper-window-item value="3">
              <v-card flat>
                <v-card-text>
                  <v-alert type="info" class="mb-4">
                    Total Rows: {{ parsedData.length }} | Valid: {{ validRows.length }} | Invalid: {{ invalidRows.length }}
                  </v-alert>
                  
                  <v-data-table
                    :headers="previewHeaders"
                    :items="parsedData"
                    density="compact"
                    :items-per-page="10"
                  >
                    <template #item="{ item }">
                      <tr :class="item.valid ? 'bg-green-lighten-5' : 'bg-red-lighten-5'">
                        <td>{{ item.employeeId }}</td>
                        <td>{{ item.firstName }} {{ item.lastName }}</td>
                        <td>{{ item.position }}</td>
                        <td>{{ item.departmentName }}</td>
                        <td>
                          <v-chip v-if="item.valid" size="small" color="success">Valid</v-chip>
                          <v-tooltip v-else>
                            <template #activator="{ props }">
                              <v-chip v-bind="props" size="small" color="error">Invalid</v-chip>
                            </template>
                            {{ item.errors.join(', ') }}
                          </v-tooltip>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-stepper-window-item>
          </v-stepper-window>
        </v-stepper>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn v-if="step < 3" color="primary" @click="step++">Next</v-btn>
        <v-btn v-if="step === 3" color="primary" :loading="importing" @click="importEmployees">
          Import {{ validRows.length }} Valid Rows
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import employeeService from '@/services/employeeService'
import { useNotification } from '@/composables/useNotification'

const props = defineProps({
  modelValue: Boolean,
  departments: Array
})

const emit = defineEmits(['update:modelValue', 'imported'])

const { showSuccess, showError } = useNotification()

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const step = ref(1)
const file = ref(null)
const parsedData = ref([])
const parseError = ref('')
const importing = ref(false)

const rules = {
  required: (value) => !!value || 'File is required',
  fileSize: (value) => !value || value.size < 5000000 || 'File size must be less than 5MB'
}

const previewHeaders = [
  { title: 'Employee ID', key: 'employeeId' },
  { title: 'Name', key: 'name' },
  { title: 'Position', key: 'position' },
  { title: 'Department', key: 'departmentName' },
  { title: 'Status', key: 'status' }
]

const validRows = computed(() => parsedData.value.filter(row => row.valid))
const invalidRows = computed(() => parsedData.value.filter(row => !row.valid))

function downloadTemplate() {
  const headers = [
    'employee_id', 'first_name', 'middle_name', 'last_name', 'suffix',
    'date_of_birth', 'gender', 'civil_status', 'position', 'salary_grade',
    'department_name', 'employment_status', 'date_hired', 'date_regularized',
    'email', 'mobile', 'address_street', 'address_barangay', 'address_city',
    'address_province', 'address_postal_code'
  ]
  
  const csv = headers.join(',') + '\n'
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'employee_import_template.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function parseFile() {
  if (!file.value) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const text = e.target.result
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim())
      
      parsedData.value = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim())
        const row = {}
        headers.forEach((header, i) => {
          row[header] = values[i] || ''
        })
        
        // Validate row
        const errors = []
        if (!row.employee_id) errors.push('Employee ID required')
        if (!row.first_name) errors.push('First name required')
        if (!row.last_name) errors.push('Last name required')
        if (!row.date_of_birth) errors.push('Date of birth required')
        if (!row.gender) errors.push('Gender required')
        if (!row.civil_status) errors.push('Civil status required')
        if (!row.position) errors.push('Position required')
        if (!row.salary_grade) errors.push('Salary grade required')
        if (!row.department_name) errors.push('Department required')
        if (!row.employment_status) errors.push('Employment status required')
        if (!row.date_hired) errors.push('Date hired required')
        
        // Find department ID
        const dept = props.departments.find(d => d.name === row.department_name)
        if (!dept && row.department_name) errors.push('Department not found')
        
        return {
          employeeId: row.employee_id,
          firstName: row.first_name,
          middleName: row.middle_name,
          lastName: row.last_name,
          suffix: row.suffix,
          dateOfBirth: row.date_of_birth,
          gender: row.gender,
          civilStatus: row.civil_status,
          position: row.position,
          salaryGrade: row.salary_grade,
          departmentId: dept?.id,
          departmentName: row.department_name,
          employmentStatus: row.employment_status,
          dateHired: row.date_hired,
          dateRegularized: row.date_regularized,
          email: row.email,
          mobileNumber: row.mobile,
          street: row.address_street,
          barangay: row.address_barangay,
          city: row.address_city,
          province: row.address_province,
          postalCode: row.address_postal_code,
          valid: errors.length === 0,
          errors
        }
      })
      
      step.value = 3
      parseError.value = ''
    } catch (error) {
      parseError.value = 'Failed to parse CSV file. Please check the format.'
    }
  }
  reader.readAsText(file.value)
}

async function importEmployees() {
  importing.value = true
  try {
    const response = await employeeService.bulkImport(validRows.value)
    showSuccess(`Import completed: ${response.data.successful} successful, ${response.data.failed} failed`)
    emit('imported')
    close()
  } catch (error) {
    showError('Failed to import employees')
  } finally {
    importing.value = false
  }
}

function close() {
  show.value = false
  step.value = 1
  file.value = null
  parsedData.value = []
  parseError.value = ''
}
</script>

