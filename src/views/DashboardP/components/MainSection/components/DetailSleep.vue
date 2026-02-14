<template>
  <!-- Vista cuando no hay registro -->
  <div
    v-if="!dayReg"
    class="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
  >
    <div class="mb-8">
      <div
        class="size-32 md:size-40 rounded-full bg-[#0d1117] border-2 border-white/10 flex items-center justify-center mb-6 mx-auto"
      >
        <span class="material-symbols-outlined text-5xl text-slate-600">
          nights_stay
        </span>
      </div>
    </div>

    <h2 class="text-2xl md:text-3xl font-bold text-slate-300 mb-4">
      Sin registro para esta fecha
    </h2>

    <p class="text-slate-500 max-w-md mx-auto">
      No se encontró un registro de sueño para el día seleccionado.
      {{ showDateText ? `(${formatDisplayDate(props.date)})` : '' }}
    </p>
  </div>

  <!-- Vista normal cuando hay registro -->
  <template v-else>
    <section class="flex flex-col gap-3">
      <!-- Cronología de la Noche -->

      <div
        class="technical-card bg-card-dark border border-white/10 rounded-xl overflow-hidden"
      >
        <!-- Header con leyenda -->
        <div class="px-4 md:px-6 py-4 border-b border-white/10 bg-[#0d1117]/50">
          <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-2"
          >
            <h3
              class="text-xs font-bold text-slate-400 uppercase tracking-widest"
            >
              Cronología de la Noche
            </h3>
            <div class="flex items-baseline gap-3 md:gap-5">
              <div
                class="flex items-center gap-1.5 text-xs font-bold text-slate-400"
              >
                <span class="size-1.5 rounded-full bg-state-asleep"></span>
                Sueño
              </div>
              <div
                class="flex items-center gap-1.5 text-xs font-bold text-slate-400"
              >
                <span class="size-1.5 rounded-full bg-state-inbed"></span>
                Cama
              </div>
              <div
                class="flex items-center gap-1.5 text-xs font-bold text-slate-400"
              >
                <span class="size-1.5 rounded-full bg-state-awake"></span>
                Fuera
              </div>
            </div>
          </div>
        </div>

        <!-- Contenido -->
        <div class="p-4 md:p-6 space-y-4">
          <!-- Timeline visual -->

          <SleepTimeline
            :intervals="dayReg.intervals"
            :bedtime-date="dayReg.bedtime as Date"
            :wakeup-date="dayReg.wakeup as Date"
          />
          <!-- Intervalos detallados -->
          <div
            class="bg-[#0d1117]/50 rounded-lg border border-white/10 overflow-hidden"
          >
            <div class="grid grid-cols-1">
              <div
                v-for="(interval, index) in dayReg.intervals"
                :key="index"
                class="flex items-center justify-between p-3"
              >
                <div class="flex items-center gap-3">
                  <span
                    class="size-2 rounded-full shrink-0"
                    :class="getStateClass(interval.state)"
                  ></span>
                  <span class="text-xs font-bold text-white w-24 md:w-auto">
                    {{ formatTime(interval.startTime) }} -
                    {{ formatTime(interval.endTime) }}
                  </span>
                  <span
                    class="text-[10px] text-slate-500 uppercase font-bold tracking-tighter"
                  >
                    {{ getStateLabel(interval.state) }}
                  </span>
                </div>
                <span class="text-xs font-bold text-slate-400 shrink-0">
                  {{ formatDuration(interval.hours, interval.minutes) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Observaciones -->
      <div
        class="technical-card bg-card-dark border border-white/10 rounded-xl overflow-hidden"
      >
        <div class="px-4 md:px-6 py-4 border-b border-white/10 bg-[#0d1117]/50">
          <h3
            class="text-xs font-bold text-slate-400 uppercase tracking-widest"
          >
            Observaciones sobre la noche
          </h3>
        </div>

        <div class="p-4 md:p-6 space-y-6">
          <!-- Observaciones del paciente -->
          <div v-if="dayReg.observaciones" class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-indigo-400 uppercase">
                Paciente (Autorregistro)
              </span>
            </div>
            <div
              class="bg-[#0d1117]/50 border border-white/10 p-3 md:p-4 rounded-lg"
            >
              <p class="text-slate-300 text-sm leading-relaxed italic">
                "{{ dayReg.observaciones }}"
              </p>
            </div>
          </div>

          <!-- Observaciones técnicas existentes -->
          <div v-if="dayReg.psicoComment" class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-primary uppercase"
                >Psicologo (Feedback)</span
              >
            </div>
            <div
              class="bg-[#0d1117]/50 border border-[#58a6ff]/20 p-3 md:p-4 rounded-lg"
            >
              <p class="text-slate-300 text-sm leading-relaxed">
                {{ dayReg.psicoComment }}
              </p>
            </div>
            <div class="pt-2 border-t border-white/10">
              <button
                @click="editObservation"
                class="text-xs text-primary hover:text-primary font-medium flex items-center gap-1 transition-colors duration-200"
              >
                <span class="material-symbols-outlined text-sm!">edit</span>
                Editar comentario
              </button>
            </div>
          </div>

          <!-- Formulario para añadir/editar observaciones -->
          <div v-if="showObservationForm" class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-primary uppercase">
                {{
                  dayReg.psicoComment ? 'Editar Nota' : 'Añadir Nota Técnica'
                }}
              </span>
            </div>
            <div
              class="bg-[#0d1117]/50 border border-[#58a6ff]/20 p-3 md:p-4 rounded-lg"
            >
              <textarea
                v-model="newObservation"
                class="w-full bg-transparent border-none text-white text-sm focus:ring-0 min-h-[100px] md:min-h-[120px] resize-none placeholder:text-slate-600 focus:outline-none focus:shadow-[0_0_0_2px_rgba(88,166,255,0.1)]"
                :placeholder="
                  dayReg.psicoComment
                    ? 'Editar observaciones técnicas...'
                    : 'Añadir observaciones técnicas sobre la arquitectura del sueño...'
                "
                @keydown.ctrl.enter="saveObservation"
              ></textarea>
              <div
                class="flex flex-col md:flex-row justify-between items-center gap-2 pt-3 border-t border-white/10 mt-3"
              >
                <div class="flex items-center gap-2">
                  <button
                    @click="cancelObservation"
                    class="px-3 py-1.5 text-xs text-slate-400 hover:text-white font-medium hover:bg-white/5 rounded-lg transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    @click="saveObservation"
                    :disabled="!newObservation.trim()"
                    class="bg-[#238636] hover:bg-primary disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold px-4 py-2 rounded-lg text-xs transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#58a6ff]/10"
                  >
                    <span class="material-symbols-outlined text-sm!">save</span>
                    {{ dayReg.psicoComment ? 'Actualizar' : 'Guardar' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Botón para mostrar formulario si no hay nota o está oculto -->
          <div
            v-if="!dayReg.psicoComment && !showObservationForm"
            class="pt-4 border-t border-white/10"
          >
            <button
              @click="addObservation"
              class="w-full md:w-auto bg-[#58a6ff]/10 hover:bg-[#58a6ff]/20 border border-[#58a6ff]/30 text-[#58a6ff] hover:text-blue-300 font-bold px-4 py-3 rounded-lg text-xs transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined text-sm!"
                >add_comment</span
              >
              Añadir comentario
            </button>
          </div>
        </div>
      </div>
    </section>
  </template>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { SleepState, type SleepReg } from '@/types/sleepReg.types'
  import { getStateClass } from '@/views/UserEditReg/utils/css.util'
  import SleepTimeline from '@/views/UserEditReg/components/Step3/components/SleepTimeline.vue'

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

  const formatDisplayDate = (date: Date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
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
