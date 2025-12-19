<script setup lang="ts">
defineProps<{
  isActive: boolean
  hasUnread: boolean
}>()

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <button
    @click="handleClick"
    :class="[
      'relative flex items-center justify-center size-10 rounded-full transition-all duration-100 ease-in-out',
      isActive
        ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary ring-1 ring-primary/20'
        : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300',
      hasUnread
        ? 'text-primary dark:text-primary'
        : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300',
    ]"
  >
    <span class="material-symbols-outlined">notifications</span>
    <span v-show="hasUnread" class="absolute top-2.5 right-2.5 flex h-2 w-2">
      <span
        class="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"
      ></span>
      <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
    </span>
  </button>
</template>
