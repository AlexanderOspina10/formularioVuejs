
<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Información de Residencia</h2>
    
    <div class="grid grid-cols-1 gap-4">
      <!-- Dirección de Residencia -->
      <InputField
        ref="addressRef"
        id="address"
        label="Dirección de Residencia"
        v-model="formData.address"
        placeholder="Calle 123 # 45-67, Apto 101"
        :required="true"
        :validator="validateAddress"
        error-message="Ingrese una dirección válida (mínimo 10 caracteres)"
        @validation="onValidation('address', $event)"
      />

      <!-- Código Postal -->
      <InputField
        ref="postalCodeRef"
        id="postalCode"
        label="Código Postal"
        v-model="formData.postalCode"
        placeholder="Ej: 110111"
        :required="true"
        :validator="formValidation.validatePostalCode"
        error-message="Ingrese un código postal válido (mínimo 4 caracteres)"
        @input="filterPostalCode"
        @keypress="preventNonNumeric"
        @validation="onValidation('postalCode', $event)"
      />
    </div>

    <!-- Resumen de validación -->
    <div v-if="showValidationSummary && !isStepValid" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm font-medium text-red-800 flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        Faltan campos por completar: {{ invalidFields.length }} campo(s) requerido(s)
      </p>
      <ul class="mt-2 text-sm text-red-700 list-disc list-inside">
        <li v-for="field in invalidFields" :key="field">
          {{ getFieldLabel(field) }}
        </li>
      </ul>
    </div>

    <!-- Resumen de información -->
    <div class="mt-8 p-6 bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl border border-primary-100">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Resumen de Registro
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-gray-600">Nombre Completo</p>
          <p class="font-medium text-gray-900">{{ fullName }}</p>
        </div>
        <div>
          <p class="text-gray-600">Correo Electrónico</p>
          <p class="font-medium text-gray-900">{{ step2Data.email || '-' }}</p>
        </div>
        <div>
          <p class="text-gray-600">Tipo de Documento</p>
          <p class="font-medium text-gray-900">{{ documentTypeLabel }}</p>
        </div>
        <div>
          <p class="text-gray-600">Número de Documento</p>
          <p class="font-medium text-gray-900">{{ step1Data.documentNumber || '-' }}</p>
        </div>
        <div>
          <p class="text-gray-600">Teléfono</p>
          <p class="font-medium text-gray-900">{{ step2Data.phone || '-' }}</p>
        </div>
        <div>
          <p class="text-gray-600">Celular</p>
          <p class="font-medium text-gray-900">{{ step2Data.mobile || '-' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject, watch, onMounted, nextTick } from 'vue';
import InputField from '@/components/ui/InputField.vue';
import { useFormValidation } from '@/composables/useFormValidation.js';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'isValid']);

const formValidation = useFormValidation();

const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Obtener datos de los pasos anteriores
const injectedData = inject('allFormData', {});
const step1Data = computed(() => injectedData.step1?.value || {});
const step2Data = computed(() => injectedData.step2?.value || {});

const validations = reactive({
  address: false,
  postalCode: false,
});

const showValidationSummary = ref(false);

const addressRef = ref(null);
const postalCodeRef = ref(null);

const fieldLabels = {
  address: 'Dirección de Residencia',
  postalCode: 'Código Postal'
};

const getFieldLabel = (field) => fieldLabels[field] || field;

const invalidFields = computed(() => {
  return Object.keys(validations).filter(field => !validations[field]);
});

// Filtra solo números del código postal
const filterPostalCode = (event) => {
  const value = event.target.value;
  const filteredValue = value.replace(/\D/g, '');
  if (value !== filteredValue) {
    formData.value.postalCode = filteredValue;
    event.target.value = filteredValue;
  }
};

// Previene la entrada de caracteres no numéricos
const preventNonNumeric = (event) => {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
    return false;
  }
  return true;
};

const onValidation = (field, isValid) => {
  validations[field] = isValid;
  emit('isValid', isStepValid.value);
};

const validateAddress = (address) => {
  return formValidation.validateRequired(address) && address.trim().length >= 10;
};

const fullName = computed(() => {
  const firstName = step1Data.value.firstName || '';
  const secondName = step1Data.value.secondName || '';
  return `${firstName} ${secondName}`.trim() || '-';
});

const documentTypeLabel = computed(() => {
  const type = step1Data.value.documentType;
  const labels = {
    'cedula_ciudadania': 'Cédula de Ciudadanía',
    'pasaporte': 'Pasaporte',
    'cedula_extranjeria': 'Cédula de Extranjería',
  };
  return labels[type] || '-';
});

const validateStep = () => {
  showValidationSummary.value = true;
  
  const refs = [
    { ref: addressRef, name: 'address' },
    { ref: postalCodeRef, name: 'postalCode' },
  ];

  refs.forEach(({ ref, name }) => {
    if (ref.value) {
      const isValid = ref.value.validate ? ref.value.validate() : false;
      validations[name] = isValid;
    }
  });

  return isStepValid.value;
};

const validateStepWithFeedback = async () => {
  const isValid = validateStep();
  await nextTick();
  return isValid;
};

const isStepValid = computed(() => {
  const allValid = Object.values(validations).every(v => v === true);
  return allValid;
});

// Observar cambios en validaciones y emitir
watch(
  () => validations,
  () => {
    const isValid = isStepValid.value;
    emit('isValid', isValid);
  },
  { deep: true }
);

onMounted(() => {
  emit('isValid', isStepValid.value);
});

defineExpose({
  validateStep,
  validateStepWithFeedback,
  isValid: isStepValid,
  showValidationSummary,
});
</script>
