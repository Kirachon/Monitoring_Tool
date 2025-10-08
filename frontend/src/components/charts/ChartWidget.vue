<template>
  <v-card :elevation="2">
    <v-card-title class="d-flex align-center">
      <span class="text-subtitle-1">{{ title }}</span>
      <v-spacer />
      <slot name="actions">
        <v-btn v-if="exportable && canRenderChart" size="small" variant="text" icon="mdi-download" aria-label="Export chart image" @click="exportPng" />
      </slot>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <template v-if="canRenderChart">
        <v-chart
          ref="chartRef"
          :option="finalOption"
          :style="{ width: '100%', height }"
          :autoresize="hasRO"
          aria-label="Chart"
        />
      </template>
      <template v-else>
        <div class="d-flex align-center justify-center" :style="{ width: '100%', height }" aria-label="Chart placeholder">
          <span class="text-caption text-medium-emphasis">Chart preview unavailable in this environment</span>
        </div>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue'

const hasRO = typeof window !== 'undefined' && 'ResizeObserver' in window
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent, DatasetComponent } from 'echarts/components'

use([CanvasRenderer, BarChart, LineChart, PieChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, DatasetComponent])
import { exportChartImage } from '@/utils/exportUtils'

const props = defineProps({
  title: { type: String, required: true },
  option: { type: Object, required: true },
  height: { type: String, default: '280px' },
  exportable: { type: Boolean, default: true }
})

const chartRef = ref(null)


// Basic theme bindings from design tokens / Vuetify
const baseColors = {
  primary: '#0038A8',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  neutral: '#64748B'
}

function isCanvasSupported(){
  try {
    if (typeof document === 'undefined') return false
    const c = document.createElement('canvas')
    if (!c || typeof c.getContext !== 'function') return false
    const ctx = c.getContext('2d')
    return !!ctx
  } catch (e) { return false }
}

const canRenderChart = typeof window !== 'undefined' && typeof document !== 'undefined' && isCanvasSupported()

const finalOption = computed(() => ({
  aria: { enabled: true },
  textStyle: { fontFamily: 'Inter, Roboto, system-ui, sans-serif' },
  color: [baseColors.primary, baseColors.info, baseColors.success, baseColors.warning, baseColors.error, baseColors.neutral],
  tooltip: { trigger: 'item' },
  ...props.option
}))

function exportPng(){
  try {
    const inst = chartRef.value?.getEchartsInstance?.()
    if (inst) {
      const safe = (title || 'chart').replace(/\s+/g,'-').toLowerCase()
      exportChartImage(inst, `${safe}.png`)
    }
  } catch(e) { /* noop */ }
}
</script>

<style scoped>
</style>

