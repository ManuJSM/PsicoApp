<script setup lang="ts">
defineProps<{ searchQuery: string; placeholder: string }>()
defineEmits<{ (e: 'update:searchQuery', value: string): void }>()
</script>
<template>
  <div>
    <label class="flex flex-col min-w-40 h-12 w-full">
      <div
        class="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-200 dark:bg-slate-800 focus-within:ring-1 focus-within:ring-primary focus-within:ring-offset-0"
      >
        <div
          class="text-slate-400 dark:text-slate-500 flex items-center justify-center pl-4 rounded-l-lg"
        >
          <span class="material-symbols-outlined">search</span>
        </div>

        <input
          type="text"
          :placeholder="placeholder"
          :value="searchQuery"
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          class="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-none rounded-r-lg border-none bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 text-base font-normal leading-normal focus:outline-none"
        />
      </div>
    </label>
  </div>
</template>
