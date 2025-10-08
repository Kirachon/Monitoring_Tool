<template>
  <div>
    <v-row>
      <v-col cols="12" md="3">
        <ActionCard icon="mdi-clipboard-check" title="Approvals" description="Review pending requests" to="/leave/approvals" />
      </v-col>
      <v-col cols="12" md="3">
        <ActionCard icon="mdi-file-multiple" title="Reports" description="Generate HR reports" to="/reports" />
      </v-col>
      <v-col cols="12" md="3">
        <ActionCard icon="mdi-account-badge" title="Employees" description="Manage employee records" to="/employees" />
      </v-col>
      <v-col cols="12" md="3">
        <ActionCard icon="mdi-office-building" title="Departments" description="Department structure" to="/departments" />
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" md="8">
        <ChartWidget :title="'Headcount by Department'" :option="headcountOption" height="320px" />
      </v-col>
      <v-col cols="12" md="4">
        <ChartWidget :title="'Leave Status Breakdown'" :option="leaveStatusOption" height="320px" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ActionCard from '@/components/ActionCard.vue'
import ChartWidget from '@/components/charts/ChartWidget.vue'
import dashboardService from '@/services/dashboardService'

const headcountOption = ref({
  grid: { left: 80, right: 16, top: 32, bottom: 32 },
  xAxis: { type: 'value' },
  yAxis: { type: 'category', data: [] },
  series: [{ type: 'bar', data: [] }]
})

const leaveStatusOption = ref({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  series: [{ type: 'pie', radius: ['40%','70%'], data: [] }],
  legend: { bottom: 0 }
})

onMounted(async () => {
  try {
    const data = await dashboardService.getDashboard()
    const byDept = data?.headcountByDepartment || [
      { name: 'Admin', value: 12 },
      { name: 'HR', value: 8 },
      { name: 'IT', value: 15 }
    ]
    headcountOption.value.yAxis.data = byDept.map(d => d.name)
    headcountOption.value.series[0].data = byDept.map(d => d.value)

    const leaveBreakdown = data?.leaveStatus || [
      { name: 'Approved', value: 14 },
      { name: 'Pending', value: 6 },
      { name: 'Denied', value: 2 }
    ]
    leaveStatusOption.value.series[0].data = leaveBreakdown
  } catch (e) {
    // use defaults
  }
})
</script>

