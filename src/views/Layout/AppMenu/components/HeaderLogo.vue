<template>
  <div class="relative group cursor-pointer">
    <div
      class="absolute -inset-1 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"
    ></div>

    <div
      class="relative size-12 rounded-full bg-card-dark border border-primary/30 shadow-xl shadow-primary/10 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-primary group-hover:scale-105"
    >
      <div
        class="absolute top-0 right-0 -mr-4 -mt-4 size-10 rounded-full bg-primary/20 blur-[15px]"
      ></div>
      <div
        class="absolute bottom-0 left-0 -ml-4 -mb-4 size-8 rounded-full bg-emerald-500/10 blur-md"
      ></div>

      <img
        src="@/assets/appIcon.svg"
        alt="logo"
        class="relative size-7 object-contain transition-all duration-500 group-hover:scale-110 logo-glow"
      />
    </div>
  </div>
</template>

<style scoped>
  .logo-glow {
    filter: invert(42%) sepia(93%) saturate(1352%) hue-rotate(189deg)
      brightness(100%) contrast(105%)
      drop-shadow(0 0 5px rgba(19, 127, 236, 0.8));
  }

  /* En hover podemos hacerlo brillar más */
  .group:hover .logo-glow {
    filter: invert(42%) sepia(93%) saturate(1352%) hue-rotate(189deg)
      brightness(115%) contrast(105%) drop-shadow(0 0 8px rgba(19, 127, 236, 1));
  }
</style>
