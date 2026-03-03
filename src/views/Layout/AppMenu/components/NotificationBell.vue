<script setup lang="ts">
  defineProps<{
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
    class="relative flex items-center text-primary dark:text-primary cursor-pointer justify-center size-10 rounded-full"
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
