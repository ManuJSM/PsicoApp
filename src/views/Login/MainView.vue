<script setup lang="ts"></script>
<template>
  <div
    class="bg-background-light fade-in dark:bg-background-dark font-display text-gray-800 dark:text-gray-200"
  >
    <div
      class="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden p-4"
    >
      <div
        class="flex w-full max-w-md flex-col items-center justify-center gap-6 rounded-xl bg-white dark:bg-black/20 p-8 shadow-sm"
      >
        <div class="flex flex-col items-center justify-center">
          <div class="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
            <img src="@/assets/appIcon.svg" alt="icon" />
          </div>
        </div>
        <div class="flex w-full flex-col items-center gap-2 text-center">
          <p class="text-3xl font-bold text-gray-900 dark:text-white">Bienvenido</p>
          <p class="text-base text-gray-500 dark:text-gray-400">
            Inicia sesión para empezar a usar la app.
          </p>
        </div>
        <form class="flex w-full flex-col gap-4">
          <div class="flex flex-col">
            <label class="flex flex-col gap-2">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</p>
              <input
                class="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-base font-normal text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-0 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                placeholder="Introduce tu usuario o correo"
                type="email"
                value=""
              />
            </label>
          </div>
          <div class="flex flex-col">
            <label class="flex flex-col gap-2">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</p>
              <div class="relative flex w-full items-center">
                <input
                  class="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-12 text-base font-normal text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-0 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  placeholder="Introduce tu contraseña"
                  type="password"
                  value=""
                />
                <button
                  class="absolute right-0 flex h-full w-12 cursor-pointer items-center justify-center text-gray-500 dark:text-gray-400"
                  type="button"
                >
                  <span class="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </label>
          </div>
          <div class="flex justify-end">
            <a class="text-sm font-medium text-primary hover:underline" href="#"
              >¿Olvidaste tu contraseña?</a
            >
          </div>
          <div class="flex w-full flex-col gap-3 pt-2">
            <button
              class="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-bold text-white"
            >
              <span class="truncate">Iniciar Sesión</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  0% {
    opacity: 0.3;
    transform: translateY(5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}
</style>
