<template>
  <div>
    <v-row>
      <v-col cols="12" md="3">
        <ActionCard icon="mdi-account-group" title="User Management" description="Manage users and roles" to="/employees" />
      </v-col>
      <v-col cols="12" md="3">
        <ActionCard icon="mdi-shield-key" title="Audit Logs" description="View system activities" to="/reports/audit-logs" />
      </v-col>
      <v-col cols="12" md="3">
        <ActionCard icon="mdi-cog" title="System Settings" description="Configure system" to="/settings" />
      </v-col>
      <v-col cols="12" md="3">
        <ActionCard icon="mdi-chart-line" title="Analytics" description="Key system metrics" to="/reports" />
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" md="8">
        <ChartWidget :title="'Requests — Last 7 Days'" :option="requests7dOption" height="320px" />
      </v-col>
      <v-col cols="12" md="4">
        <ChartWidget :title="'Requests by Type'" :option="byTypeOption" height="320px" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ActionCard from '@/components/ActionCard.vue'
import ChartWidget from '@/components/charts/ChartWidget.vue'
import dashboardService from '@/services/dashboardService'

const requests7dOption = ref({
  grid: { left: 40, right: 16, top: 32, bottom: 32 },
  xAxis: { type: 'category', data: [] },
  yAxis: { type: 'value' },
  series: [
    { name: 'Pass Slips', type: 'line', smooth: true, data: [] },
    { name: 'Leave', type: 'line', smooth: true, data: [] }
  ],
  legend: { top: 0 }
})

const byTypeOption = ref({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  series: [{ type: 'pie', radius: ['40%','70%'], data: [] }],
  legend: { bottom: 0 }
})

onMounted(async () => {
  try {
    const data = await dashboardService.getDashboard()
    // Expected shape (fallbacks if absent)
    const days = data?.last7Days?.map(d => d.date) || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
    const passSeries = data?.last7Days?.map(d => d.passSlips) || [2,4,3,6,2,1,0]
    const leaveSeries = data?.last7Days?.map(d => d.leave) || [1,2,1,3,1,0,0]

    requests7dOption.value.xAxis.data = days
    requests7dOption.value.series[0].data = passSeries
    requests7dOption.value.series[1].data = leaveSeries

    const typeAgg = data?.requestsByType || [
      { name: 'Pass Slips', value: (passSeries.reduce((a,b)=>a+b,0)) },
      { name: 'Leave', value: (leaveSeries.reduce((a,b)=>a+b,0)) }
    ]
    byTypeOption.value.series[0].data = typeAgg
  } catch (e) {
    // Fallback sample data ensures dashboard renders even if API not ready
  }
})
</script>

