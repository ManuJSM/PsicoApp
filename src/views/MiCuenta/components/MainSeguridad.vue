<script setup lang="ts">
  import { ref } from 'vue'

  // Estado para el formulario de cambio de contraseña
  const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Estado para 2FA
  const twoFactorEnabled = ref(true)

  const handlePasswordChange = () => {
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    console.log('Cambiando contraseña...', passwordForm.value)
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  }

  const handleDisable2FA = () => {
    if (
      confirm(
        '¿Estás seguro de que quieres desactivar la autenticación de dos factores?'
      )
    ) {
      twoFactorEnabled.value = false
    }
  }

  const handleLogoutOthers = () => {
    if (
      confirm(
        '¿Estás seguro de que quieres cerrar sesión en todos los demás dispositivos?'
      )
    ) {
      console.log('Cerrando sesión en otros dispositivos...')
    }
  }
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto pb-10">
    <div
      class="bg-card-dark rounded-2xl border border-border-dark/30 shadow-xl overflow-hidden"
    >
      <div
        class="px-6 py-5 border-b border-border-dark/30 bg-slate-800/20 flex items-center gap-3"
      >
        <span class="material-symbols-outlined text-primary text-xl">lock</span>
        <h2 class="text-white text-lg font-bold">Cambiar contraseña</h2>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label
              class="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-2"
              >Contraseña Actual</label
            >
            <input
              v-model="passwordForm.currentPassword"
              type="password"
              placeholder="••••••••"
              class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div>
            <label
              class="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-2"
              >Nueva Contraseña</label
            >
            <input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="••••••••"
              class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
            <p class="text-slate-500 text-[11px] mt-2 italic">
              Mínimo 8 caracteres, incluye mayúscula y número
            </p>
          </div>
          <div>
            <label
              class="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-2"
              >Confirmar Nueva Contraseña</label
            >
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="••••••••"
              class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        </div>
        <div class="mt-8 flex justify-end">
          <button
            @click="handlePasswordChange"
            class="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/10"
          >
            Actualizar Contraseña
          </button>
        </div>
      </div>
    </div>

    <div
      class="bg-card-dark rounded-2xl border border-border-dark/30 shadow-xl overflow-hidden"
    >
      <div
        class="px-6 py-5 border-b border-border-dark/30 bg-slate-800/20 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-primary text-xl"
            >verified_user</span
          >
          <h2 class="text-white text-lg font-bold">
            Autenticación de dos factores
          </h2>
        </div>
        <span
          :class="
            twoFactorEnabled
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-slate-700 text-slate-400 border-slate-600'
          "
          class="text-[10px] uppercase font-bold px-2 py-1 rounded border"
        >
          {{ twoFactorEnabled ? 'Protegido' : 'No configurado' }}
        </span>
      </div>

      <div class="p-6">
        <div class="flex flex-col md:flex-row gap-6 items-start">
          <div class="flex-1 space-y-4">
            <p class="text-slate-300 text-sm leading-relaxed">
              La autenticación de dos factores añade una capa extra de
              seguridad. Además de tu contraseña, necesitarás un código de
              verificación.
            </p>

            <div
              v-if="twoFactorEnabled"
              class="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <div
                  class="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center"
                >
                  <span class="material-symbols-outlined text-green-400"
                    >check_circle</span
                  >
                </div>
                <div>
                  <p class="text-white text-sm font-medium">
                    Método activo: SMS
                  </p>
                  <p class="text-slate-500 text-xs">+34 *** *** 789</p>
                </div>
              </div>
              <button class="text-xs text-primary font-bold hover:underline">
                Cambiar
              </button>
            </div>
          </div>

          <div class="w-full md:w-auto">
            <button
              v-if="twoFactorEnabled"
              @click="handleDisable2FA"
              class="w-full px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-colors"
            >
              Desactivar 2FA
            </button>
            <button
              v-else
              class="w-full px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90"
            >
              Configurar Seguridad
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-card-dark rounded-2xl border border-border-dark/30 shadow-xl overflow-hidden"
    >
      <div
        class="px-6 py-5 border-b border-border-dark/30 bg-slate-800/20 flex items-center gap-3"
      >
        <span class="material-symbols-outlined text-primary text-xl"
          >devices</span
        >
        <h2 class="text-white text-lg font-bold">Dispositivos conectados</h2>
      </div>

      <div class="p-0">
        <div class="divide-y divide-border-dark/20">
          <div
            class="px-6 py-4 flex items-center justify-between hover:bg-slate-800/10 transition-colors"
          >
            <div class="flex items-center gap-4">
              <span class="material-symbols-outlined text-slate-400"
                >laptop</span
              >
              <div>
                <div class="flex items-center gap-2">
                  <p class="text-white text-sm font-medium">
                    Chrome en Windows
                  </p>
                  <span
                    class="text-[9px] bg-primary text-white px-1.5 py-0.5 rounded font-bold uppercase"
                    >Actual</span
                  >
                </div>
                <p class="text-slate-500 text-xs">
                  Madrid, España · Activo ahora
                </p>
              </div>
            </div>
          </div>

          <div
            v-for="dev in [
              {
                name: 'iPhone 14 Pro',
                loc: 'Barcelona',
                time: 'hace 2 días',
                icon: 'phone_iphone',
              },
              {
                name: 'MacBook Pro',
                loc: 'Valencia',
                time: 'hace 5 días',
                icon: 'laptop',
              },
            ]"
            :key="dev.name"
            class="px-6 py-4 flex items-center justify-between group"
          >
            <div class="flex items-center gap-4">
              <span
                class="material-symbols-outlined text-slate-500 group-hover:text-slate-400 transition-colors"
                >{{ dev.icon }}</span
              >
              <div>
                <p class="text-white text-sm font-medium">{{ dev.name }}</p>
                <p class="text-slate-500 text-xs">
                  {{ dev.loc }}, España · {{ dev.time }}
                </p>
              </div>
            </div>
            <button
              class="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <span class="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>

        <div
          class="p-6 bg-slate-800/10 border-t border-border-dark/30 flex justify-end"
        >
          <button
            @click="handleLogoutOthers"
            class="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
          >
            Cerrar todas las demás sesiones
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
