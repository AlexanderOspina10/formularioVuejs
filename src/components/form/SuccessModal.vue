<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="close"
    >
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <!-- Overlay -->
        <Transition
          enter-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="show"
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          ></div>
        </Transition>

        <!-- Modal -->
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-if="show"
            class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          >
            <div>
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg
                  class="h-10 w-10 text-green-600"
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
              </div>
              <div class="mt-3 text-center sm:mt-5">
                <h3 class="text-2xl leading-6 font-bold text-gray-900">
                  {{ title }}
                </h3>
                <div class="mt-2">
                  <p class="text-base text-gray-500">
                    {{ message }}
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6">
              <button
                @click="close"
                type="button"
                class="inline-flex justify-center w-full rounded-lg border border-transparent shadow-sm px-4 py-3 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors sm:text-sm"
              >
                {{ buttonText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '¡Éxito!',
  },
  message: {
    type: String,
    default: 'La operación se completó correctamente',
  },
  buttonText: {
    type: String,
    default: 'Cerrar',
  },
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>