<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center ga-4">
            <span class="text-h5">Leave Calendar</span>
            <v-spacer />
            <v-btn variant="text" icon="mdi-chevron-left" @click="prevMonth" :disabled="loading" />
            <v-text-field
              v-model="month"
              label="Month"
              type="month"
              density="compact"
              style="max-width: 180px"
              @update:modelValue="loadData"
            />
            <v-btn variant="text" icon="mdi-chevron-right" @click="nextMonth" :disabled="loading" />
            <v-btn class="ml-4" prepend-icon="mdi-download" color="primary" :loading="exporting" @click="exportPdf">
              Export Calendar
            </v-btn>
          </v-card-title>

          <v-card-subtitle>
            <v-tabs v-model="tab" density="compact">
              <v-tab value="me">My Calendar</v-tab>
              <v-tab value="department">Department Calendar</v-tab>
            </v-tabs>
          </v-card-subtitle>

          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="me">
                <CalendarGrid :days="daysInMonth" :events="eventsMe" :loading="loading" :monthStart="monthStart" scope="me" />
              </v-window-item>
              <v-window-item value="department">
                <CalendarGrid :days="daysInMonth" :events="eventsDept" :loading="loading" :monthStart="monthStart" scope="department" />
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import leaveService from '@/services/leaveService'
import { useNotification } from '@/composables/useNotification'

const { showError, showSuccess } = useNotification()

const tab = ref('me')
const month = ref(new Date().toISOString().substring(0, 7))
const loading = ref(false)
const exporting = ref(false)

const eventsMe = ref([])
const eventsDept = ref([])

const monthStart = computed(() => new Date(`${month.value}-01T00:00:00`))
const daysInMonth = computed(() => {
  const d = new Date(monthStart.value)
  const year = d.getFullYear()
  const m = d.getMonth()
  return new Date(year, m + 1, 0).getDate()
})

onMounted(() => {
  loadData()
})

async function loadData() {
  loading.value = true
  try {
    const [meRes, deptRes] = await Promise.all([
      leaveService.getCalendar({ month: month.value, scope: 'me' }),
      leaveService.getCalendar({ month: month.value, scope: 'department' })
    ])
    eventsMe.value = normalizeEvents(meRes.data)
    eventsDept.value = normalizeEvents(deptRes.data)
  } catch (e) {
    showError('Failed to load calendar')
  } finally {
    loading.value = false
  }
}

function normalizeEvents(items) {
  return items.map(i => ({
    id: i.id,
    title: `${i.leaveTypeName}${i.employeeName ? ' - ' + i.employeeName : ''}`,
    employeeName: i.employeeName,
    code: i.leaveTypeCode,
    dateFrom: i.dateFrom,
    dateTo: i.dateTo,
    days: i.days,
    status: i.status
  }))
}

function prevMonth() {
  const d = new Date(`${month.value}-01T00:00:00`)
  d.setMonth(d.getMonth() - 1)
  month.value = d.toISOString().substring(0, 7)
  loadData()
}

function nextMonth() {
  const d = new Date(`${month.value}-01T00:00:00`)
  d.setMonth(d.getMonth() + 1)
  month.value = d.toISOString().substring(0, 7)
  loadData()
}

async function exportPdf() {
  try {
    exporting.value = true
    const response = await leaveService.exportCalendarPDF({ month: month.value, scope: tab.value })
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leave-calendar-${month.value}-${tab.value}.pdf`
    a.click()
    window.URL.revokeObjectURL(url)
    showSuccess('Calendar exported')
  } catch (e) {
    showError('Failed to export calendar')
  } finally {
    exporting.value = false
  }
}
</script>

<script>
// Local simple calendar grid component
import { defineComponent, computed } from 'vue'
import { VTooltip } from 'vuetify/components'

const colorMap = {
  VL: 'blue',
  SL: 'green',
  ML: 'pink',
  PL: 'purple',
  SPL: 'orange',
  SOLO: 'teal',
  MCL: 'deep-purple',
  RL: 'brown',
  STL: 'indigo',
  TL: 'cyan',
  SLBW: 'pink',
  VAWC: 'red'
}

export default defineComponent({
  name: 'CalendarGrid',
  props: {
    days: { type: Number, required: true },
    monthStart: { type: Date, required: true },
    events: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    scope: { type: String, default: 'me' }
  },
  setup(props) {
    const firstDayWeekIndex = computed(() => {
      const d = new Date(props.monthStart)
      return (d.getDay() + 6) % 7 // Monday=0
    })

    function getDayEvents(day) {
      const date = new Date(props.monthStart)
      date.setDate(day)
      const iso = date.toISOString().substring(0, 10)
      return props.events.filter(e => iso >= e.dateFrom && iso <= e.dateTo)
    }

    function codeColor(code) {
      return colorMap[code] || 'grey'
    }

    return { firstDayWeekIndex, getDayEvents, codeColor }
  },
  template: `
    <div>
      <div class="d-none d-md-block">
        <div class="d-grid" style="grid-template-columns: repeat(7, 1fr); gap: 8px;">
          <div class="text-caption text-medium-emphasis" v-for="h in ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']" :key="h">{{ h }}</div>
          <div v-for="i in firstDayWeekIndex" :key="'pad'+i"></div>
          <div v-for="d in days" :key="d" class="pa-2" style="border: 1px solid #eee; min-height: 120px;">
            <div class="text-caption mb-1">{{ d }}</div>
            <div v-for="ev in getDayEvents(d)" :key="ev.id + '-' + d" class="mb-1">
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <v-chip v-bind="props" size="x-small" :color="codeColor(ev.code)" :text="scope==='department' ? (ev.employeeName) : (ev.code)" class="mr-1" label />
                </template>
                <span>{{ ev.title }} | {{ ev.dateFrom }} → {{ ev.dateTo }} | {{ ev.days }} day(s) | {{ ev.status }}</span>
              </v-tooltip>
            </div>
          </div>
        </div>
      </div>

      <div class="d-md-none">
        <v-list density="compact">
          <v-list-item v-for="d in days" :key="'m-'+d">
            <v-list-item-title class="text-caption mb-1">{{ monthStart.getFullYear() }}-{{ (monthStart.getMonth()+1).toString().padStart(2,'0') }}-{{ d.toString().padStart(2,'0') }}</v-list-item-title>
            <div v-for="ev in getDayEvents(d)" :key="'m-'+d+'-'+ev.id" class="mb-1">
              <v-chip size="x-small" :color="codeColor(ev.code)" :text="scope==='department' ? (ev.employeeName) : (ev.code)" class="mr-1" label />
              <span class="text-caption">{{ ev.title }}</span>
            </div>
          </v-list-item>
        </v-list>
      </div>
    </div>
  `
})
</script>

<style scoped>
.d-grid { display: grid; }
</style>

