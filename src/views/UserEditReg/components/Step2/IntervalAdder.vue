<template>
  <div class="bg-card-dark border border-border-dark rounded-xl p-4 shadow-sm">
    <!-- Encabezado compacto -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="flex items-center gap-2 text-base font-semibold">
        <span class="material-symbols-outlined text-primary">add_circle</span>
        <span>Intervalo</span>
      </h3>

      <!-- Indicador de estado actual -->
      <div
        class="flex items-center gap-2 px-3 py-1 bg-background-dark rounded-full"
      >
        <span
          :class="[
            'w-2 h-2 rounded-full',
            modelValue.state === 'asleep'
              ? 'bg-state-asleep'
              : modelValue.state === 'inBed'
                ? 'bg-state-inbed'
                : 'bg-state-awake',
          ]"
        ></span>
        <span class="text-xs font-medium">
          {{
            modelValue.state === 'asleep'
              ? 'Dormido'
              : modelValue.state === 'inBed'
                ? 'En cama'
                : 'Despierto'
          }}
        </span>
      </div>
    </div>

    <div class="space-y-4">
      <!-- Estados - más compactos -->
      <div class="space-y-2">
        <div class="grid grid-cols-3 gap-2">
          <button
            @click="updateState('asleep')"
            :class="[
              'flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all',
              modelValue.state === 'asleep'
                ? 'bg-state-asleep/10 border-state-asleep text-state-asleep'
                : 'bg-background-dark border-border-dark hover:bg-state-asleep/5',
            ]"
          >
            <span class="material-symbols-outlined text-lg">hotel</span>
            <span class="text-xs font-semibold">Dormido</span>
          </button>

          <button
            @click="updateState('inBed')"
            :class="[
              'flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all',
              modelValue.state === 'inBed'
                ? 'bg-state-inbed/10 border-state-inbed text-state-inbed'
                : 'bg-background-dark border-border-dark hover:bg-state-inbed/5',
            ]"
          >
            <span class="material-symbols-outlined text-lg"
              >airline_seat_flat</span
            >
            <span class="text-xs font-semibold">En cama</span>
          </button>

          <button
            @click="updateState('awake')"
            :class="[
              'flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all',
              modelValue.state === 'awake'
                ? 'bg-state-awake/10 border-state-awake text-state-awake'
                : 'bg-background-dark border-border-dark hover:bg-state-awake/5',
            ]"
          >
            <span class="material-symbols-outlined text-lg"
              >accessibility_new</span
            >
            <span class="text-xs font-semibold">Despierto</span>
          </button>
        </div>
      </div>

      <!-- Duración - layout compacto -->
      <div class="space-y-2">
        <label
          class="text-xs font-bold text-slate-500 uppercase tracking-wider"
        >
          Duración
        </label>

        <div class="grid grid-cols-2 gap-3">
          <!-- Horas -->
          <div class="space-y-1">
            <div
              class="flex items-center justify-between bg-background-dark border border-border-dark rounded-lg px-3 py-2"
            >
              <button
                @click="adjustHours(-1)"
                :disabled="isRangeComplete"
                class="w-8 h-8 flex items-center justify-center hover:bg-border-dark rounded transition-colors disabled:opacity-30"
              >
                <span class="material-symbols-outlined text-lg">remove</span>
              </button>

              <div class="text-center">
                <div class="text-2xl font-bold">{{ modelValue.hours }}</div>
                <div class="text-xs text-slate-500 font-medium">Horas</div>
              </div>

              <button
                @click="adjustHours(1)"
                :disabled="isRangeComplete"
                class="w-8 h-8 flex items-center justify-center hover:bg-border-dark rounded transition-colors disabled:opacity-30"
              >
                <span class="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
          </div>

          <!-- Minutos -->
          <div class="space-y-1">
            <div
              class="flex items-center justify-between bg-background-dark border border-border-dark rounded-lg px-3 py-2"
            >
              <button
                @click="adjustMinutes(-5)"
                :disabled="isRangeComplete"
                class="w-8 h-8 flex items-center justify-center hover:bg-border-dark rounded transition-colors disabled:opacity-30"
              >
                <span class="text-sm font-bold">-5</span>
              </button>

              <div class="text-center">
                <div class="text-2xl font-bold">
                  {{ modelValue.minutes.toString().padStart(2, '0') }}
                </div>
                <div class="text-xs text-slate-500 font-medium">Minutos</div>
              </div>

              <button
                @click="adjustMinutes(5)"
                :disabled="isRangeComplete"
                class="w-8 h-8 flex items-center justify-center hover:bg-border-dark rounded transition-colors disabled:opacity-30"
              >
                <span class="text-sm font-bold">+5</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones y feedback -->
      <div class="space-y-3">
        <!-- Tiempo restante / completado -->
        <div
          v-if="remainTime.hours > 0 || remainTime.minutes > 0"
          class="flex items-center justify-between px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg"
        >
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-sm"
              >schedule</span
            >
            <span class="text-xs font-medium text-primary">Restante</span>
          </div>
          <span class="text-sm font-bold">
            {{ remainTime.hours }}h
            {{ remainTime.minutes.toString().padStart(2, '0') }}m
          </span>
        </div>

        <div
          v-else-if="isRangeComplete"
          class="flex items-center justify-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg"
        >
          <span class="material-symbols-outlined text-green-500 text-sm"
            >check_circle</span
          >
          <span class="text-xs font-medium text-green-500">Rango completo</span>
        </div>

        <!-- Botón Añadir -->
        <!-- <button
          @click="$emit('add')"
          :disabled="!canAdd"
          :class="[
            'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all shadow',
            canAdd
              ? 'bg-primary hover:bg-primary/90 text-white cursor-pointer'
              : 'bg-border-dark text-slate-500 cursor-not-allowed',
          ]"
        >
          <span class="material-symbols-outlined">
            {{ isRangeComplete ? 'check' : 'add' }}
          </span>
          <span>Añadir Intervalo</span>
          <span class="ml-auto text-sm font-normal">
            {{ modelValue.hours }}h
            {{ modelValue.minutes.toString().padStart(2, '0') }}m
          </span>
        </button> -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed } from 'vue'

  export interface Interval {
    state: 'asleep' | 'inBed' | 'awake'
    hours: number
    minutes: number
  }

  const props = defineProps<{
    modelValue: Interval
    isRangeComplete: boolean
    remainingTime: number
    totalTimeInBedMinutes: number
    canAdd: boolean
  }>()

  const maxHours = 8

  const emit = defineEmits<{
    (e: 'update:modelValue', value: Interval): void
    (e: 'add'): void
    (e: 'update:hours', value: number): void
    (e: 'update:minutes', value: number): void
  }>()

  const remainTime = computed<{ hours: number; minutes: number }>(() => {
    const hours = Math.floor(props.remainingTime / 60)
    const minutes = props.remainingTime % 60
    return { hours, minutes }
  })

  const updateState = (state: 'asleep' | 'inBed' | 'awake') => {
    emit('update:modelValue', { ...props.modelValue, state })
  }

  // const updateHours = (event: Event) => {
  //   let value = parseInt((event.target as HTMLInputElement).value) || 0
  //   value = Math.max(0, Math.min(maxHours, value))
  //   emit('update:modelValue', { ...props.modelValue, hours: value })
  // }

  // const updateMinutes = (event: Event) => {
  //   let value = parseInt((event.target as HTMLInputElement).value) || 0
  //   value = Math.max(0, Math.min(maxMinutes, value))
  //   emit('update:modelValue', { ...props.modelValue, minutes: value })
  // }

  const adjustHours = (delta: number) => {
    let newHours = props.modelValue.hours + delta
    newHours = Math.max(0, Math.min(maxHours, newHours))
    emit('update:modelValue', { ...props.modelValue, hours: newHours })
  }

  const adjustMinutes = (delta: number) => {
    let newMinutes = props.modelValue.minutes + delta
    let newHours = props.modelValue.hours
    if (newMinutes < 0 && newHours > 0) {
      newHours--
      newMinutes = 55 // Wrap around to 55 if below 0
    } else if (newMinutes >= 60) {
      newHours++
      newMinutes = 0 // Wrap around to 0 if 60 or more
    }
    newHours = Math.max(0, Math.min(maxHours, newHours))
    newMinutes = Math.max(0, newMinutes)

    emit('update:modelValue', {
      ...props.modelValue,
      hours: newHours,
      minutes: newMinutes,
    })
  }
</script>
<style scoped>
  /* Chrome, Edge, Safari */
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none; /* estándar */
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    appearance: none; /* estándar */
    -moz-appearance: textfield;
  }
</style>
