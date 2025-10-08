<template>
  <div>
    <v-row>
      <v-col cols="12" md="4">
        <ActionCard icon="mdi-account-multiple" title="Team" description="Manage team members" to="/employees" />
      </v-col>
      <v-col cols="12" md="4">
        <ActionCard icon="mdi-clipboard-check" title="Approvals" description="Approve team requests" to="/leave/approvals" />
      </v-col>
      <v-col cols="12" md="4">
        <ActionCard icon="mdi-calendar" title="Team Leave" description="Team leave calendar" to="/leave" />
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" md="12">
        <ChartWidget :title="'Team Requests 				Last 30 Days'" :option="team30dOption" height="320px" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ActionCard from '@/components/ActionCard.vue'
import ChartWidget from '@/components/charts/ChartWidget.vue'
import dashboardService from '@/services/dashboardService'

const team30dOption = ref({
  grid: { left: 40, right: 16, top: 32, bottom: 32 },
  xAxis: { type: 'category', data: [] },
  yAxis: { type: 'value' },
  series: [
    { name: 'Team Approvals', type: 'bar', data: [] }
  ],
  legend: { top: 0 }
})

onMounted(async () => {
  try {
    const data = await dashboardService.getDashboard()
    const days = data?.last30Days?.map(d => d.date) || Array.from({length: 30}, (_,i)=>`D${i+1}`)
    const approvals = data?.last30Days?.map(d => d.approvals) || days.map(()=> Math.floor(Math.random()*5))
    team30dOption.value.xAxis.data = days
    team30dOption.value.series[0].data = approvals
  } catch (e) {
    // defaults used
  }
})
</script>

