<script setup lang="ts">
  import { ref } from 'vue'

  // Estado para los acordeones
  const openSections = ref({
    password: false,
    twoFactor: false,
    activity: false,
    devices: false,
  })

  // Estado para el formulario de cambio de contraseña
  const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Estado para 2FA
  const twoFactorEnabled = ref(true)

  // Función para alternar secciones
  const toggleSection = (section: keyof typeof openSections.value) => {
    openSections.value[section] = !openSections.value[section]
  }

  // Función para cambiar contraseña
  const handlePasswordChange = () => {
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    console.log('Cambiando contraseña...', passwordForm.value)
    // Aquí iría la lógica de cambio de contraseña
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
    openSections.value.password = false
  }

  // Función para desactivar 2FA
  const handleDisable2FA = () => {
    if (
      confirm(
        '¿Estás seguro de que quieres desactivar la autenticación de dos factores?'
      )
    ) {
      twoFactorEnabled.value = false
      openSections.value.twoFactor = false
      console.log('2FA desactivado')
    }
  }

  // Función para cerrar sesión en otros dispositivos
  const handleLogoutOthers = () => {
    if (
      confirm(
        '¿Estás seguro de que quieres cerrar sesión en todos los demás dispositivos?'
      )
    ) {
      console.log('Cerrando sesión en otros dispositivos...')
      openSections.value.devices = false
    }
  }
</script>

<template>
  <section class="bg-slate-800/20 rounded-xl mt-6">
    <div class="divide-y divide-slate-700/50">
      <!-- Sección Cambiar Contraseña (Acordeón) -->
      <div>
        <button
          class="flex w-full items-center justify-between p-4 sm:p-6 hover:bg-slate-700/20 transition-colors duration-200 rounded-t-xl"
          type="button"
          @click="toggleSection('password')"
        >
          <div class="flex items-center gap-4">
            <span class="material-symbols-outlined text-slate-300">lock</span>
            <div>
              <p
                class="text-white text-base font-medium leading-normal text-left"
              >
                Cambiar contraseña
              </p>
            </div>
          </div>
          <span
            class="material-symbols-outlined text-slate-400 transition-transform duration-300 ease-in-out"
            :class="{
              'rotate-180': openSections.password,
            }"
          >
            expand_more
          </span>
        </button>

        <!-- Contenido del acordeón de contraseña con transición Tailwind -->
        <div
          class="overflow-hidden transition-all duration-300 ease-in-out"
          :class="
            openSections.password ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          "
        >
          <div class="px-4 sm:px-6 pb-6 pt-4 border-t border-slate-700/50">
            <div class="space-y-4">
              <div>
                <label
                  class="text-slate-300 text-sm font-medium block"
                  for="current-password"
                >
                  Contraseña Actual
                </label>
                <input
                  class="block w-full mt-1 bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  id="current-password"
                  type="password"
                  v-model="passwordForm.currentPassword"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label
                  class="text-slate-300 text-sm font-medium block"
                  for="new-password"
                >
                  Nueva Contraseña
                </label>
                <input
                  class="block w-full mt-1 bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  id="new-password"
                  type="password"
                  v-model="passwordForm.newPassword"
                  placeholder="••••••••"
                />
                <p class="text-slate-400 text-xs mt-1">
                  Mínimo 8 caracteres, incluye mayúscula y número
                </p>
              </div>
              <div>
                <label
                  class="text-slate-300 text-sm font-medium block"
                  for="confirm-password"
                >
                  Confirmar Nueva Contraseña
                </label>
                <input
                  class="block w-full mt-1 bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  id="confirm-password"
                  type="password"
                  v-model="passwordForm.confirmPassword"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div class="mt-6 flex justify-end gap-3">
              <button
                @click="openSections.password = false"
                class="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-700 text-white text-sm font-bold hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                @click="handlePasswordChange"
                class="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Autenticación de dos factores (Acordeón) -->
      <div>
        <button
          class="flex w-full items-center justify-between p-4 sm:p-6 hover:bg-slate-700/20 transition-colors duration-200"
          type="button"
          @click="toggleSection('twoFactor')"
        >
          <div class="flex items-center gap-4">
            <span class="material-symbols-outlined text-slate-300"
              >verified_user</span
            >
            <div>
              <p
                class="text-white text-base font-medium leading-normal text-left"
              >
                Autenticación de dos factores
              </p>
              <p
                class="text-slate-400 text-sm font-normal leading-normal text-left"
              >
                Añade una capa extra de seguridad a tu cuenta.
                <span class="text-green-400 font-medium" v-if="twoFactorEnabled"
                  >Activado</span
                >
                <span class="text-slate-400 font-medium" v-else
                  >Desactivado</span
                >
              </p>
            </div>
          </div>
          <span
            class="material-symbols-outlined text-slate-400 transition-transform duration-300 ease-in-out"
            :class="{
              'rotate-180': openSections.twoFactor,
            }"
          >
            expand_more
          </span>
        </button>

        <!-- Contenido del acordeón de 2FA con transición Tailwind -->
        <div
          class="overflow-hidden transition-all duration-300 ease-in-out"
          :class="
            openSections.twoFactor
              ? 'max-h-96 opacity-100'
              : 'max-h-0 opacity-0'
          "
        >
          <div class="px-4 sm:px-6 pb-6 pt-4 border-t border-slate-700/50">
            <div class="bg-slate-700/30 rounded-lg p-4 mb-4">
              <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary"
                  >security</span
                >
                <div>
                  <p class="text-white text-sm font-medium">¿Cómo funciona?</p>
                  <p class="text-slate-400 text-xs mt-1">
                    La autenticación de dos factores añade una capa extra de
                    seguridad. Además de tu contraseña, necesitarás un código de
                    verificación de tu teléfono.
                  </p>
                </div>
              </div>
            </div>

            <div v-if="twoFactorEnabled" class="space-y-4">
              <div
                class="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-green-400"
                    >check_circle</span
                  >
                  <div>
                    <p class="text-white text-sm font-medium">2FA activado</p>
                    <p class="text-slate-400 text-xs">
                      Número de teléfono verificado: +34 *** *** 789
                    </p>
                  </div>
                </div>
                <button class="text-sm text-primary hover:underline">
                  Cambiar
                </button>
              </div>

              <div class="flex justify-end">
                <button
                  @click="handleDisable2FA"
                  class="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 text-sm font-medium hover:bg-red-600/30 transition-colors border border-red-600/30"
                >
                  Desactivar 2FA
                </button>
              </div>
            </div>

            <div v-else class="space-y-4">
              <p class="text-slate-300 text-sm">
                Para activar la autenticación de dos factores, sigue estos
                pasos:
              </p>
              <ol
                class="list-decimal list-inside text-slate-400 text-sm space-y-2"
              >
                <li>
                  Descarga una app de autenticación (Google Authenticator,
                  Authy, etc.)
                </li>
                <li>Escanea el código QR que aparecerá</li>
                <li>Ingresa el código de verificación</li>
              </ol>
              <button
                class="mt-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition-colors"
              >
                Configurar 2FA
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Actividad de la cuenta (Acordeón) -->
      <div>
        <button
          class="flex w-full items-center justify-between p-4 sm:p-6 hover:bg-slate-700/20 transition-colors duration-200"
          type="button"
          @click="toggleSection('activity')"
        >
          <div class="flex items-center gap-4">
            <span class="material-symbols-outlined text-slate-300"
              >history</span
            >
            <div>
              <p
                class="text-white text-base font-medium leading-normal text-left"
              >
                Actividad de la cuenta
              </p>
              <p
                class="text-slate-400 text-sm font-normal leading-normal text-left"
              >
                Revisa los inicios de sesión recientes y la actividad de tu
                cuenta.
              </p>
            </div>
          </div>
          <span
            class="material-symbols-outlined text-slate-400 transition-transform duration-300 ease-in-out"
            :class="{
              'rotate-180': openSections.activity,
            }"
          >
            expand_more
          </span>
        </button>

        <!-- Contenido del acordeón de actividad con transición Tailwind -->
        <div
          class="overflow-hidden transition-all duration-300 ease-in-out"
          :class="
            openSections.activity ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          "
        >
          <div class="px-4 sm:px-6 pb-6 pt-4 border-t border-slate-700/50">
            <div class="space-y-4">
              <div
                class="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-primary"
                    >laptop</span
                  >
                  <div>
                    <p class="text-white text-sm font-medium">
                      Inicio de sesión actual
                    </p>
                    <p class="text-slate-400 text-xs">
                      Madrid, España · Chrome en Windows
                    </p>
                  </div>
                </div>
                <span class="text-xs text-green-400">Activo ahora</span>
              </div>

              <div
                class="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-slate-400"
                    >phone_iphone</span
                  >
                  <div>
                    <p class="text-white text-sm font-medium">iPhone 14 Pro</p>
                    <p class="text-slate-400 text-xs">
                      Barcelona, España · Hace 2 días
                    </p>
                  </div>
                </div>
              </div>

              <div
                class="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-slate-400"
                    >laptop</span
                  >
                  <div>
                    <p class="text-white text-sm font-medium">MacBook Pro</p>
                    <p class="text-slate-400 text-xs">
                      Valencia, España · Hace 5 días
                    </p>
                  </div>
                </div>
              </div>

              <button class="text-primary text-sm hover:underline mt-2 block">
                Ver toda la actividad
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Dispositivos conectados (Acordeón) -->
      <div>
        <button
          class="flex w-full items-center justify-between p-4 sm:p-6 hover:bg-slate-700/20 transition-colors duration-200 rounded-b-xl"
          type="button"
          @click="toggleSection('devices')"
        >
          <div class="flex items-center gap-4">
            <span class="material-symbols-outlined text-slate-300"
              >devices</span
            >
            <div>
              <p
                class="text-white text-base font-medium leading-normal text-left"
              >
                Dispositivos conectados
              </p>
              <p
                class="text-slate-400 text-sm font-normal leading-normal text-left"
              >
                Gestiona y cierra la sesión en los dispositivos conectados a tu
                cuenta.
              </p>
            </div>
          </div>
          <span
            class="material-symbols-outlined text-slate-400 transition-transform duration-300 ease-in-out"
            :class="{
              'rotate-180': openSections.devices,
            }"
          >
            expand_more
          </span>
        </button>

        <!-- Contenido del acordeón de dispositivos con transición Tailwind -->
        <div
          class="overflow-hidden transition-all duration-300 ease-in-out"
          :class="
            openSections.devices ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          "
        >
          <div class="px-4 sm:px-6 pb-6 pt-4 border-t border-slate-700/50">
            <div class="space-y-4">
              <div
                class="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-green-400"
                    >laptop</span
                  >
                  <div>
                    <p class="text-white text-sm font-medium">
                      Este dispositivo
                    </p>
                    <p class="text-slate-400 text-xs">
                      Chrome · Windows · Madrid
                    </p>
                  </div>
                </div>
                <span
                  class="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full"
                  >Actual</span
                >
              </div>

              <div
                class="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-slate-400"
                    >phone_iphone</span
                  >
                  <div>
                    <p class="text-white text-sm font-medium">iPhone 14 Pro</p>
                    <p class="text-slate-400 text-xs">
                      iOS 17 · Último acceso: hace 2 días
                    </p>
                  </div>
                </div>
                <button class="text-sm text-red-400 hover:text-red-300">
                  <span class="material-symbols-outlined text-base"
                    >logout</span
                  >
                </button>
              </div>

              <div
                class="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-slate-400"
                    >laptop</span
                  >
                  <div>
                    <p class="text-white text-sm font-medium">MacBook Pro</p>
                    <p class="text-slate-400 text-xs">
                      Safari · Último acceso: hace 5 días
                    </p>
                  </div>
                </div>
                <button class="text-sm text-red-400 hover:text-red-300">
                  <span class="material-symbols-outlined text-base"
                    >logout</span
                  >
                </button>
              </div>

              <div class="flex justify-end mt-4">
                <button
                  @click="handleLogoutOthers"
                  class="px-4 py-2 rounded-lg bg-slate-700 text-white text-sm font-medium hover:bg-slate-600 transition-colors"
                >
                  Cerrar sesión en otros dispositivos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
