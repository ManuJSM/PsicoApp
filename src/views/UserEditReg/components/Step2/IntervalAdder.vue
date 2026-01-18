<template>
  <div class="bg-card-dark border border-border-dark rounded-xl p-4 shadow-sm">
    <h3 class="hidden lg:flex text-lg font-bold mb-6 items-center gap-2">
      <span class="material-symbols-outlined text-primary">add_circle</span>
      Añadir Intervalo
    </h3>
    <div class="space-y-2">
      <!-- Estado del intervalo -->
      <div class="space-y-3">
        <label
          class="hidden lg:flex text-xs font-bold text-slate-500 uppercase tracking-wider"
        >
          Estado del intervalo
        </label>
        <div
          class="grid grid-cols-4 gap-2 p-1 bg-background-dark rounded-lg border border-border-dark"
        >
          <button
            @click="updateState('asleep')"
            :class="[
              'flex flex-col items-center justify-center py-3 px-2 rounded-md transition-all',
              modelValue.state === 'asleep'
                ? 'bg-card-dark border border-state-asleep text-state-asleep shadow-sm'
                : 'hover:bg-card-dark border border-transparent hover:border-border-dark opacity-60 hover:opacity-100',
            ]"
          >
            <span class="material-symbols-outlined text-sm mb-1"> hotel </span>
            <span class="text-[10px] font-bold uppercase">Dormido</span>
          </button>
          <button
            @click="updateState('inBed')"
            :class="[
              'flex flex-col items-center justify-center py-3 px-2 rounded-md transition-all',
              modelValue.state === 'inBed'
                ? 'bg-card-dark border border-state-inbed text-state-inbed shadow-sm'
                : 'hover:bg-card-dark border border-transparent hover:border-border-dark opacity-60 hover:opacity-100',
            ]"
          >
            <span class="material-symbols-outlined text-xl mb-1">
              airline_seat_flat
            </span>
            <span class="text-[10px] font-bold uppercase">En Cama</span>
          </button>
          <button
            @click="updateState('awake')"
            :class="[
              'flex flex-col items-center justify-center py-3 px-2 rounded-md transition-all',
              modelValue.state === 'awake'
                ? 'bg-card-dark border border-state-awake text-state-awake shadow-sm'
                : 'hover:bg-card-dark border border-transparent hover:border-border-dark opacity-60 hover:opacity-100',
            ]"
          >
            <span class="material-symbols-outlined text-xl mb-1">
              accessibility_new
            </span>
            <span class="text-[10px] font-bold uppercase">Levantado</span>
          </button>
          <!-- Botón Añadir -->
          <button
            @click="$emit('add')"
            :disabled="!canAdd"
            :class="[
              'w-full font-bold py-4 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2',
              canAdd
                ? 'bg-primary hover:brightness-110 text-white cursor-pointer'
                : 'bg-border-dark text-slate-500 cursor-not-allowed',
            ]"
          >
            <span class="material-symbols-outlined">{{
              isRangeComplete ? 'done' : 'add'
            }}</span>
          </button>
        </div>
      </div>

      <!-- Duración del intervalo -->
      <div class="space-y-2">
        <label
          class="hidden lg:flex text-xs font-bold text-slate-500 uppercase tracking-wider"
        >
          Duración del intervalo
        </label>
        <div class="grid grid-cols-4 gap-1">
          <!-- Horas -->
          <div class="">
            <div class="relative">
              <input
                :value="modelValue.hours"
                @input="updateHours($event)"
                :disabled="isRangeComplete"
                class="w-full bg-background-dark border border-border-dark rounded-lg py-3 px-4 text-center font-bold text-xl focus:ring-primary focus:border-primary appearance-none transition-all disabled:opacity-50"
                :class="isRangeComplete ? 'text-slate-500' : 'text-white'"
                type="number"
                min="0"
                :max="remainTime.hours"
              />
              <div
                class="absolute inset-y-0 right-3 flex items-center pointer-events-none"
              >
                <span class="text-xs font-bold text-slate-500">H</span>
              </div>
            </div>
          </div>
          <div class="flex gap-1">
            <button
              @click="adjustHours(-1)"
              :disabled="isRangeComplete"
              class="flex-1 bg-border-dark hover:bg-slate-700 py-1 rounded text-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>
            <button
              @click="adjustHours(1)"
              :disabled="isRangeComplete"
              class="flex-1 bg-border-dark hover:bg-slate-700 py-1 rounded text-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
          <!-- Minutos -->
          <div class="">
            <div class="relative">
              <input
                :value="modelValue.minutes"
                @input="updateMinutes($event)"
                :disabled="isRangeComplete"
                class="w-full bg-background-dark border border-border-dark rounded-lg py-3 px-4 text-center font-bold text-xl focus:ring-primary focus:border-primary transition-all disabled:opacity-50"
                :class="isRangeComplete ? 'text-slate-500' : 'text-white'"
                type="number"
                min="0"
                max="59"
                step="5"
              />
              <div
                class="absolute inset-y-0 right-3 flex items-center pointer-events-none"
              >
                <span class="text-xs font-bold text-slate-500">M</span>
              </div>
            </div>
          </div>
          <div class="flex gap-1">
            <button
              @click="adjustMinutes(-5)"
              :disabled="isRangeComplete"
              class="flex-1 bg-border-dark hover:bg-slate-700 py-1 rounded text-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -5
            </button>
            <button
              @click="adjustMinutes(5)"
              :disabled="isRangeComplete"
              class="flex-1 bg-border-dark hover:bg-slate-700 py-1 rounded text-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +5
            </button>
          </div>
        </div>
      </div>

      <!-- Indicador de tiempo restante -->
      <div
        v-if="remainTime.hours > 0 || remainTime.minutes > 0"
        class="p-3 bg-primary/5 border border-primary/20 rounded-lg"
      >
        <p class="text-xs text-primary font-bold text-center">
          ⏱️ Tiempo restante para completar:
          <span class="text-white">{{
            `${remainTime.hours}h ${remainTime.minutes.toString().padStart(2, '0')}m`
          }}</span>
        </p>
      </div>
      <div
        v-else-if="isRangeComplete"
        class="p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
      >
        <p class="text-xs text-green-500 font-bold text-center">
          ✅ Rango completo alcanzado
        </p>
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

  const updateHours = (event: Event) => {
    let value = parseInt((event.target as HTMLInputElement).value) || 0
    value = Math.max(0, Math.min(12, value))
    emit('update:modelValue', { ...props.modelValue, hours: value })
  }

  const updateMinutes = (event: Event) => {
    let value = parseInt((event.target as HTMLInputElement).value) || 0
    value = Math.max(0, Math.min(59, value))
    emit('update:modelValue', { ...props.modelValue, minutes: value })
  }

  const adjustHours = (delta: number) => {
    let newHours = props.modelValue.hours + delta
    newHours = Math.max(0, Math.min(12, newHours))
    emit('update:modelValue', { ...props.modelValue, hours: newHours })
  }

  const adjustMinutes = (delta: number) => {
    let newMinutes = props.modelValue.minutes + delta
    if (newMinutes < 0) {
      newMinutes = 55 // Wrap around to 55 if below 0
    } else if (newMinutes >= 60) {
      newMinutes = 0 // Wrap around to 0 if 60 or more
    }
    emit('update:modelValue', { ...props.modelValue, minutes: newMinutes })
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
