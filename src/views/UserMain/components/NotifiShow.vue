<script lang="ts"></script>
<template>
  <main class="flex flex-col">
    <div class="px-6 pt-6 pb-4 mb-2 border-b-2 border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <h1 class="text-gray-900 dark:text-white tracking-tight text-2xl font-bold leading-tight">
          Notificaciones
        </h1>
        <button
          class="text-sm font-semibold text-primary hover:text-blue-600 transition-colors active:scale-95"
        >
          Marcar todo como leído
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <div
        class="group flex flex-col gap-3 bg-blue-50/60 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 cursor-pointer active:scale-[0.98] transition-all hover:shadow-sm"
      >
        <div class="flex items-start gap-4">
          <div
            class="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center rounded-full size-12 shrink-0"
          >
            <span class="material-symbols-outlined">chat_bubble</span>
          </div>
          <div class="flex flex-1 flex-col gap-1.5">
            <div class="flex justify-between items-start">
              <p class="text-gray-900 dark:text-white text-sm font-bold leading-snug">
                Nuevo comentario
              </p>
              <span
                class="size-2.5 bg-primary rounded-full mt-1.5 shrink-0 shadow-sm shadow-primary/30"
              ></span>
            </div>
            <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed font-medium">
              Tu psicólogo ha añadido un comentario a tu registro del lunes.
            </p>
            <p class="text-xs text-gray-400 mt-1 font-medium">Hace 2 horas</p>
          </div>
        </div>
      </div>
      <div
        class="group flex flex-col gap-3 bg-white dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-white/5 cursor-pointer active:scale-[0.98] transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <div class="flex items-start gap-4">
          <div
            class="bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center rounded-full size-12 shrink-0"
          >
            <span class="material-symbols-outlined">calendar_month</span>
          </div>
          <div class="flex flex-1 flex-col gap-1.5">
            <div class="flex justify-between items-start">
              <p class="text-gray-900 dark:text-white text-sm font-bold leading-snug">
                Recordatorio de sesión
              </p>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Mañana tienes una sesión programada a las 16:00 con el Dr. Martínez.
            </p>
            <p class="text-xs text-gray-400 mt-1 font-medium">Ayer</p>
          </div>
        </div>
      </div>
      <div
        class="group flex flex-col gap-3 bg-white dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-white/5 cursor-pointer active:scale-[0.98] transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <div class="flex items-start gap-4">
          <div
            class="bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400 flex items-center justify-center rounded-full size-12 shrink-0"
          >
            <span class="material-symbols-outlined">check_circle</span>
          </div>
          <div class="flex flex-1 flex-col gap-1.5">
            <div class="flex justify-between items-start">
              <p class="text-gray-900 dark:text-white text-sm font-bold leading-snug">
                Objetivo cumplido
              </p>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              ¡Felicidades! Has completado tu registro de sueño por 7 días seguidos.
            </p>
            <p class="text-xs text-gray-400 mt-1 font-medium">Hace 3 días</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
