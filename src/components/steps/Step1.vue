<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Información Personal</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      <!-- País -->
      <div class="md:col-span-2">
        <SelectField
          ref="countryRef"
          id="country"
          label="País"
          v-model="formData.country"
          :options="countryOptions"
          placeholder="Seleccione su país"
          :required="true"
          error-message="Por favor seleccione un país"
          @validation="onValidation('country', $event)"
        />
      </div>

      <!-- Género -->
      <SelectField
        ref="genderRef"
        id="gender"
        label="Género"
        v-model="formData.gender"
        :options="genderOptions"
        placeholder="Seleccione su género"
        :required="true"
        error-message="Por favor seleccione un género"
        @validation="onValidation('gender', $event)"
      />

      <!-- Primer Nombre -->
      <InputField
        ref="firstNameRef"
        id="firstName"
        label="Primer Nombre"
        v-model="formData.firstName"
        placeholder="Ingrese su primer nombre"
        :required="true"
        :validator="(value) => formValidation.validateRequired(value) && value.trim().length >= 2"
        error-message="El nombre debe tener al menos 2 caracteres"
        @validation="onValidation('firstName', $event)"
      />

      <!-- Segundo Nombre -->
      <InputField
        ref="secondNameRef"
        id="secondName"
        label="Segundo Nombre"
        v-model="formData.secondName"
        placeholder="Ingrese su segundo nombre"
        :required="true"
        :validator="(value) => formValidation.validateRequired(value) && value.trim().length >= 2"
        error-message="El segundo nombre debe tener al menos 2 caracteres"
        @validation="onValidation('secondName', $event)"
      />

      <!-- Fecha de Nacimiento -->
      <DateField
        ref="birthDateRef"
        id="birthDate"
        label="Fecha de Nacimiento"
        v-model="formData.birthDate"
        :required="true"
        :validate-age="true"
        :min-age="18"
        error-message="Debe ser mayor de 18 años"
        @validation="onValidation('birthDate', $event)"
      />

      <!-- Tipo de Documento -->
      <SelectField
        ref="documentTypeRef"
        id="documentType"
        label="Tipo de Documento"
        v-model="formData.documentType"
        :options="documentTypeOptions"
        placeholder="Seleccione el tipo de documento"
        :required="true"
        error-message="Por favor seleccione un tipo de documento"
        @validation="onValidation('documentType', $event)"
      />

      <!-- Número de Documento -->
      <InputField
        ref="documentNumberRef"
        id="documentNumber"
        label="Número de Documento"
        v-model="formData.documentNumber"
        type="text"
        placeholder="Ingrese el número de documento"
        :required="true"
        :validator="formValidation.validateDocumentNumber"
        error-message="Debe contener al menos 5 dígitos numéricos"
        @input="filterDocumentNumber"
        @keypress="preventNonNumeric"
        @validation="onValidation('documentNumber', $event)"
      />
    </div>

    <!-- Foto Documento Frente -->
    <div class="mt-4">
      <FileField
        ref="documentFrontRef"
        id="documentFront"
        label="Foto Documento - Frente"
        v-model="formData.documentFront"
        :required="true"
        error-message="Por favor cargue la foto del frente del documento (JPG)"
        @validation="onValidation('documentFront', $event)"
      />
    </div>

    <!-- Foto Documento Reverso -->
    <div class="mt-4">
      <FileField
        ref="documentBackRef"
        id="documentBack"
        label="Foto Documento - Reverso"
        v-model="formData.documentBack"
        :required="true"
        error-message="Por favor cargue la foto del reverso del documento (JPG)"
        @validation="onValidation('documentBack', $event)"
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch, nextTick } from 'vue';
import InputField from '@/components/ui/InputField.vue';
import SelectField from '@/components/ui/SelectField.vue';
import DateField from '@/components/ui/DateField.vue';
import FileField from '@/components/ui/FileField.vue';
import { fetchCountries } from '@/services/countryService';
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

const validations = reactive({
  country: false,
  gender: false,
  firstName: false,
  secondName: false,
  birthDate: false,
  documentType: false,
  documentNumber: false,
  documentFront: false,
  documentBack: false,
});

const showValidationSummary = ref(false);

const countryOptions = ref([]);

const genderOptions = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'otro', label: 'Otro' },
  { value: 'prefiero_no_decir', label: 'Prefiero no decir' },
];

const documentTypeOptions = [
  { value: 'cedula_ciudadania', label: 'Cédula de Ciudadanía' },
  { value: 'pasaporte', label: 'Pasaporte' },
  { value: 'cedula_extranjeria', label: 'Cédula de Extranjería' },
];

const countryRef = ref(null);
const genderRef = ref(null);
const firstNameRef = ref(null);
const secondNameRef = ref(null);
const birthDateRef = ref(null);
const documentTypeRef = ref(null);
const documentNumberRef = ref(null);
const documentFrontRef = ref(null);
const documentBackRef = ref(null);

const fieldLabels = {
  country: 'País',
  gender: 'Género',
  firstName: 'Primer Nombre',
  secondName: 'Segundo Nombre',
  birthDate: 'Fecha de Nacimiento',
  documentType: 'Tipo de Documento',
  documentNumber: 'Número de Documento',
  documentFront: 'Foto Documento - Frente',
  documentBack: 'Foto Documento - Reverso'
};

const getFieldLabel = (field) => fieldLabels[field] || field;

const invalidFields = computed(() => {
  return Object.keys(validations).filter(field => !validations[field]);
});

// Filtra solo números del documento
const filterDocumentNumber = (event) => {
  const value = event.target.value;
  const filteredValue = value.replace(/\D/g, '');
  if (value !== filteredValue) {
    formData.value.documentNumber = filteredValue;
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

const validateStep = () => {
  showValidationSummary.value = true;
  
  const refs = [
    { ref: countryRef, name: 'country' },
    { ref: genderRef, name: 'gender' },
    { ref: firstNameRef, name: 'firstName' },
    { ref: secondNameRef, name: 'secondName' },
    { ref: birthDateRef, name: 'birthDate' },
    { ref: documentTypeRef, name: 'documentType' },
    { ref: documentNumberRef, name: 'documentNumber' },
    { ref: documentFrontRef, name: 'documentFront' },
    { ref: documentBackRef, name: 'documentBack' },
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

onMounted(async () => {
  const countries = await fetchCountries();
  countryOptions.value = countries.map(c => ({
    value: c.code,
    label: c.name, 
  }));
  
  emit('isValid', isStepValid.value);
});

defineExpose({
  validateStep,
  validateStepWithFeedback,
  isValid: isStepValid,
  showValidationSummary,
});
</script>