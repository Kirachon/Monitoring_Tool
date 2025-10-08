<template>
  <v-tooltip :text="text" location="top" activator="parent" open-delay="300">
    <template #activator="{ props }">
      <v-icon
        v-bind="props"
        :icon="icon"
        :size="size"
        class="ml-1"
        :aria-label="ariaLabel"
        role="img"
        tabindex="0"
      />
    </template>
  </v-tooltip>
</template>

<script setup>
/**
 * HelpTooltip.vue
 * Small help icon with tooltip text, for policy-heavy or complex fields.
 */
const props = defineProps({
  text: { type: String, required: true },
  icon: { type: String, default: 'mdi-help-circle-outline' },
  size: { type: [String, Number], default: 18 },
  ariaLabel: { type: String, default: 'Help information' }
})
</script>

<style scoped>
</style>

