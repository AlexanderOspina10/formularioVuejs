<template>
  <div class="mb-4">
    <label :for="id" class="label-field">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <div
        @click="triggerFileInput"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        :class="[
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200',
          isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400',
          touched && !isValid ? 'border-red-500 bg-red-50' : '',
          touched && isValid ? 'border-green-500 bg-green-50' : ''
        ]"
      >
        <input
          :id="id"
          ref="fileInput"
          type="file"
          accept=".jpg,.jpeg"
          @change="handleFileChange"
          class="hidden"
        />
        
        <div v-if="!fileName" class="space-y-2">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div class="text-sm text-gray-600">
            <span class="font-medium text-primary-600">Click para subir</span> o arrastra el archivo
          </div>
          <p class="text-xs text-gray-500">Solo archivos JPG</p>
        </div>
        
        <div v-else class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <svg class="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="text-sm font-medium text-gray-900">{{ fileName }}</span>
          </div>
          <button
            @click.stop="clearFile"
            class="text-red-600 hover:text-red-800"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Icono de validación -->
        <div v-if="touched" class="absolute top-2 right-2">
          <svg
            v-if="isValid"
            class="w-6 h-6 text-green-500"
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
            v-else
            class="w-6 h-6 text-red-500"
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
    type: File,
    default: null,
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

const fileInput = ref(null);
const fileName = ref('');
const touched = ref(false);
const isDragging = ref(false);

const isValid = computed(() => {
  if (!props.required && !props.modelValue) return true;
  if (!props.modelValue) return false;
  
  const validTypes = ['image/jpeg', 'image/jpg'];
  return validTypes.includes(props.modelValue.type);
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    processFile(file);
  }
};

const handleDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files?.[0];
  if (file) {
    processFile(file);
  }
};

const processFile = (file) => {
  touched.value = true;
  fileName.value = file.name;
  emit('update:modelValue', file);
  emit('validation', isValid.value);
};

const clearFile = () => {
  fileName.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  emit('update:modelValue', null);
  emit('validation', false);
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