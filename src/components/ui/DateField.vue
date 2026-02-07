<template>
  <div class="mb-4">
    <label :for="id" class="label-field">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        :id="id"
        type="date"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        :max="maxDate"
        :class="[
          'input-field',
          'pr-10',
          touched && !isValid ? 'error' : '',
          touched && isValid ? 'success' : ''
        ]"
      />
      
      <!-- Icono de validación -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  validateAge: {
    type: Boolean,
    default: false,
  },
  minAge: {
    type: Number,
    default: 18,
  },
  errorMessage: {
    type: String,
    default: 'Debe ser mayor de 18 años',
  },
});

const emit = defineEmits(['update:modelValue', 'validation']);

const touched = ref(false);

const maxDate = computed(() => {
  if (props.validateAge) {
    const today = new Date();
    today.setFullYear(today.getFullYear() - props.minAge);
    return today.toISOString().split('T')[0];
  }
  return '';
});

const isValid = computed(() => {
  if (!props.required && !props.modelValue) return true;
  if (!props.modelValue) return false;
  
  if (props.validateAge) {
    const today = new Date();
    const birth = new Date(props.modelValue);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age >= props.minAge;
  }
  
  return true;
});

const handleInput = (event) => {
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