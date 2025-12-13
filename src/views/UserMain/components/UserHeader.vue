<script lang="ts"></script>
<template>
  <header
    class="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-100 dark:border-white/5 px-6 py-4 sticky top-0 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md z-10"
  >
    <div class="flex items-center gap-3">
      <div
        class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 ring-2 ring-gray-100 dark:ring-white/10"
        data-alt="User avatar placeholder"
        style="
          background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAWoHqaA7dq_qhMrfVmh63nndpIKFwxN75_b7OljfUVc56ky7dYjCTH85UY1FN9IqLr1VMVT54YbWCcz4hzQ3gO5z7rgEb8yhg0aR332ljniRntCHJoGlUYsWE2Z55ORRoOa7_27DvnS0paNvmK_ZJmX-_Wu1m3U0wfXlM8IoqefMR7_wqb6Ww0fY7Il2D_AccwGea5zYPooCtxmVAyGW70QunAk7r35-7XSIHxQEnC-Kh3VV7_k4pYXzOY1y4XbL2EzSWJn9kE-rk');
        "
      ></div>
      <div>
        <h2 class="text-gray-900 dark:text-white text-base font-bold leading-tight">Hola, Alex</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">Paciente</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button
        class="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
      >
        <span class="material-symbols-outlined">notifications</span>
      </button>
    </div>
  </header>
</template>
