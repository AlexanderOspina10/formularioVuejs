
<template>
  <div class="mb-4">
    <label :for="id" class="label-field">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <select
        :id="id"
        :value="modelValue"
        @change="handleChange"
        @blur="handleBlur"
        :class="[
          'input-field appearance-none pr-10',
          touched && !isValid ? 'error' : '',
          touched && isValid ? 'success' : ''
        ]"
      >
        <option value="">{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      
      <!-- Flecha del select -->
      <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      <!-- Icono de validación -->
      <div class="absolute inset-y-0 right-8 flex items-center pr-2 pointer-events-none">
        <svg
          v-if="touched && isValid"
          class="w-5 h-5 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <svg
          v-else-if="touched && !isValid"
          class="w-5 h-5 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
    <p v-if="touched && !isValid && errorMessage" class="mt-1 text-sm text-red-600">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
    default: 'Seleccione una opción',
  },
  required: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: 'Este campo es requerido',
  },
});

const emit = defineEmits(['update:modelValue', 'validation']);

const touched = ref(false);

const isValid = computed(() => {
  if (!props.required && !props.modelValue) return true;
  return props.modelValue !== '' && props.modelValue !== null && props.modelValue !== undefined;
});

const handleChange = (event) => {
  const value = event.target.value;
  emit('update:modelValue', value);
  emit('validation', isValid.value);
};

const handleBlur = () => {
  touched.value = true;
  emit('validation', isValid.value);
};

defineExpose({
  isValid,
  touched,
  validate: () => {
    touched.value = true;
    return isValid.value;
  },
});
</script>

