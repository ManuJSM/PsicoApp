<template>
  <section
    v-if="!dayReg"
    class="flex flex-col items-center p-8 justify-center text-center min-h-[400px]"
  >
    <div class="mb-8">
      <div
        class="size-32 md:size-40 rounded-full bg-card-dark border-2 border-border-dark flex items-center justify-center mb-6 shadow-xl shadow-black/20"
      >
        <span class="material-symbols-outlined text-5xl text-slate-500/50">
          nights_stay
        </span>
      </div>
    </div>

    <h2 class="text-2xl md:text-3xl font-bold text-white/90 mb-4">
      Sin registro para esta fecha
    </h2>

    <p class="text-slate-400 max-w-md">
      No se encontró un registro de sueño para el día seleccionado.
      <span v-if="showDateText" class="block mt-2 text-primary font-medium">
        {{ formatDisplayDate(props.date) }}
      </span>
    </p>
  </section>

  <section v-else class="flex flex-col gap-4">
    <div
      class="technical-card bg-card-dark border border-border-dark rounded-xl overflow-hidden shadow-lg"
    >
      <div class="px-4 md:px-6 py-4 border-b border-border-dark bg-black/20">
        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-3"
        >
          <h3
            class="text-xs font-bold text-slate-400 uppercase tracking-widest"
          >
            Cronología de la Noche
          </h3>
          <div class="flex items-center gap-4">
            <div
              class="flex items-center gap-1.5 text-[11px] font-bold text-slate-400"
            >
              <span class="size-2 rounded-full bg-state-asleep"></span> Sueño
            </div>
            <div
              class="flex items-center gap-1.5 text-[11px] font-bold text-slate-400"
            >
              <span class="size-2 rounded-full bg-state-inbed"></span> Cama
            </div>
            <div
              class="flex items-center gap-1.5 text-[11px] font-bold text-slate-400"
            >
              <span class="size-2 rounded-full bg-state-awake"></span> Fuera
            </div>
          </div>
        </div>
      </div>

      <div class="p-4 md:p-6 space-y-5">
        <SleepTimeline
          :intervals="dayReg.intervals"
          :bedtime-date="dayReg.bedtime as Date"
          :wakeup-date="dayReg.wakeup as Date"
        />

        <div
          class="bg-black/20 rounded-lg border border-border-dark overflow-hidden"
        >
          <div class="divide-y divide-border-dark/50">
            <div
              v-for="(interval, index) in dayReg.intervals"
              :key="index"
              class="flex items-center justify-between p-3.5 hover:bg-white/2 transition-colors"
            >
              <div class="flex items-center gap-3">
                <span
                  class="size-2 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
                  :class="getStateClass(interval.state)"
                ></span>
                <span class="text-xs font-bold text-white/90">
                  {{ formatTime(interval.startTime) }} —
                  {{ formatTime(interval.endTime) }}
                </span>
                <span
                  class="text-[10px] text-slate-500 uppercase font-black tracking-wider"
                >
                  {{ getStateLabel(interval.state) }}
                </span>
              </div>
              <span class="text-xs font-bold text-slate-400">
                {{ formatDuration(interval.hours, interval.minutes) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="technical-card bg-card-dark border border-border-dark rounded-xl overflow-hidden"
    >
      <div class="px-4 md:px-6 py-4 border-b border-border-dark bg-black/20">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Observaciones
        </h3>
      </div>

      <div class="p-4 md:p-6 space-y-6">
        <div v-if="dayReg.observaciones" class="space-y-2">
          <span
            class="text-[10px] font-black text-indigo-400/80 uppercase tracking-widest ml-1"
          >
            Paciente (Autorregistro)
          </span>
          <div class="bg-black/20 border border-border-dark p-4 rounded-xl">
            <p class="text-slate-300 text-sm leading-relaxed italic">
              "{{ dayReg.observaciones }}"
            </p>
          </div>
        </div>

        <div v-if="dayReg.psicoComment" class="space-y-2">
          <span
            class="text-[10px] font-black text-primary uppercase tracking-widest ml-1"
          >
            Psicólogo (Feedback)
          </span>
          <div class="bg-primary/5 border border-primary/20 p-4 rounded-xl">
            <p class="text-slate-200 text-sm leading-relaxed">
              {{ dayReg.psicoComment }}
            </p>
          </div>
          <button
            @click="editObservation"
            class="text-[11px] text-primary hover:text-white font-bold flex items-center gap-1 mt-2 transition-all"
          >
            <span class="material-symbols-outlined text-sm">edit</span>
            EDITAR COMENTARIO
          </button>
        </div>

        <div v-if="showObservationForm" class="space-y-3">
          <span
            class="text-[10px] font-black text-primary uppercase tracking-widest ml-1"
          >
            {{ dayReg.psicoComment ? 'Editar Nota' : 'Nueva Nota Técnica' }}
          </span>
          <div
            class="bg-black/30 border border-primary/30 p-1 rounded-xl focus-within:border-primary transition-all"
          >
            <textarea
              v-model="newObservation"
              class="w-full bg-transparent border-none text-white text-sm focus:ring-0 min-h-[120px] p-3 resize-none placeholder:text-slate-600 focus:outline-none"
              :placeholder="
                dayReg.psicoComment
                  ? 'Editar...'
                  : 'Escribe aquí tu análisis técnico...'
              "
              @keydown.ctrl.enter="saveObservation"
            ></textarea>

            <div
              class="flex justify-end gap-2 p-2 bg-black/20 rounded-b-lg border-t border-border-dark"
            >
              <button
                @click="cancelObservation"
                class="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                @click="saveObservation"
                :disabled="!newObservation.trim()"
                class="bg-primary hover:bg-primary/80 disabled:opacity-30 text-white font-bold px-5 py-2 rounded-lg text-xs transition-all flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-sm">save</span>
                {{ dayReg.psicoComment ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>
          </div>
        </div>

        <button
          v-if="!dayReg.psicoComment && !showObservationForm"
          @click="addObservation"
          class="w-full py-4 rounded-xl border-2 border-dashed border-border-dark hover:border-primary/50 text-slate-500 hover:text-primary transition-all flex items-center justify-center gap-2 group"
        >
          <span
            class="material-symbols-outlined group-hover:scale-110 transition-transform"
            >add_comment</span
          >
          <span class="text-xs font-bold uppercase tracking-widest"
            >Añadir análisis técnico</span
          >
        </button>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import { SleepState, type SleepReg } from '@/types/sleepReg.types'
  import { getStateClass } from '@/utils/sleep.utils'
  import SleepTimeline from '@/views/UserEditReg/components/Step3/components/SleepTimeline.vue'
  import { formatDisplayDate } from '../../../../../utils/date.utils'

  interface Props {
    dayReg: SleepReg | null
    date: Date
    showDateText?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    dayReg: null,
    date: () => new Date(),
    showDateText: true,
  })

  const emit = defineEmits<{
    'update:observations': [observations: string]
  }>()

  const newObservation = ref(props.dayReg?.psicoComment || '')
  const showObservationForm = ref(props.dayReg?.psicoComment !== undefined)

  const getStateLabel = (state: SleepState) => {
    switch (state) {
      case SleepState.ASLEEP:
        return 'Dormido'
      case SleepState.INBED:
        return 'En Cama'
      case SleepState.AWAKE:
        return 'Fuera de cama'
      default:
        return 'Desconocido'
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const formatDuration = (hours: number, minutes: number) => {
    if (hours === 0) {
      return `${minutes}m`
    } else if (minutes === 0) {
      return `${hours}h`
    } else {
      return `${hours}h ${minutes}m`
    }
  }

  const addObservation = () => {
    showObservationForm.value = true
    newObservation.value = props.dayReg?.psicoComment || ''
  }

  const editObservation = () => {
    showObservationForm.value = true
    newObservation.value = props.dayReg?.psicoComment || ''
  }

  const cancelObservation = () => {
    showObservationForm.value = false
    newObservation.value = props.dayReg?.psicoComment || ''
  }

  const saveObservation = () => {
    if (newObservation.value.trim() && props.dayReg) {
      emit('update:observations', newObservation.value)
      showObservationForm.value = false
    }
  }
</script>
