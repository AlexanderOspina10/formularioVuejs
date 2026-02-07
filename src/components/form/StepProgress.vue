<template>
  <div class="w-full py-8">
    <div class="flex items-center justify-between max-w-2xl mx-auto">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="flex items-center"
        :class="{ 'flex-1': index < steps.length - 1 }"
      >
        <!-- Círculo del paso -->
        <div class="flex flex-col items-center relative">
          <div
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300',
              currentStep === index + 1
                ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                : currentStep > index + 1
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
            ]"
          >
            <span v-if="currentStep <= index + 1">{{ index + 1 }}</span>
            <svg
              v-else
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <!-- Texto del paso -->
          <div class="absolute top-14 text-center w-32">
            <p
              :class="[
                'text-sm font-medium transition-colors',
                currentStep === index + 1
                  ? 'text-primary-600'
                  : currentStep > index + 1
                  ? 'text-green-600'
                  : 'text-gray-500'
              ]"
            >
              {{ step }}
            </p>
          </div>
        </div>
        
        <!-- Línea conectora -->
        <div
          v-if="index < steps.length - 1"
          class="flex-1 h-1 mx-4 transition-all duration-300"
          :class="[
            currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
          ]"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  steps: {
    type: Array,
    required: true,
  },
  currentStep: {
    type: Number,
    required: true,
  },
});
</script>