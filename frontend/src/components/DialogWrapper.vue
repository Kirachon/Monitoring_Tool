<template>
  <v-dialog v-model="model" :max-width="maxWidth" :persistent="persistent">
    <v-card>
      <v-card-title class="d-flex align-center">
        <slot name="title">
          <span class="text-h6">{{ title }}</span>
        </slot>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="close" :aria-label="'Close dialog'" />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <slot />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <slot name="actions">
          <v-spacer />
          <v-btn variant="text" @click="close">{{ cancelText }}</v-btn>
          <v-btn color="primary" @click="$emit('confirm')">{{ confirmText }}</v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
/**
 * DialogWrapper.vue
 * Consistent dialog structure and actions.
 */
import { ref, watch } from 'vue'

const emit = defineEmits(['update:modelValue', 'confirm'])
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  maxWidth: { type: [Number, String], default: 560 },
  persistent: { type: Boolean, default: false },
  cancelText: { type: String, default: 'Cancel' },
  confirmText: { type: String, default: 'Confirm' }
})

const model = ref(props.modelValue)
watch(() => props.modelValue, (v) => { model.value = v })
watch(model, (v) => emit('update:modelValue', v))

const close = () => { model.value = false }
</script>

<style scoped>
</style>

