
<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Formulario de Registro</h1>
        <p class="text-lg text-gray-600">Complete todos los pasos para finalizar su registro</p>
      </div>

      <!-- Progress Stepper -->
      <StepProgress :steps="steps" :current-step="currentStep" />

      <!-- Formulario -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mt-8">
        <form @submit.prevent="handleSubmit">
          <!-- Paso 1 -->
          <div v-show="currentStep === 1">
            <Step1
              ref="step1Ref"
              v-model="formDataStep1"
              @isValid="step1Valid = $event"
              :key="step1Key"
            />
          </div>

          <!-- Paso 2 -->
          <div v-show="currentStep === 2">
            <Step2
              ref="step2Ref"
              v-model="formDataStep2"
              @isValid="step2Valid = $event"
              :key="step2Key"
            />
          </div>

          <!-- Paso 3 -->
          <div v-show="currentStep === 3">
            <Step3
              ref="step3Ref"
              v-model="formDataStep3"
              @isValid="step3Valid = $event"
              :step1-data="formDataStep1"
              :step2-data="formDataStep2"
              :key="step3Key"
            />
          </div>

          <!-- Botones de navegación -->
          <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              v-if="currentStep > 1"
              @click="previousStep"
              type="button"
              class="btn-secondary"
            >
              <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>
            
            <div v-else></div>

            <button
              v-if="currentStep < 3"
              @click="nextStep"
              type="button"
              class="btn-primary"
              :disabled="isNavigating"
            >
              <span v-if="isNavigating" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Validando...
              </span>
              <span v-else class="flex items-center">
                Siguiente
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>

            <button
              v-else
              type="submit"
              class="btn-success"
              :disabled="!canSubmit || isSubmitting"
            >
              <span v-if="isSubmitting" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </span>
              <span v-else class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Enviar Registro
              </span>
            </button>
          </div>
          
          <!-- Mensaje de error de navegación -->
          <div v-if="navigationError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ navigationError }}
            </p>
          </div>
        </form>
      </div>

      <!-- Indicador de paso actual -->
      <div class="text-center mt-6">
        <p class="text-sm text-gray-600">
          Paso {{ currentStep }} de {{ steps.length }}
        </p>
      </div>
    </div>

    <!-- Modal de Éxito -->
    <SuccessModal
      :show="showSuccessModal"
      title="¡Registro Exitoso!"
      message="Su formulario ha sido enviado correctamente. Revise la consola del navegador para ver los datos enviados."
      button-text="Cerrar"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, provide, nextTick } from 'vue';
import StepProgress from '@/components/form/StepProgress.vue';
import Step1 from '@/components/steps/Step1.vue'
import Step2 from '@/components/steps/Step2.vue'
import Step3 from '@/components/steps/Step3.vue'
import SuccessModal from '@/components/form/SuccessModal.vue';

const steps = ['Información Personal', 'Información de Contacto', 'Información de Residencia'];
const currentStep = ref(1);
const isNavigating = ref(false);
const isSubmitting = ref(false);
const navigationError = ref('');

// Keys para forzar recreación de componentes
const step1Key = ref(0);
const step2Key = ref(0);
const step3Key = ref(0);

// Datos del formulario
const formDataStep1 = ref({
  country: '',
  gender: '',
  firstName: '',
  secondName: '',
  birthDate: '',
  documentType: '',
  documentNumber: '',
  documentFront: null,
  documentBack: null,
});

const formDataStep2 = ref({
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  mobile: '',
});

const formDataStep3 = ref({
  address: '',
  postalCode: '',
});

// Proveer datos completos para el resumen
provide('allFormData', {
  step1: formDataStep1,
  step2: formDataStep2,
  step3: formDataStep3,
});

// Referencias a los componentes de cada paso
const step1Ref = ref(null);
const step2Ref = ref(null);
const step3Ref = ref(null);

// Estados de validación
const step1Valid = ref(false);
const step2Valid = ref(false);
const step3Valid = ref(false);

const showSuccessModal = ref(false);

const canSubmit = computed(() => {
  return step1Valid.value && step2Valid.value && step3Valid.value;
});

const nextStep = async () => {
  isNavigating.value = true;
  navigationError.value = '';
  
  try {
    // Validar paso actual
    let isValid = false;
    let validationMessage = '';
    
    if (currentStep.value === 1) {
      // Forzar validación del paso 1
      if (step1Ref.value) {
        isValid = await step1Ref.value.validateStepWithFeedback();
        if (!isValid) {
          validationMessage = 'Por favor complete todos los campos requeridos del Paso 1 correctamente.';
        }
      }
    } else if (currentStep.value === 2) {
      // Forzar validación del paso 2
      if (step2Ref.value) {
        isValid = await step2Ref.value.validateStepWithFeedback();
        if (!isValid) {
          validationMessage = 'Por favor complete todos los campos requeridos del Paso 2 correctamente.';
        }
      }
    }
    
    
    if (isValid) {
      // Avanzar al siguiente paso
      currentStep.value++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigationError.value = validationMessage || 'No se puede avanzar. Verifique los campos marcados en rojo.';
      
      // Enfocar el primer campo con error después de un breve delay
      setTimeout(() => {
        const errorField = document.querySelector('.error, .border-red-500, input.error, select.error');
        if (errorField) {
          errorField.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
          });
          if (errorField.tagName === 'INPUT' || errorField.tagName === 'SELECT') {
            errorField.focus();
          }
        }
      }, 100);
    }
  } catch (error) {
    console.error('Error en validación:', error);
    navigationError.value = 'Ocurrió un error durante la validación. Intente nuevamente.';
  } finally {
    isNavigating.value = false;
  }
};

const previousStep = () => {
  navigationError.value = '';
  if (currentStep.value > 1) {
    currentStep.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  
  try {
    // Validar paso 3
    if (step3Ref.value) {
      const isValid = await step3Ref.value.validateStepWithFeedback();
      
      if (!isValid) {
        navigationError.value = 'Por favor complete los campos de residencia correctamente.';
        
        setTimeout(() => {
          const errorField = document.querySelector('.error, .border-red-500');
          if (errorField) {
            errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorField.focus();
          }
        }, 100);
        return;
      }
    }
    
    if (!canSubmit.value) {
      navigationError.value = 'Por favor complete todos los pasos del formulario correctamente.';
      return;
    }

    // Acceder con .value
    const completeFormData = {
      ...formDataStep1.value,
      ...formDataStep2.value,
      ...formDataStep3.value,
    };

    console.log('='.repeat(80));
    console.log('FORMULARIO DE REGISTRO ENVIADO');
    console.log('='.repeat(80));
    console.log('\n--- INFORMACIÓN PERSONAL ---');
    console.log('País:', completeFormData.country);
    console.log('Género:', completeFormData.gender);
    console.log('Primer Nombre:', completeFormData.firstName);
    console.log('Segundo Nombre:', completeFormData.secondName);
    console.log('Fecha de Nacimiento:', completeFormData.birthDate);
    console.log('Tipo de Documento:', completeFormData.documentType);
    console.log('Número de Documento:', completeFormData.documentNumber);
    console.log('Foto Documento Frente:', completeFormData.documentFront?.name || 'No cargado');
    console.log('Foto Documento Reverso:', completeFormData.documentBack?.name || 'No cargado');

    console.log('\n--- INFORMACIÓN DE CONTACTO ---');
    console.log('Correo Electrónico:', completeFormData.email);
    console.log('Contraseña:', '****** (oculta por seguridad)');
    console.log('Número de Teléfono:', completeFormData.phone);
    console.log('Número de Celular:', completeFormData.mobile);

    console.log('\n--- INFORMACIÓN DE RESIDENCIA ---');
    console.log('Dirección de Residencia:', completeFormData.address);
    console.log('Código Postal:', completeFormData.postalCode);

    showSuccessModal.value = true;
    
    // Limpiar el formulario después de enviar
    resetForm();
  } finally {
    isSubmitting.value = false;
  }
};

const closeModal = () => {
  showSuccessModal.value = false;
};

const resetForm = () => {
  // Restablecer el formulario completamente
  currentStep.value = 1;
  
  formDataStep1.value = {
    country: '',
    gender: '',
    firstName: '',
    secondName: '',
    birthDate: '',
    documentType: '',
    documentNumber: '',
    documentFront: null,
    documentBack: null,
  };
  
  formDataStep2.value = {
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    mobile: '',
  };
  
  formDataStep3.value = {
    address: '',
    postalCode: '',
  };
  
  step1Valid.value = false;
  step2Valid.value = false;
  step3Valid.value = false;
  
  navigationError.value = '';
  
  step1Key.value++;
  step2Key.value++;
  step3Key.value++;
};
</script>
