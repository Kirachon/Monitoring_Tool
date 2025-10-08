<template>
  <DialogWrapper v-model="open" title="Search" max-width="720" @confirm="navigate">
    <v-autocomplete
      v-model="selected"
      :items="items"
      item-title="label"
      item-value="to"
      :label="'Type to search (Ctrl+K)'
      "
      prepend-inner-icon="mdi-magnify"
      hide-no-data
      auto-select-first
      clearable
      autofocus
      return-object
      @update:search="onSearch"
      @keyup.enter="navigate"
    >
      <template #item="{ props, item }">
        <v-list-item v-bind="props" :title="item?.raw?.label" :subtitle="item?.raw?.subtitle">
          <template #prepend>
            <v-icon :icon="item?.raw?.icon || 'mdi-link-variant'" />
          </template>
          <template #append>
            <v-chip size="x-small" variant="tonal">{{ item?.raw?.group }}</v-chip>
          </template>
        </v-list-item>
      </template>
    </v-autocomplete>
  </DialogWrapper>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import DialogWrapper from '@/components/DialogWrapper.vue'
import { usePermissions } from '@/composables/usePermissions'

const props = defineProps({
  modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const router = useRouter()
const { hasSystemAccess, canViewReports, canManageEmployees, canGenerateCertificates, canApprove, hasPermission } = usePermissions()

const query = ref('')
const selected = ref(null)

const baseItems = computed(() => {
  const out = [
    { label: 'Dashboard', to: '/dashboard', icon: 'mdi-view-dashboard', group: 'General' },
  ]

  // Self service
  out.push({ label: 'Pass Slips', to: '/pass-slips', icon: 'mdi-file-document', group: 'Self Service' })
  out.push({ label: 'Leave', to: '/leave', icon: 'mdi-calendar-check', group: 'Self Service' })

  if (canApprove.value) {
    out.push({ label: 'Approvals — Pass Slips', to: '/pass-slips/approvals', icon: 'mdi-clipboard-check', group: 'Approvals' })
    out.push({ label: 'Approvals — Leave Requests', to: '/leave/approvals', icon: 'mdi-calendar-check', group: 'Approvals' })
  }

  if (canManageEmployees.value) {
    out.push({ label: 'Departments', to: '/departments', icon: 'mdi-office-building', group: 'HR Management' })
    out.push({ label: 'Employees', to: '/employees', icon: 'mdi-account-multiple', group: 'HR Management' })
  }

  if (canGenerateCertificates.value) {
    out.push({ label: 'Certificates — Templates', to: '/certificates/templates', icon: 'mdi-file-document-multiple', group: 'Certificates' })
    out.push({ label: 'Certificates — Generate', to: '/certificates/generate', icon: 'mdi-certificate-outline', group: 'Certificates' })
    out.push({ label: 'Certificates — Issuance Log', to: '/certificates/log', icon: 'mdi-history', group: 'Certificates' })
    out.push({ label: 'Digital Signatures', to: '/signatures', icon: 'mdi-draw', group: 'Certificates' })
  }

  if (canViewReports.value) {
    out.push({ label: 'Reports — Pass Slips', to: '/reports/pass-slips', icon: 'mdi-chart-bar', group: 'Reports' })
    out.push({ label: 'Reports — Leave', to: '/reports/leave', icon: 'mdi-calendar', group: 'Reports' })
    out.push({ label: 'Reports — Certificates', to: '/reports/certificates', icon: 'mdi-certificate', group: 'Reports' })
    if (hasSystemAccess.value) {
      out.push({ label: 'Reports — Audit Logs', to: '/reports/audit-logs', icon: 'mdi-shield-key', group: 'Reports' })
    }
    out.push({ label: 'Reports — Employees', to: '/reports/employees', icon: 'mdi-account', group: 'Reports' })
  }

  if (hasSystemAccess.value) {
    out.push({ label: 'User Management', to: '/users', icon: 'mdi-account-cog', group: 'System' })
    out.push({ label: 'System Settings', to: '/settings', icon: 'mdi-cog', group: 'System' })
  }

  return out
})

const items = computed(() => {
  if (!query.value) return baseItems.value
  const q = query.value.toLowerCase()
  return baseItems.value.filter(i => i.label.toLowerCase().includes(q) || (i.subtitle || '').toLowerCase().includes(q))
})

const onSearch = (val) => { query.value = val }

const navigate = () => {
  if (selected.value?.to) {
    router.push(selected.value.to)
    open.value = false
    selected.value = null
    query.value = ''
  }
}

watch(open, (v) => {
  if (!v) {
    selected.value = null
    query.value = ''
  }
})
</script>

<style scoped>
</style>

