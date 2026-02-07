<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Correo Electrónico -->
      <div class="md:col-span-2">
        <InputField
          ref="emailRef"
          id="email"
          label="Correo Electrónico"
          v-model="formData.email"
          type="email"
          placeholder="ejemplo@correo.com"
          :required="true"
          :validator="validateEmail"
          error-message="Ingrese un correo electrónico válido"
          @validation="onValidation('email', $event)"
        />
      </div>

      <!-- Contraseña -->
      <div class="relative">
        <InputField
          ref="passwordRef"
          id="password"
          label="Contraseña"
          v-model="formData.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Ingrese su contraseña"
          :required="true"
          :validator="validatePassword"
          error-message="La contraseña debe tener al menos 6 caracteres"
          @validation="onValidation('password', $event)"
          :class="[showPassword || showConfirmPassword ? 'pr-12' : '']"
        />
        <button
          type="button"
          @click="togglePasswordVisibility"
          class="absolute right-3 top-8 p-1.5 text-gray-500 hover:text-gray-700 focus:outline-none z-10 bg-white rounded"
          :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        >
          <svg
            v-if="showPassword"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
      </div>

      <!-- Confirmación de Contraseña -->
      <div class="relative">
        <InputField
          ref="confirmPasswordRef"
          id="confirmPassword"
          label="Confirmar Contraseña"
          v-model="formData.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Confirme su contraseña"
          :required="true"
          :validator="validatePasswordMatch"
          error-message="Las contraseñas no coinciden"
          @validation="onValidation('confirmPassword', $event)"
          :class="[showPassword || showConfirmPassword ? 'pr-12' : '']"
        />
        <button
          type="button"
          @click="toggleConfirmPasswordVisibility"
          class="absolute right-3 top-8 p-1.5 text-gray-500 hover:text-gray-700 focus:outline-none z-10 bg-white rounded"
          :aria-label="showConfirmPassword ? 'Ocultar confirmación de contraseña' : 'Mostrar confirmación de contraseña'"
        >
          <svg
            v-if="showConfirmPassword"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
      </div>

      <!-- Número de Teléfono -->
      <InputField
        ref="phoneRef"
        id="phone"
        label="Número de Teléfono"
        v-model="formData.phone"
        type="text"
        placeholder="Ej: 3001234567"
        :required="true"
        :validator="validatePhone"
        error-message="Ingrese un número de teléfono válido (mínimo 7 dígitos)"
        @input="filterPhoneNumber($event, 'phone')"
        @keypress="preventNonNumeric"
        @validation="onValidation('phone', $event)"
      />

      <!-- Número de Celular -->
      <InputField
        ref="mobileRef"
        id="mobile"
        label="Número de Celular"
        v-model="formData.mobile"
        type="text"
        placeholder="Ej: 3201234567"
        :required="true"
        :validator="validatePhone"
        error-message="Ingrese un número de celular válido (mínimo 7 dígitos)"
        @input="filterPhoneNumber($event, 'mobile')"
        @keypress="preventNonNumeric"
        @validation="onValidation('mobile', $event)"
      />
    </div>

    <!-- Indicador de fortaleza de contraseña -->
    <div v-if="formData.password" class="mt-4 p-4 bg-gray-50 rounded-lg">
      <p class="text-sm font-medium text-gray-700 mb-2">Fortaleza de la contraseña:</p>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          :class="[
            'h-2 rounded-full transition-all duration-300',
            passwordStrength.color
          ]"
          :style="{ width: passwordStrength.width }"
        ></div>
      </div>
      <p class="text-xs text-gray-600 mt-1">{{ passwordStrength.label }}</p>
      
      <!-- Indicadores de requisitos de contraseña -->
      <div class="mt-3 space-y-1">
        <div class="flex items-center text-xs">
          <svg
            :class="[
              'w-4 h-4 mr-2',
              formData.password?.length >= 6 ? 'text-green-500' : 'text-gray-400'
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="formData.password?.length >= 6 ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'"
            />
          </svg>
          <span :class="formData.password?.length >= 6 ? 'text-green-600' : 'text-gray-500'">
            Al menos 6 caracteres
          </span>
        </div>
        <div class="flex items-center text-xs">
          <svg
            :class="[
              'w-4 h-4 mr-2',
              /[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="/[A-Z]/.test(formData.password) ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'"
            />
          </svg>
          <span :class="/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'">
            Al menos una mayúscula
          </span>
        </div>
        <div class="flex items-center text-xs">
          <svg
            :class="[
              'w-4 h-4 mr-2',
              /[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="/[0-9]/.test(formData.password) ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'"
            />
          </svg>
          <span :class="/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'">
            Al menos un número
          </span>
        </div>
      </div>
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
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue';
import InputField from '@/components/ui/InputField.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'isValid']);

const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const validations = reactive({
  email: false,
  password: false,
  confirmPassword: false,
  phone: false,
  mobile: false,
});

const showValidationSummary = ref(false);

// Estados para mostrar/ocultar contraseñas
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const emailRef = ref(null);
const passwordRef = ref(null);
const confirmPasswordRef = ref(null);
const phoneRef = ref(null);
const mobileRef = ref(null);

const fieldLabels = {
  email: 'Correo Electrónico',
  password: 'Contraseña',
  confirmPassword: 'Confirmación de Contraseña',
  phone: 'Número de Teléfono',
  mobile: 'Número de Celular'
};

const getFieldLabel = (field) => fieldLabels[field] || field;

const invalidFields = computed(() => {
  return Object.keys(validations).filter(field => !validations[field]);
});

// Toggle para mostrar/ocultar contraseña
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Toggle para mostrar/ocultar confirmación de contraseña
const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// Filtra solo números de teléfono
const filterPhoneNumber = (event, field) => {
  const value = event.target.value;
  const filteredValue = value.replace(/\D/g, '');
  if (value !== filteredValue) {
    formData.value[field] = filteredValue;
    event.target.value = filteredValue;
  }
};

// Previene la entrada de caracteres no numéricos
const preventNonNumeric = (event) => {
  const charCode = event.which ? event.which : event.keyCode;
  // Permitir solo números (0-9)
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

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validatePasswordMatch = (confirmPassword) => {
  return confirmPassword === formData.value.password && confirmPassword.length > 0;
};

const validatePhone = (phone) => {
  const phoneRegex = /^\d{7,}$/;
  return phoneRegex.test(phone);
};

const passwordStrength = computed(() => {
  const password = formData.value.password;
  if (!password) return { width: '0%', color: '', label: '' };

  let strength = 0;
  if (password.length >= 6) strength++;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 2) {
    return { width: '33%', color: 'bg-red-500', label: 'Débil' };
  } else if (strength <= 3) {
    return { width: '66%', color: 'bg-yellow-500', label: 'Media' };
  } else {
    return { width: '100%', color: 'bg-green-500', label: 'Fuerte' };
  }
});

const validateStep = () => {
  showValidationSummary.value = true;
  
  const refs = [
    { ref: emailRef, name: 'email' },
    { ref: passwordRef, name: 'password' },
    { ref: confirmPasswordRef, name: 'confirmPassword' },
    { ref: phoneRef, name: 'phone' },
    { ref: mobileRef, name: 'mobile' },
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

// Re-validar confirmación de contraseña cuando cambie la contraseña
watch(
  () => formData.value.password,
  () => {
    if (formData.value.confirmPassword) {
      confirmPasswordRef.value?.validate();
    }
  }
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