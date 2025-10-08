<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-certificate" class="mr-2"></v-icon>
            Certificate Templates
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="openCreateDialog"
            >
              New Template
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-alert v-if="error" type="error" closable @click:close="error = null" class="mb-4">
              {{ error }}
            </v-alert>

            <v-alert v-if="success" type="success" closable @click:close="success = null" class="mb-4">
              {{ success }}
            </v-alert>

            <v-data-table
              :headers="headers"
              :items="templates"
              :loading="loading"
              :items-per-page="25"
              class="elevation-1"
            >
              <template v-slot:item.type="{ item }">
                <v-chip size="small" :color="getTypeColor(item.type)" variant="tonal">
                  {{ item.type }}
                </v-chip>
              </template>

              <template v-slot:item.placeholders="{ item }">
                <template v-for="(placeholder, index) in parsePlaceholders(item.placeholders).slice(0, 3)" :key="index">
                  <v-chip size="x-small" class="mr-1" variant="outlined">
                    {{ placeholder }}
                  </v-chip>
                </template>
                <span v-if="parsePlaceholders(item.placeholders).length > 3" class="text-caption">
                  +{{ parsePlaceholders(item.placeholders).length - 3 }} more
                </span>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  @click="previewTemplate(item)"
                  title="Preview"
                ></v-btn>
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="editTemplate(item)"
                  title="Edit"
                ></v-btn>
                <v-btn
                  icon="mdi-content-copy"
                  size="small"
                  variant="text"
                  @click="duplicateTemplate(item)"
                  title="Duplicate"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="deleteTemplate(item)"
                  title="Delete"
                ></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="900" persistent>
      <v-card>
        <v-card-title>{{ editMode ? 'Edit Template' : 'New Template' }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="formData.name"
              label="Template Name *"
              :rules="[v => !!v || 'Name is required']"
              required
            ></v-text-field>

            <v-select
              v-model="formData.type"
              label="Template Type *"
              :items="['Employment', 'Clearance', 'Leave', 'Service', 'Other']"
              :rules="[v => !!v || 'Type is required']"
              required
            ></v-select>

            <v-textarea
              v-model="formData.content"
              label="Template Content (HTML) *"
              rows="10"
              :rules="[v => !!v || 'Content is required']"
              required
              hint="Use {{placeholder}} for dynamic values"
              persistent-hint
            ></v-textarea>

            <v-combobox
              v-model="formData.placeholders"
              label="Placeholders"
              multiple
              chips
              closable-chips
              hint="Press Enter to add placeholders (e.g., employee_name, department)"
              persistent-hint
            ></v-combobox>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeDialog">Cancel</v-btn>
          <v-btn
            color="primary"
            @click="saveTemplate"
            :loading="saving"
          >
            {{ editMode ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Preview Dialog -->
    <v-dialog v-model="previewDialog" max-width="800">
      <v-card>
        <v-card-title>Template Preview</v-card-title>
        <v-card-text>
          <div v-html="previewContent" style="border: 1px solid #ccc; padding: 20px; background: white;"></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="previewDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import certificateService from '../../services/certificateService'

const templates = ref([])
const loading = ref(false)
const error = ref(null)
const success = ref(null)

const dialog = ref(false)
const editMode = ref(false)
const saving = ref(false)
const form = ref(null)

const previewDialog = ref(false)
const previewContent = ref('')

const formData = ref({
  name: '',
  type: '',
  content: '',
  placeholders: []
})

const headers = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Type', key: 'type', sortable: true },
  { title: 'Placeholders', key: 'placeholders', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

// Robustly parse placeholders that may be stored as JSON string, array, comma-separated string, or single token
const parsePlaceholders = (value) => {
  try {
    if (Array.isArray(value)) return value
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (!trimmed) return []
      try { return JSON.parse(trimmed) } catch (_) {}
      if (trimmed.includes(',')) {
        return trimmed.split(',').map(s => s.trim()).filter(Boolean)
      }
      return [trimmed]
    }
    return []
  } catch (_) {
    return []
  }
}

const loadTemplates = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await certificateService.getTemplates()
    templates.value = response.data
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to load templates'
  } finally {
    loading.value = false
  }
}

const openCreateDialog = () => {
  editMode.value = false
  formData.value = {
    name: '',
    type: '',
    content: '',
    placeholders: []
  }
  dialog.value = true
}

const editTemplate = (template) => {
  editMode.value = true
  formData.value = {
    id: template.id,
    name: template.name,
    type: template.type,
    content: template.content,
    placeholders: JSON.parse(template.placeholders || '[]')
  }
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  formData.value = {
    name: '',
    type: '',
    content: '',
    placeholders: []
  }
}

const saveTemplate = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  saving.value = true
  error.value = null
  
  try {
    if (editMode.value) {
      await certificateService.updateTemplate(formData.value.id, formData.value)
      success.value = 'Template updated successfully'
    } else {
      await certificateService.createTemplate(formData.value)
      success.value = 'Template created successfully'
    }
    closeDialog()
    await loadTemplates()
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to save template'
  } finally {
    saving.value = false
  }
}

const previewTemplate = (template) => {
  previewContent.value = template.content
  previewDialog.value = true
}

const duplicateTemplate = async (template) => {
  if (!confirm(`Duplicate template "${template.name}"?`)) return

  loading.value = true
  error.value = null
  
  try {
    await certificateService.duplicateTemplate(template.id)
    success.value = 'Template duplicated successfully'
    await loadTemplates()
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to duplicate template'
  } finally {
    loading.value = false
  }
}

const deleteTemplate = async (template) => {
  if (!confirm(`Delete template "${template.name}"? This action cannot be undone.`)) return

  loading.value = true
  error.value = null
  
  try {
    await certificateService.deleteTemplate(template.id)
    success.value = 'Template deleted successfully'
    await loadTemplates()
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to delete template'
  } finally {
    loading.value = false
  }
}

const getTypeColor = (type) => {
  const colors = {
    'Employment': 'primary',
    'Clearance': 'success',
    'Leave': 'warning',
    'Service': 'info',
    'Other': 'grey'
  }
  return colors[type] || 'grey'
}

onMounted(() => {
  loadTemplates()
})
</script>

