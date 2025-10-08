<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h5">Holiday Calendar Management</span>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openAddDialog">
              Add Holiday
            </v-btn>
          </v-card-title>

          <v-card-text>
            <!-- Year Selector -->
            <v-row class="mb-4">
              <v-col cols="12" md="3">
                <v-select
                  v-model="selectedYear"
                  :items="years"
                  label="Year"
                  variant="outlined"
                  density="compact"
                  @update:model-value="loadHolidays"
                />
              </v-col>
            </v-row>

            <!-- Holidays Table -->
            <v-data-table
              :headers="headers"
              :items="holidays"
              :loading="loading"
              :items-per-page="25"
            >
              <template #item.date="{ item }">
                {{ formatDate(item.date) }}
              </template>

              <template #item.type="{ item }">
                <v-chip size="small" :color="item.type === 'Regular' ? 'primary' : 'secondary'">
                  {{ item.type }}
                </v-chip>
              </template>

              <template #item.recurring="{ item }">
                <v-icon v-if="item.recurring" color="success">mdi-check</v-icon>
                <v-icon v-else color="grey">mdi-close</v-icon>
              </template>

              <template #item.actions="{ item }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="openEditDialog(item)"
                />
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="deleteHoliday(item)"
                />
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit Holiday Dialog -->
    <v-dialog v-model="dialog" max-width="500" persistent>
      <v-card>
        <v-card-title>
          {{ editMode ? 'Edit Holiday' : 'Add Holiday' }}
        </v-card-title>

        <v-card-text>
          <v-form ref="formRef">
            <v-text-field
              v-model="formData.date"
              label="Date *"
              type="date"
              :rules="[rules.required]"
              variant="outlined"
              :disabled="editMode"
            />
            <v-text-field
              v-model="formData.name"
              label="Holiday Name *"
              :rules="[rules.required]"
              variant="outlined"
            />
            <v-select
              v-model="formData.type"
              :items="['Regular', 'Special Non-Working']"
              label="Type *"
              :rules="[rules.required]"
              variant="outlined"
            />
            <v-checkbox
              v-model="formData.recurring"
              label="Recurring (auto-create for next 5 years)"
              :disabled="editMode"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" @click="saveHoliday" :loading="saving">
            {{ editMode ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import holidayService from '@/services/holidayService'
import { useNotification } from '@/composables/useNotification'

const { showSuccess, showError } = useNotification()

const loading = ref(false)
const holidays = ref([])
const dialog = ref(false)
const editMode = ref(false)
const saving = ref(false)
const formRef = ref(null)
const selectedYear = ref(new Date().getFullYear())

const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i)

const headers = [
  { title: 'Date', key: 'date' },
  { title: 'Holiday Name', key: 'name' },
  { title: 'Type', key: 'type' },
  { title: 'Recurring', key: 'recurring' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const formData = ref({
  id: null,
  date: '',
  name: '',
  type: 'Regular',
  recurring: false
})

const rules = {
  required: (value) => !!value || 'This field is required'
}

onMounted(async () => {
  await loadHolidays()
})

async function loadHolidays() {
  loading.value = true
  try {
    const response = await holidayService.getHolidays(selectedYear.value)
    holidays.value = response.data
  } catch (error) {
    showError('Failed to load holidays')
  } finally {
    loading.value = false
  }
}

function openAddDialog() {
  editMode.value = false
  formData.value = {
    id: null,
    date: '',
    name: '',
    type: 'Regular',
    recurring: false
  }
  dialog.value = true
}

function openEditDialog(holiday) {
  editMode.value = true
  formData.value = {
    id: holiday.id,
    date: holiday.date,
    name: holiday.name,
    type: holiday.type,
    recurring: holiday.recurring
  }
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
}

async function saveHoliday() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  
  saving.value = true
  try {
    if (editMode.value) {
      await holidayService.updateHoliday(formData.value.id, {
        name: formData.value.name,
        type: formData.value.type
      })
      showSuccess('Holiday updated successfully')
    } else {
      await holidayService.createHoliday(formData.value)
      showSuccess('Holiday created successfully')
    }
    closeDialog()
    await loadHolidays()
  } catch (error) {
    showError(error.response?.data?.error?.message || 'Failed to save holiday')
  } finally {
    saving.value = false
  }
}

async function deleteHoliday(holiday) {
  if (!confirm(`Delete holiday "${holiday.name}"?`)) return
  
  try {
    await holidayService.deleteHoliday(holiday.id)
    showSuccess('Holiday deleted successfully')
    await loadHolidays()
  } catch (error) {
    showError(error.response?.data?.error?.message || 'Failed to delete holiday')
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

