<template>
  <div>
    <v-stepper v-model="model" alt-labels>
      <v-stepper-header>
        <template v-for="(s, idx) in steps" :key="idx">
          <v-stepper-item :value="idx + 1" :title="s.title" :subtitle="s.subtitle" />
          <v-divider v-if="idx < steps.length - 1" />
        </template>
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item v-for="(s, idx) in steps" :key="idx" :value="idx + 1">
          <slot :name="`step-${idx+1}`" />
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions>
        <v-btn variant="text" @click="prev" :disabled="model <= 1">Back</v-btn>
        <v-spacer />
        <v-btn color="primary" @click="next" :aria-label="model < steps.length ? 'Next step' : 'Finish'">
          {{ model < steps.length ? 'Next' : finishText }}
        </v-btn>
      </v-stepper-actions>
    </v-stepper>
  </div>
</template>

<script setup>
/**
 * FormStepper.vue
 * Wrapper around Vuetify's stepper for multi-step forms.
 */
import { ref, watch } from 'vue'

const emit = defineEmits(['update:modelValue', 'finish'])
const props = defineProps({
  steps: { type: Array, required: true }, // [{title, subtitle?}]
  modelValue: { type: Number, default: 1 },
  finishText: { type: String, default: 'Finish' }
})

const model = ref(props.modelValue)

watch(() => props.modelValue, (v) => { model.value = v })
watch(model, (v) => emit('update:modelValue', v))

const next = () => {
  if (model.value < props.steps.length) model.value += 1
  else emit('finish')
}
const prev = () => { if (model.value > 1) model.value -= 1 }
</script>

<style scoped>
</style>

