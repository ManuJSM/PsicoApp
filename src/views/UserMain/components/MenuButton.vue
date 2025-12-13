<template>
  <button
    class="cursor-pointer flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl active:bg-gray-100 dark:active:bg-gray-800 transition-all active:scale-[0.98] border border-gray-100 dark:border-white/5 w-full"
    :class="hoverColor"
  >
    <div
      class="flex items-center justify-center rounded-lg size-10 shrink-0"
      :class="iconBackground"
    >
      <span class="material-symbols-outlined">{{ icon }}</span>
    </div>
    <div class="flex flex-1 flex-col items-start text-left">
      <span class="text-gray-900 dark:text-white font-semibold text-sm">
        {{ title }}
      </span>
      <span v-if="description" class="text-gray-500 dark:text-gray-400 text-xs">
        {{ description }}
      </span>
    </div>
    <span v-if="showChevron" class="material-symbols-outlined text-gray-400">chevron_right</span>
  </button>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    required: true,
  },
  iconBackground: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  hoverColor: {
    type: String,
    required: true,
  },
  showChevron: {
    type: Boolean,
    default: true,
  },
})
</script>
