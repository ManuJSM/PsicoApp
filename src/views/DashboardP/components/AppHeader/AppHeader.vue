<script setup lang="ts"></script>
<template>
  <header
    class="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 dark:border-white/10 px-6 py-3 shrink-0"
  >
    <div class="flex items-center gap-4 text-white">
      <div class="size-6 text-primary">
        <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
          ></path>
        </svg>
      </div>
      <h2
        class="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]"
      >
        Dashboard Profesional
      </h2>
    </div>
    <div class="flex flex-1 justify-end gap-4 items-center">
      <button
        class="flex items-center justify-center rounded-lg h-10 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white gap-2 text-sm font-bold min-w-0 px-2.5"
      >
        <span class="material-symbols-outlined">notifications</span>
      </button>
      <div class="relative group">
        <button
          class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          data-alt="User profile picture"
          style="
            background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhLF07NBPn2dCqJ0ay3UNdqC3Pye7J919BXFbFt9JbqCA099JXQll6wUcOG3ulXHBBEG5ZK7BojMC99RfGs7-Iei4nINtTBdqoIdRfNrJdEF-WFBLZ1rpqt13EigORRsUEJwi69yEsJmbFOYKg7au74Jm5WJpyRC2Y0Mn683aMldH02asvU9ODjbbNCP_WMrMTOjNjZsvKL2Rm978jH2gdM4_gxC6Ri-5oRl2LnxV5Yn4Et7oefWobfW6WiDbmnKOTJg8VzxZGFCE');
          "
        ></button>
        <div
          class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-1 z-20 hidden group-hover:block"
        >
          <a
            class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            href="#"
            >Mi Perfil</a
          >
          <a
            class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            href="#"
            >Ajustes</a
          >
          <div class="my-1 border-t border-slate-200 dark:border-slate-700"></div>
          <a
            class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            href="#"
            >Cerrar Sesión</a
          >
        </div>
      </div>
    </div>
  </header>
</template>
