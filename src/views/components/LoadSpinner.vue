<template>
  <section class="loader-container">
    <svg
      class="bedtime-spinner"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        d="M12.34 2.02A10 10 0 0 0 2 11.9a10 10 0 0 0 10 10 10 10 0 0 0 9.88-8.38 8 8 0 0 1-9.54-11.5z"
      />
    </svg>
  </section>
</template>
<style scoped>
  /* Contenedor opcional para centrar el spinner en la pantalla */
  .loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
  }

  /* Estilos base del SVG */
  .bedtime-spinner {
    color: #137fec;
    width: 100px;
    height: 100px;
    animation: spin-and-glow 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  /* Definición de la animación de rotación y resplandor */
  @keyframes spin-and-glow {
    0% {
      transform: rotate(0deg) scale(0.9);
      filter: drop-shadow(0 0 2px rgba(226, 232, 240, 0.2));
    }
    50% {
      transform: rotate(180deg) scale(1.1);
      filter: drop-shadow(0 0 15px rgba(226, 232, 240, 0.8));
    }
    100% {
      transform: rotate(360deg) scale(0.9);
      filter: drop-shadow(0 0 2px rgba(226, 232, 240, 0.2));
    }
  }
</style>
