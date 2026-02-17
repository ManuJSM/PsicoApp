<script setup lang="ts">
  defineProps({
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    optional: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const updateValue = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
  }
</script>

<template>
  <div>
    <label
      class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
      :for="id"
    >
      {{ label }}
      <span v-if="optional" class="text-gray-400 font-normal">(Opcional)</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="updateValue"
      :required="required"
      :placeholder="placeholder"
      class="block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary text-base min-h-[48px] px-4 placeholder:text-gray-400"
    />
  </div>
</template>
