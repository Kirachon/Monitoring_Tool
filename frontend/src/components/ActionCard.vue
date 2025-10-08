<template>
  <v-card
    class="action-card"
    :elevation="hover ? 6 : 2"
    :to="to || undefined"
    :href="href || undefined"
    :ripple="true"
    role="button"
    :aria-label="ariaLabel"
    :tabindex="0"
    @click="handleClick"
    @keyup.enter.space="handleClick"
  >
    <v-card-text class="d-flex align-center">
      <v-avatar v-if="icon" size="40" class="mr-3" color="primary">
        <v-icon :icon="icon" color="white" />
      </v-avatar>
      <div>
        <div class="text-subtitle-1 font-weight-medium">{{ title }}</div>
        <div class="text-body-2 text-medium-emphasis">{{ description }}</div>
      </div>
      <v-spacer />
      <v-icon icon="mdi-chevron-right" aria-hidden="true" />
    </v-card-text>
  </v-card>
</template>

<script setup>
/**
 * ActionCard.vue
 * Quick action card for dashboards with accessible interactions.
 */
import { computed } from 'vue'

const emit = defineEmits(['click'])
const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  to: { type: [String, Object], default: null },
  href: { type: String, default: '' },
  hover: { type: Boolean, default: true }
})

const ariaLabel = computed(() => `${props.title} - ${props.description}`.trim())

const handleClick = (e) => {
  emit('click', e)
}
</script>

<style scoped>
.action-card { transition: transform 0.15s ease, box-shadow 0.15s ease; }
.action-card:hover { transform: translateY(-2px); }
.action-card:focus-visible { outline: 2px solid var(--v-theme-primary); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  .action-card { transition: none; }
  .action-card:hover { transform: none; }
}
</style>

