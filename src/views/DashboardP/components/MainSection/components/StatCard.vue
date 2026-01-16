<template>
  <div
    class="p-4 sm:p-5 rounded-xl flex flex-col justify-center items-center shadow-sm min-h-[96px] sm:min-h-[120px]"
    :class="cardClasses"
  >
    <h4 class="text-sm font-medium" :class="titleClasses">
      {{ title }}
    </h4>
    <p
      class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2"
    >
      {{ value }}
    </p>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { colorStatCard } from '../utils/utils'

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    color: {
      type: String as () => 'yellow' | 'green' | 'blue' | 'red',
      default: 'blue',
    },
  })

  const cardClasses = computed(() => {
    const colorStyle = colorStatCard[props.color]
    return [colorStyle?.bg, 'border-l-4', colorStyle?.border]
  })

  const titleClasses = computed(() => {
    const colorStyle = colorStatCard[props.color]
    return colorStyle?.text
  })
</script>
