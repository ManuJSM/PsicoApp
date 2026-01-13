<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useToast } from '@/composables/useToast'
  import { ToastType } from '@/types/types'
  import { AutenticationError } from '@/types/errors.types'
  import { useAuthStore } from '@/stores/auth.store'
  const { setToast } = useToast()

  const mounted = ref(false)
  const showPassword = ref(false)
  const loading = ref(false)
  const email = ref('')
  const password = ref('')
  const authStore = useAuthStore()
  const handleLogin = async () => {
    loading.value = true
    try {
      await authStore.login(email.value, password.value)
      //FIXME: de momento redirige al dashboard creado dinamicamente al refrescar la app
      // setToast(ToastType.Success, 'Login exitoso')
      window.location.assign('/Dashboard')
    } catch (err: unknown) {
      if (err instanceof AutenticationError) {
        setToast(ToastType.Error, err.message)
      } else {
        console.log(err)
      }
      loading.value = false
    }
  }

  onMounted(() => {
    mounted.value = true
  })

  const togglePassword = () => {
    showPassword.value = !showPassword.value
  }
</script>

<template>
  <main
    class="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen overflow-hidden"
  >
    <div
      class="relative flex min-h-screen w-full flex-col items-center justify-center p-4"
    >
      <!-- Fondo con círculos animados -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <!-- Círculo 1 - se mueve de izquierda a derecha -->
        <div
          class="absolute top-1/4 -left-20 h-64 w-64 rounded-full bg-primary/5 dark:bg-primary/10 animate-float-x"
        ></div>

        <!-- Círculo 2 - se mueve en diagonal -->
        <div
          class="absolute bottom-1/4 -right-20 h-80 w-80 rounded-full bg-primary/5 dark:bg-primary/10 animate-float-diagonal delay-2000"
        ></div>

        <!-- Círculo 3 - se mueve verticalmente -->
        <div
          class="absolute top-1/3 right-1/4 h-48 w-48 rounded-full bg-primary/5 dark:bg-primary/10 animate-float-y delay-1000"
        ></div>

        <!-- Círculo 4 - se mueve en órbita -->
        <div
          class="absolute bottom-1/3 left-1/4 h-40 w-40 rounded-full bg-primary/5 dark:bg-primary/10 animate-orbit"
        ></div>
      </div>

      <!-- Tarjeta principal ESTÁTICA -->
      <div
        class="relative z-10 flex w-full max-w-md flex-col items-center justify-center gap-6 rounded-xl bg-white/95 dark:bg-black/50 backdrop-blur-sm p-8 shadow-xl border border-white/30 dark:border-white/10"
        :class="{
          'opacity-0 scale-95': !mounted,
          'opacity-100 scale-100': mounted,
        }"
        style="
          transition:
            opacity 0.8s ease,
            transform 0.8s ease;
        "
      >
        <!-- Icono -->
        <div
          class="flex flex-col items-center justify-center"
          :class="{
            'opacity-0': !mounted,
            'opacity-100': mounted,
          }"
          style="transition: opacity 0.6s ease 0.2s"
        >
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
          >
            <img src="@/assets/appIcon.svg" alt="icon" class="h-8 w-8" />
          </div>
        </div>

        <!-- Texto -->
        <div class="flex w-full flex-col items-center gap-2 text-center">
          <p
            class="text-3xl font-bold text-gray-900 dark:text-white"
            :class="{
              'opacity-0 translate-y-4': !mounted,
              'opacity-100 translate-y-0': mounted,
            }"
            style="
              transition:
                opacity 0.6s ease 0.3s,
                transform 0.6s ease 0.3s;
            "
          >
            Bienvenido
          </p>
          <p
            class="text-base text-gray-500 dark:text-gray-400"
            :class="{
              'opacity-0 translate-y-4': !mounted,
              'opacity-100 translate-y-0': mounted,
            }"
            style="
              transition:
                opacity 0.6s ease 0.4s,
                transform 0.6s ease 0.4s;
            "
          >
            Inicia sesión para empezar a usar la app.
          </p>
        </div>

        <!-- Formulario -->
        <form class="flex w-full flex-col gap-4">
          <!-- Email -->
          <div
            class="flex flex-col"
            :class="{
              'opacity-0 translate-y-4': !mounted,
              'opacity-100 translate-y-0': mounted,
            }"
            style="
              transition:
                opacity 0.6s ease 0.5s,
                transform 0.6s ease 0.5s;
            "
          >
            <label class="flex flex-col gap-2">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Correo Electrónico
              </p>
              <input
                class="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white/50 dark:bg-black/30 px-4 py-2.5 text-base font-normal text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 transition-all duration-300 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                placeholder="Introduce tu usuario o correo"
                type="email"
                v-model="email"
              />
            </label>
          </div>

          <!-- Contraseña -->
          <div
            class="flex flex-col"
            :class="{
              'opacity-0 translate-y-4': !mounted,
              'opacity-100 translate-y-0': mounted,
            }"
            style="
              transition:
                opacity 0.6s ease 0.6s,
                transform 0.6s ease 0.6s;
            "
          >
            <label class="flex flex-col gap-2">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Contraseña
              </p>
              <div class="relative flex w-full items-center">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white/50 dark:bg-black/30 px-4 py-2.5 pr-12 text-base font-normal text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 transition-all duration-300 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  placeholder="Introduce tu contraseña"
                  v-model="password"
                />
                <button
                  @click.prevent="togglePassword"
                  class="absolute right-0 flex h-full w-12 cursor-pointer items-center justify-center text-gray-500 hover:text-primary transition-colors duration-300 dark:text-gray-400"
                  type="button"
                >
                  <span class="material-symbols-outlined">
                    {{ showPassword ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
              </div>
            </label>
          </div>

          <!-- Olvidé contraseña -->
          <div
            class="flex justify-end"
            :class="{
              'opacity-0': !mounted,
              'opacity-100': mounted,
            }"
            style="transition: opacity 0.6s ease 0.7s"
          >
            <a
              class="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-all duration-300"
              href="#"
              >¿Olvidaste tu contraseña?</a
            >
          </div>

          <!-- Botón -->
          <div
            class="flex w-full flex-col gap-3 pt-2"
            :class="{
              'opacity-0 translate-y-4': !mounted,
              'opacity-100 translate-y-0': mounted,
            }"
            style="
              transition:
                opacity 0.6s ease 0.8s,
                transform 0.6s ease 0.8s;
            "
          >
            <button
              class="group flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-bold text-white shadow-lg hover:bg-primary/90 hover:shadow-xl active:scale-95 transition-all duration-300"
              @click.prevent="handleLogin"
              type="submit"
            >
              <div
                v-if="loading"
                class="absolute inset-0 flex items-center justify-center"
              >
                <svg
                  class="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <span
                v-else
                class="truncate group-hover:scale-105 transition-transform duration-300"
              >
                Iniciar Sesión
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped>
  /* Animaciones SOLO para los círculos de fondo */

  @keyframes float-x {
    0%,
    100% {
      transform: translateX(0) translateY(0);
    }
    25% {
      transform: translateX(100px) translateY(-50px);
    }
    50% {
      transform: translateX(200px) translateY(0);
    }
    75% {
      transform: translateX(100px) translateY(50px);
    }
  }

  @keyframes float-y {
    0%,
    100% {
      transform: translateY(0) translateX(0);
    }
    33% {
      transform: translateY(-100px) translateX(30px);
    }
    66% {
      transform: translateY(100px) translateX(-30px);
    }
  }

  @keyframes float-diagonal {
    0%,
    100% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(-150px, -80px);
    }
    50% {
      transform: translate(-300px, 0);
    }
    75% {
      transform: translate(-150px, 80px);
    }
  }

  @keyframes orbit {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    100% {
      transform: translate(200px, 150px) rotate(360deg);
    }
  }

  .animate-float-x {
    animation: float-x 20s ease-in-out infinite;
  }

  .animate-float-y {
    animation: float-y 15s ease-in-out infinite;
  }

  .animate-float-diagonal {
    animation: float-diagonal 25s ease-in-out infinite;
  }

  .animate-orbit {
    animation: orbit 30s linear infinite;
  }

  /* Delays para que no estén todos sincronizados */
  .delay-1000 {
    animation-delay: 1s;
  }

  .delay-2000 {
    animation-delay: 2s;
  }

  /* Transición suave para inputs */
  .form-input {
    transition: all 0.3s ease;
  }

  /* Fondo de la tarjeta con desenfoque */
  .backdrop-blur-sm {
    backdrop-filter: blur(8px);
  }
</style>
