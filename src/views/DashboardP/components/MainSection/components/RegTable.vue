<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  calculateDuration,
  calculateDurationPercentage,
  calculateQualityPercentage,
  getQualityIcon,
  getQualityColor,
  getBorderColor,
  getBgColor as getProgressBarColor,
} from '../utils/utils'

/* =========================
   MODELO DE DOMINIO (PURO)
========================= */

interface SleepRecord {
  id: number
  day: string
  date: string
  startTime: string
  endTime: string
  durationHours: number
  targetHours: number
  qualityRating: number
  hasNotification: boolean
  hasPatientComment: boolean
  patientComment?: string
  professionalNote?: string
}

/* =========================
   MODELO DE VISTA
========================= */

interface SleepRecordView {
  data: SleepRecord
  isExpanded: boolean
  isMissingData: boolean
  meta: {
    duration: string
    durationPercentage: number
    qualityPercentage: number
    icon: string
    color: string
    border: string
    progress: string
  }
}

/* =========================
   DATA BASE (SIMULADA)
========================= */

const sleepRecords = ref<SleepRecord[]>([
  {
    id: 1,
    day: 'Lun',
    date: '18 Nov',
    startTime: '22:30',
    endTime: '06:15',
    durationHours: 7.75,
    targetHours: 8,
    qualityRating: 4.2,
    hasNotification: true,
    hasPatientComment: true,
    patientComment:
      'Tuve un poco de insomnio al inicio pero logré descansar bien. Me levanté una vez.',
  },
  {
    id: 2,
    day: 'Mar',
    date: '19 Nov',
    startTime: '23:00',
    endTime: '06:30',
    durationHours: 7.5,
    targetHours: 8,
    qualityRating: 3.9,
    hasNotification: false,
    hasPatientComment: true,
    patientComment:
      'Me costó un poco conciliar el sueño anoche, estuve pensando mucho en el trabajo. Me desperté una vez para ir al baño pero volví a dormir rápido.',
    professionalNote: 'Recomendar técnicas de respiración antes de dormir.',
  },
  {
    id: 3,
    day: 'Mié',
    date: '20 Nov',
    startTime: '22:15',
    endTime: '06:15',
    durationHours: 8,
    targetHours: 8,
    qualityRating: 4.5,
    hasNotification: false,
    hasPatientComment: true,
    patientComment: 'Noche perfecta, dormí de corrido.',
  },
  {
    id: 4,
    day: 'Jue',
    date: '21 Nov',
    startTime: '',
    endTime: '',
    durationHours: 0,
    targetHours: 8,
    qualityRating: 0,
    hasNotification: false,
    hasPatientComment: false,
  },
  {
    id: 5,
    day: 'Vie',
    date: '22 Nov',
    startTime: '23:30',
    endTime: '07:30',
    durationHours: 8,
    targetHours: 8,
    qualityRating: 4.4,
    hasNotification: true,
    hasPatientComment: false,
  },
  {
    id: 6,
    day: 'Sáb',
    date: '23 Nov',
    startTime: '00:15',
    endTime: '09:00',
    durationHours: 8.75,
    targetHours: 8,
    qualityRating: 4.8,
    hasNotification: false,
    hasPatientComment: true,
    patientComment: 'Descansé súper bien, me siento renovado.',
  },
  {
    id: 7,
    day: 'Dom',
    date: '24 Nov',
    startTime: '',
    endTime: '',
    durationHours: 0,
    targetHours: 8,
    qualityRating: 0,
    hasNotification: false,
    hasPatientComment: false,
  },
])

/* =========================
   COMPUTED VIEW
========================= */

const expandedRows = ref<Set<number>>(new Set())

const computedRecords = computed<SleepRecordView[]>(() =>
  sleepRecords.value.map((record) => {
    const isMissingData = !record.startTime || !record.endTime

    if (isMissingData) {
      return {
        data: record,
        isExpanded: false,
        isMissingData: true,
        meta: {
          duration: '',
          durationPercentage: 0,
          qualityPercentage: 0,
          icon: 'bedtime_off',
          color: 'text-slate-400',
          border: '',
          progress: '',
        },
      }
    }

    const durationPercentage = calculateDurationPercentage(record.durationHours, record.targetHours)
    const qualityPercentage = calculateQualityPercentage(record.qualityRating)

    return {
      data: record,
      isExpanded: expandedRows.value.has(record.id),
      isMissingData: false,
      meta: {
        duration: calculateDuration(record.durationHours),
        durationPercentage,
        qualityPercentage,
        icon: getQualityIcon(qualityPercentage),
        color: getQualityColor(qualityPercentage),
        border: getBorderColor(qualityPercentage),
        progress: getProgressBarColor(durationPercentage),
      },
    }
  }),
)

/* =========================
   ACTIONS
========================= */
const toggleRowExpansion = (id: number) => {
  if (expandedRows.value.has(id)) {
    expandedRows.value.delete(id)
  } else {
    expandedRows.value.add(id)
  }
}

const goToNextWeek = () => {}
const goToPreviousWeek = () => {}

const saveProfessionalNote = (record: SleepRecord) => {
  console.log('Guardando nota:', record.id)
  alert(`Nota guardada para ${record.day}`)
}

/* =========================
   HEADER COMPUTED
========================= */

const recordsWithData = computed(() => computedRecords.value.filter((r) => !r.isMissingData))

const daysWithNotifications = computed(
  () => computedRecords.value.filter((r) => r.data.hasNotification).length,
)

const currentWeek = ref('18 – 24 Nov')
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h3 class="text-xl font-bold text-slate-900 dark:text-white">Registro de Sueño Semanal</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {{ recordsWithData.length }} de {{ sleepRecords.length }} días registrados
          <span v-if="daysWithNotifications > 0" class="ml-2 text-red-500">
            • {{ daysWithNotifications }} con notificaciones
          </span>
        </p>
      </div>
      <div
        class="flex items-center gap-2 self-end sm:self-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-lg"
      >
        <button
          @click="goToPreviousWeek"
          class="size-8 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
        >
          <span class="material-symbols-outlined" style="font-size: 20px">chevron_left</span>
        </button>
        <span class="text-sm font-bold text-slate-700 dark:text-slate-200 px-2">{{
          currentWeek
        }}</span>
        <button
          @click="goToNextWeek"
          class="size-8 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
        >
          <span class="material-symbols-outlined" style="font-size: 20px">chevron_right</span>
        </button>
      </div>
    </div>

    <!-- Tabla -->
    <div class="w-full">
      <table class="w-full text-sm text-left modern-table">
        <thead>
          <tr
            class="text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider"
          >
            <th class="px-6 py-4 rounded-l-xl w-[12%]">Día</th>
            <th class="px-4 py-4 text-center w-[15%]">Inicio</th>
            <th class="px-4 py-4 text-center w-[15%]">Fin</th>
            <th class="px-4 py-4 w-[25%]">Duración</th>
            <th class="px-4 py-4 w-[20%]">Calidad</th>
            <th class="px-4 py-4 rounded-r-xl w-[13%] text-right">Detalles</th>
          </tr>
        </thead>
        <tbody class="space-y-4 md:space-y-4">
          <!-- Iterar sobre los registros -->
          <template v-for="record in computedRecords" :key="record.data.id">
            <!-- Fila principal -->
            <tr
              :class="[
                'group modern-row transition-all duration-200 cursor-pointer',
                record.isMissingData
                  ? 'bg-slate-50 dark:bg-slate-800/30'
                  : 'bg-white dark:bg-slate-800 hover:shadow-md',
              ]"
              @click="toggleRowExpansion(record.data.id)"
            >
              <!-- Día -->
              <td
                :class="[
                  'px-6 py-4 rounded-l-xl',
                  record.meta.border && !record.isMissingData ? 'border-l-4' : '',
                  record.meta.border || '',
                ]"
              >
                <div class="flex flex-col">
                  <span
                    :class="[
                      'font-bold text-base',
                      record.isMissingData
                        ? 'text-slate-500 dark:text-slate-400'
                        : 'text-slate-900 dark:text-white',
                    ]"
                  >
                    {{ record.data.day }}
                  </span>
                  <span
                    :class="[
                      'text-xs',
                      record.isMissingData
                        ? 'text-slate-400 dark:text-slate-500'
                        : 'text-slate-500 dark:text-slate-400',
                    ]"
                  >
                    {{ record.data.date }}
                  </span>
                </div>
              </td>

              <!-- Inicio y Fin -->
              <template v-if="record.isMissingData">
                <td class="px-4 py-4 text-center" colspan="4">
                  <!-- Versión desktop -->
                  <div
                    class="hidden md:inline-flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-800/50 py-1.5 px-4 rounded-full border border-dashed border-slate-300 dark:border-slate-600 w-full md:w-auto"
                  >
                    <span class="material-symbols-outlined text-sm">bedtime_off</span>
                    <span class="text-xs font-medium uppercase tracking-wide">Sin registro</span>
                  </div>
                  <!-- Versión móvil -->
                  <div class="flex md:hidden flex-col items-center justify-center gap-3 w-full">
                    <div class="bg-white dark:bg-slate-700/50 p-3 rounded-full shadow-sm">
                      <span class="material-symbols-outlined text-3xl text-slate-400"
                        >bedtime_off</span
                      >
                    </div>
                    <div class="text-center">
                      <h4 class="text-slate-700 dark:text-slate-200 font-bold text-lg">
                        Día sin registro
                      </h4>
                      <p
                        class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px] mx-auto"
                      >
                        No hay datos de sueño sincronizados para este día.
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 rounded-r-xl text-right opacity-40">
                  <span class="material-symbols-outlined text-slate-400">remove</span>
                </td>
              </template>

              <template v-else>
                <td class="px-4 py-4 text-center">
                  <span class="font-mono text-base font-medium text-slate-700 dark:text-slate-200">
                    {{ record.data.startTime }}
                  </span>
                </td>
                <td class="px-4 py-4 text-center">
                  <span class="font-mono text-base font-medium text-slate-700 dark:text-slate-200">
                    {{ record.data.endTime }}
                  </span>
                </td>

                <!-- Duración -->
                <td class="px-4 py-4">
                  <div class="flex flex-col gap-1.5">
                    <div class="flex items-center justify-between text-xs mb-0.5">
                      <span class="font-bold text-slate-800 dark:text-slate-200">
                        {{ record.meta.duration }}
                      </span>
                      <span class="text-slate-400 text-[10px]">Meta: 8h</span>
                    </div>
                    <div
                      class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden"
                    >
                      <div
                        :class="['h-2 rounded-full', record.meta.progress]"
                        :style="{ width: `${record.meta.durationPercentage}%` }"
                      ></div>
                    </div>
                  </div>
                </td>

                <!-- Calidad -->
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2">
                    <span :class="[record.meta.color, 'material-symbols-outlined text-lg']">
                      {{ record.meta.icon }}
                    </span>
                    <span
                      :class="[
                        'font-bold',
                        record.meta.color.replace('text-', 'text-').replace('500', '600') +
                          ' dark:' +
                          record.meta.color.replace('text-', 'text-').replace('500', '400'),
                      ]"
                    >
                      {{ record.meta.qualityPercentage }}%
                    </span>
                  </div>
                </td>

                <!-- Detalles -->
                <td class="px-6 py-4 rounded-r-xl text-right">
                  <label
                    class="relative cursor-pointer inline-flex items-center justify-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary"
                    @click.stop="toggleRowExpansion(record.data.id)"
                  >
                    <input
                      class="toggle-row"
                      type="checkbox"
                      :checked="record.isExpanded"
                      @change="toggleRowExpansion(record.data.id)"
                    />
                    <span
                      class="material-symbols-outlined chevron transition-transform duration-300"
                    >
                      expand_more
                    </span>
                    <!-- Notificación -->
                    <span
                      v-if="record.data.hasNotification"
                      class="absolute top-1 right-1 flex h-2.5 w-2.5"
                    >
                      <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                      ></span>
                      <span
                        class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white dark:border-slate-800"
                      ></span>
                    </span>
                  </label>
                </td>
              </template>
            </tr>

            <!-- Fila de detalles (solo para registros con datos) -->
            <tr v-if="!record.isMissingData" class="details-row">
              <td v-show="record.isExpanded" class="p-0 border-none rounded-b-xl" colspan="6">
                <div
                  :class="[
                    'detail-panel-content mx-0 mb-0 mt-0 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800/50 rounded-b-xl px-6 py-5 grid md:grid-cols-2 gap-6',
                    record.meta.border ? 'border-l-4' : '',
                    record.meta.border,
                  ]"
                >
                  <!-- Comentario del paciente -->
                  <div v-if="record.data.hasPatientComment" class="space-y-3">
                    <h5
                      class="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 flex items-center gap-2"
                    >
                      <span class="material-symbols-outlined text-base">chat_bubble_outline</span>
                      Comentario del Paciente
                    </h5>
                    <div
                      class="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm relative"
                    >
                      <div
                        class="absolute top-4 left-0 bottom-4 w-1 bg-primary rounded-r-full"
                      ></div>
                      <p
                        class="text-sm text-slate-700 dark:text-slate-300 italic pl-3 leading-relaxed"
                      >
                        {{ record.data.patientComment }}
                      </p>
                    </div>
                  </div>

                  <!-- Notas del profesional -->
                  <div class="space-y-3">
                    <h5
                      class="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 flex items-center gap-2"
                    >
                      <span class="material-symbols-outlined text-base">edit_note</span>
                      Notas del Profesional
                    </h5>
                    <div
                      class="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-3"
                    >
                      <div class="flex gap-4 items-start">
                        <div
                          class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-9 w-9 shrink-0 mt-1"
                          style="
                            background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhLF07NBPn2dCqJ0ay3UNdqC3Pye7J919BXFbFt9JbqCA099JXQll6wUcOG3ulXHBBEG5ZK7BojMC99RfGs7-Iei4nINtTBdqoIdRfNrJdEF-WFBLZ1rpqt13EigORRsUEJwi69yEsJmbFOYKg7au74Jm5WJpyRC2Y0Mn683aMldH02asvU9ODjbbNCP_WMrMTOjNjZsvKL2Rm978jH2gdM4_gxC6Ri-5oRl2LnxV5Yn4Et7oefWobfW6WiDbmnKOTJg8VzxZGFCE');
                          "
                        ></div>
                        <textarea
                          v-model="record.data.professionalNote"
                          class="flex-1 w-full text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-md p-3 focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white resize-none"
                          placeholder="Escribe tus observaciones aquí..."
                          rows="5"
                          @click.stop
                        ></textarea>
                      </div>
                      <div class="flex justify-end">
                        <button
                          @click.stop="saveProfessionalNote(record.data)"
                          :class="[
                            'text-white text-xs font-bold py-2 px-3 rounded-md shadow-sm transition-all flex items-center gap-1.5',
                            record.data.professionalNote?.trim()
                              ? 'bg-primary hover:bg-blue-600 cursor-pointer'
                              : 'bg-primary/50 cursor-not-allowed',
                          ]"
                          :disabled="!record.data.professionalNote?.trim()"
                        >
                          <span class="material-symbols-outlined text-base">save</span>
                          {{
                            record.data.professionalNote?.trim() ? 'Guardar Comentario' : 'Guardar'
                          }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.modern-table {
  border-spacing: 0 0.5rem;
  border-collapse: separate;
}
.modern-row {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05);
}
@media (min-width: 768px) {
  .modern-row:hover {
    transform: translateY(-1px);
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -1px rgb(0 0 0 / 0.06);
  }
  .modern-row {
    background-color: white;
  }
  .dark .modern-row {
    background-color: rgb(30 41 59);
  }
}
input.toggle-row {
  display: none;
}
@media (min-width: 768px) {
  tr.details-row {
    display: none;
  }
  tr.group:has(input.toggle-row:checked) + tr.details-row {
    display: table-row;
  }
  tr.group:has(input.toggle-row:checked) .chevron {
    transform: rotate(180deg);
  }
  tr.group:has(input.toggle-row:checked) td:first-child {
    border-bottom-left-radius: 0;
  }
  tr.group:has(input.toggle-row:checked) td:last-child {
    border-bottom-right-radius: 0;
  }
  tr.group:has(input.toggle-row:checked) {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    background-color: rgb(248 250 252);
  }
  .dark tr.group:has(input.toggle-row:checked) {
    background-color: rgb(30 41 59);
  }
}
@media (max-width: 767px) {
  .modern-table thead {
    display: none;
  }
  .modern-table {
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
  }
  .modern-table tbody {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
  .modern-row {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: white;
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
    position: relative;
    margin-bottom: 0;
  }
  .dark .modern-row {
    background-color: rgb(30 41 59);
    border-color: rgba(255, 255, 255, 0.05);
  }
  .modern-row td:empty {
    display: none;
  }
  .modern-row td:nth-child(1) {
    border-bottom: 1px solid #f1f5f9;
    border-radius: 0.75rem 0.75rem 0 0 !important;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .dark .modern-row td:nth-child(1) {
    border-bottom-color: rgba(255, 255, 255, 0.05);
  }
  .modern-row td:not(:first-child):not(:last-child) {
    padding: 0.75rem 1rem;
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f8fafc;
    width: 100%;
  }
  .dark .modern-row td:not(:first-child):not(:last-child) {
    border-bottom-color: rgba(255, 255, 255, 0.02);
  }
  .modern-row td:nth-child(2)::before {
    content: 'Inicio';
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
  }
  .modern-row td:nth-child(3)::before {
    content: 'Fin';
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
  }
  .modern-row td:nth-child(4)::before {
    content: 'Duración';
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
  }
  .modern-row td:nth-child(5)::before {
    content: 'Calidad';
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
  }
  .modern-row td:nth-child(4) > div {
    width: 60%;
  }
  .modern-row td:last-child {
    padding: 0.5rem 1rem;
    text-align: center;
    border-radius: 0 0 0.75rem 0.75rem;
    background-color: #f8fafc;
    border-top: 1px solid #e2e8f0;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .dark .modern-row td:last-child {
    background-color: rgba(255, 255, 255, 0.02);
    border-top-color: rgba(255, 255, 255, 0.05);
  }
  tr.details-row {
    display: none;
    width: 100%;
    margin-top: -1rem;
    z-index: 5;
    position: relative;
  }
  tr.group:has(input.toggle-row:checked) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-color: transparent;
    z-index: 10;
  }
  tr.group:has(input.toggle-row:checked) td:last-child {
    border-radius: 0;
    background-color: white;
    border-bottom: 1px solid #f1f5f9;
  }
  .dark tr.group:has(input.toggle-row:checked) td:last-child {
    background-color: rgb(30 41 59);
    border-bottom-color: rgba(255, 255, 255, 0.05);
  }
  tr.group:has(input.toggle-row:checked) .chevron {
    transform: rotate(180deg);
  }
  tr.group:has(input.toggle-row:checked) + tr.details-row {
    display: flex;
  }
  tr.details-row td {
    display: block;
    width: 100%;
    border-radius: 0 0 0.75rem 0.75rem;
    padding: 0;
  }
  .detail-panel-content {
    border-radius: 0 0 0.75rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-top: none;
    margin: 0;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }
  .dark .detail-panel-content {
    border-color: rgba(255, 255, 255, 0.05);
  }
  tr.modern-row:has(td[colspan='4']) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 0;
    border: 2px dashed #cbd5e1;
    background-color: #f8fafc;
    min-height: 200px;
    justify-content: flex-start;
    position: relative;
  }
  .dark tr.modern-row:has(td[colspan='4']) {
    border-color: #334155;
    background-color: rgba(15, 23, 42, 0.5);
  }
  tr.modern-row:has(td[colspan='4']) td:first-child {
    background: transparent;
    border: none;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: auto;
  }
  tr.modern-row:has(td[colspan='4']) td[colspan='4'] {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    padding-top: 3rem;
    border: none !important;
  }
  tr.modern-row:has(td[colspan='4']) td:last-child {
    display: none;
  }
}
.detail-panel-content {
  animation: slideDown 0.3s ease-out forwards;
  transform-origin: top;
}
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
