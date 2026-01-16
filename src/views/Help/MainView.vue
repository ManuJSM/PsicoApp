<script setup lang="ts">
  import AppFooter from '../components/AppFooter.vue'
</script>

<template>
  <!-- Main Content -->
  <main
    class="flex-1 pb-safe-sm md:overflow-y-auto flex flex-col items-center px-4 overflow-y-auto"
  >
    <div
      class="layout-content-container flex flex-col max-w-[1200px] w-full flex-1 gap-8"
    >
      <!-- Page Heading -->
      <div class="flex flex-col items-center gap-3 py-4 md:py-8">
        <p
          class="text-[#111418] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]"
        >
          Ayuda y Soporte
        </p>
        <p
          class="text-[#637588] dark:text-[#9dabb9] text-base font-normal leading-normal max-w-2xl"
        >
          Estamos aquí para ayudarte. Encuentra respuestas rápidas en nuestras
          preguntas frecuentes o ponte en contacto directo con nuestro equipo de
          soporte.
        </p>
      </div>
      <!-- Two Column Layout: FAQ & Contact Form -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left Column: FAQ (Takes up 7 cols on desktop) -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          <h2
            class="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]"
          >
            Preguntas Frecuentes (FAQ)
          </h2>
          <div class="flex flex-col gap-3">
            <!-- Accordion Item 1 -->
            <details
              class="flex flex-col rounded-xl border border-[#dce0e5] dark:border-[#3b4754] bg-white dark:bg-background-dark px-[15px] py-2 group shadow-sm"
            >
              <summary
                class="flex cursor-pointer items-center justify-between gap-6 py-3"
              >
                <p
                  class="text-[#111418] dark:text-white text-base font-semibold leading-normal"
                >
                  ¿Cómo registro mi sueño?
                </p>
                <span
                  class="material-symbols-outlined text-[#637588] dark:text-white group-open:rotate-180 transition-transform duration-300"
                  >expand_more</span
                >
              </summary>
              <div
                class="text-[#637588] dark:text-[#9dabb9] text-sm font-normal leading-relaxed pb-4 pt-1 pr-4 border-t border-transparent group-open:border-[#e5e7eb] dark:group-open:border-[#283039] transition-all"
              >
                Para registrar tu sueño, ve a la sección "Diario" en la barra
                inferior. Pulsa el botón "+" y selecciona "Registro de Sueño".
                Podrás ingresar las horas dormidas y la calidad del descanso.
              </div>
            </details>
            <!-- Accordion Item 2 -->
            <details
              class="flex flex-col rounded-xl border border-[#dce0e5] dark:border-[#3b4754] bg-white dark:bg-background-dark px-[15px] py-2 group shadow-sm"
            >
              <summary
                class="flex cursor-pointer items-center justify-between gap-6 py-3"
              >
                <p
                  class="text-[#111418] dark:text-white text-base font-semibold leading-normal"
                >
                  ¿Cómo contacto a mi psicólogo?
                </p>
                <span
                  class="material-symbols-outlined text-[#637588] dark:text-white group-open:rotate-180 transition-transform duration-300"
                  >expand_more</span
                >
              </summary>
              <div
                class="text-[#637588] dark:text-[#9dabb9] text-sm font-normal leading-relaxed pb-4 pt-1 pr-4 border-t border-transparent group-open:border-[#e5e7eb] dark:group-open:border-[#283039] transition-all"
              >
                Puedes enviar un mensaje directo a tu especialista desde la
                pestaña "Chat". Si necesitas una sesión urgente, te recomendamos
                verificar su disponibilidad en la sección "Calendario".
              </div>
            </details>
            <!-- Accordion Item 3 -->
            <details
              class="flex flex-col rounded-xl border border-[#dce0e5] dark:border-[#3b4754] bg-white dark:bg-background-dark px-[15px] py-2 group shadow-sm"
            >
              <summary
                class="flex cursor-pointer items-center justify-between gap-6 py-3"
              >
                <p
                  class="text-[#111418] dark:text-white text-base font-semibold leading-normal"
                >
                  Problemas de acceso
                </p>
                <span
                  class="material-symbols-outlined text-[#637588] dark:text-white group-open:rotate-180 transition-transform duration-300"
                  >expand_more</span
                >
              </summary>
              <div
                class="text-[#637588] dark:text-[#9dabb9] text-sm font-normal leading-relaxed pb-4 pt-1 pr-4 border-t border-transparent group-open:border-[#e5e7eb] dark:group-open:border-[#283039] transition-all"
              >
                Si olvidaste tu contraseña, usa el enlace "¿Olvidaste tu
                contraseña?" en la pantalla de inicio de sesión. Si el problema
                persiste, verifica tu conexión a internet o contacta a soporte.
              </div>
            </details>
            <!-- Accordion Item 4 -->
            <details
              class="flex flex-col rounded-xl border border-[#dce0e5] dark:border-[#3b4754] bg-white dark:bg-background-dark px-[15px] py-2 group shadow-sm"
            >
              <summary
                class="flex cursor-pointer items-center justify-between gap-6 py-3"
              >
                <p
                  class="text-[#111418] dark:text-white text-base font-semibold leading-normal"
                >
                  ¿Cómo agendo una cita?
                </p>
                <span
                  class="material-symbols-outlined text-[#637588] dark:text-white group-open:rotate-180 transition-transform duration-300"
                  >expand_more</span
                >
              </summary>
              <div
                class="text-[#637588] dark:text-[#9dabb9] text-sm font-normal leading-relaxed pb-4 pt-1 pr-4 border-t border-transparent group-open:border-[#e5e7eb] dark:group-open:border-[#283039] transition-all"
              >
                Navega a la sección "Calendario", selecciona un día disponible y
                elige el horario que mejor te convenga. Recibirás una
                confirmación por correo electrónico.
              </div>
            </details>
          </div>
        </div>
        <!-- Right Column: Contact Form (Takes up 5 cols on desktop) -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <h2
            class="text-[#111418] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]"
          >
            Contactar Soporte
          </h2>
          <div
            class="flex mb-2 flex-col rounded-xl border border-[#dce0e5] dark:border-[#3b4754] bg-white dark:bg-slate-800 p-6 shadow-md"
          >
            <form class="flex flex-col gap-4">
              <div class="flex flex-col gap-1">
                <label
                  class="text-[#111418] dark:text-white text-sm font-medium leading-normal"
                  >Nombre completo</label
                >
                <input
                  class="w-full rounded-lg border border-[#dce0e5] dark:border-[#3b4754] bg-transparent p-[12px] text-[#111418] dark:text-white placeholder:text-[#637588] dark:placeholder:text-[#9dabb9] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  placeholder="Tu nombre"
                  type="text"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label
                  class="text-[#111418] dark:text-white text-sm font-medium leading-normal"
                  >Correo electrónico</label
                >
                <input
                  class="w-full rounded-lg border border-[#dce0e5] dark:border-[#3b4754] bg-transparent p-[12px] text-[#111418] dark:text-white placeholder:text-[#637588] dark:placeholder:text-[#9dabb9] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  placeholder="ejemplo@correo.com"
                  type="email"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label
                  class="text-[#111418] dark:text-white text-sm font-medium leading-normal"
                  >Mensaje</label
                >
                <textarea
                  class="w-full rounded-lg border border-[#dce0e5] dark:border-[#3b4754] bg-transparent p-[12px] text-[#111418] dark:text-white placeholder:text-[#637588] dark:placeholder:text-[#9dabb9] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none transition-all"
                  placeholder="Describe tu problema..."
                  rows="4"
                ></textarea>
              </div>
              <button
                class="mt-2 flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-600 transition-colors"
              >
                Enviar Mensaje
              </button>
            </form>
            <div
              class="mt-6 pt-6 border-t border-[#dce0e5] dark:border-[#3b4754] flex flex-col gap-4"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex items-center justify-center rounded-full bg-primary/10 size-10 text-primary"
                >
                  <span class="material-symbols-outlined">chat</span>
                </div>
                <div class="flex flex-col">
                  <p class="text-[#111418] dark:text-white text-sm font-bold">
                    Chat en vivo
                  </p>
                  <a
                    class="text-primary text-xs font-medium hover:underline"
                    href="#"
                    >Iniciar conversación</a
                  >
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div
                  class="flex items-center justify-center rounded-full bg-primary/10 size-10 text-primary"
                >
                  <span class="material-symbols-outlined">call</span>
                </div>
                <div class="flex flex-col">
                  <p class="text-[#111418] dark:text-white text-sm font-bold">
                    Llámanos
                  </p>
                  <p
                    class="text-[#637588] dark:text-[#9dabb9] text-xs font-medium"
                  >
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <AppFooter />
</template>
