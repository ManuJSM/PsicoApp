<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
    <!-- Date Navigation -->
    <label
      @click="$emit('calendar-click')"
      class="flex items-center gap-3 border bg-white dark:bg-card-dark border-slate-300 dark:border-border-dark rounded-lg px-4 py-1.5 cursor-pointer hover:border-primary/50 transition-all group"
      for="date-drawer-toggle"
    >
      <div class="flex flex-col items-start leading-none">
        <span
          class="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-0.5"
          >Periodo Seleccionado</span
        >
        <span
          class="text-sm font-bold text-white group-hover:text-primary transition-colors"
          >{{ periodText }}</span
        >
      </div>
      <span
        class="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors"
        >calendar_month</span
      >
    </label>
    <!-- View Selector -->
    <div
      class="flex items-center bg-slate-200 dark:bg-card-dark p-0.5 rounded-lg border border-slate-300 dark:border-border-dark overflow-hidden"
    >
      <button
        v-for="view in DashboardViews"
        :key="view"
        :class="[
          'px-4 py-2 text-sm font-medium cursor-pointer tracking-wide ',
          activeView === view
            ? 'text-white bg-primary/10 border-b-2 border-primary rounded-md'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
        ]"
        @click="selectView(view)"
      >
        {{ view }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { DashboardViews } from '@/types/dashboardP.types'

  interface DateNavigationProps {
    activeView?: string
    periodText?: string
  }

  interface DateNavigationEmits {
    (e: 'view-change', view: DashboardViews): void
    (e: 'calendar-click'): void
  }

  const props = withDefaults(defineProps<DateNavigationProps>(), {
    activeView: DashboardViews.DIARIA,
    periodText: '18 — 24 NOV, 2024',
  })

  const emit = defineEmits<DateNavigationEmits>()

  const activeView = ref(props.activeView)

  const selectView = (view: DashboardViews) => {
    activeView.value = view
    emit('view-change', view)
  }
</script>
