<template>
  <div
    class="space-y-8 max-w-4xl mx-auto pb-10 animate-in fade-in duration-500"
  >
    <div
      class="bg-card-dark rounded-2xl border border-border-dark shadow-2xl overflow-hidden"
    >
      <div
        class="px-6 py-4 border-b border-border-dark/50 bg-white/2 flex items-center gap-3"
      >
        <div
          class="h-5 w-1 bg-primary rounded-full shadow-[0_0_10px_#137fec]"
        ></div>
        <h2 class="text-white text-xs font-black uppercase tracking-[0.2em]">
          Seguridad de Acceso
        </h2>
      </div>

      <div class="p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="md:col-span-2 flex flex-col gap-2">
            <label
              class="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1"
              >Contraseña Actual</label
            >
            <input
              v-model="passwordForm.currentPassword"
              type="password"
              placeholder="••••••••••••"
              class="w-full bg-black/40 border border-border-dark rounded-xl px-4 py-3 text-white text-sm focus:border-primary outline-none transition-all"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label
              class="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1"
              >Nueva Contraseña</label
            >
            <input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="••••••••••••"
              class="w-full bg-black/40 border border-border-dark rounded-xl px-4 py-3 text-white text-sm focus:border-primary outline-none transition-all"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label
              class="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1"
              >Confirmar Nueva</label
            >
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="••••••••••••"
              class="w-full bg-black/40 border border-border-dark rounded-xl px-4 py-3 text-white text-sm focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        <div
          class="mt-8 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p
            class="text-slate-600 text-[10px] font-medium leading-tight max-w-[240px]"
          >
            Usa al menos 8 caracteres con una combinación de letras y números.
          </p>
          <div class="flex flex-col items-end gap-2">
            <p
              v-if="errorMessage"
              class="text-rose-400 text-[10px] font-medium"
            >
              {{ errorMessage }}
            </p>
            <p
              v-if="successMessage"
              class="text-emerald-400 text-[10px] font-medium"
            >
              {{ successMessage }}
            </p>
            <button
              @click="handlePasswordChange"
              :disabled="isLoading"
              class="px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 active:scale-95 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Actualizando...' : 'Actualizar Credenciales' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-card-dark rounded-2xl border border-border-dark shadow-2xl overflow-hidden relative"
    >
      <div
        class="px-6 py-4 border-b border-border-dark/50 bg-white/2 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div
            class="h-5 w-1 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"
          ></div>
          <h2 class="text-white text-xs font-black uppercase tracking-[0.2em]">
            Doble Factor (2FA)
          </h2>
        </div>
        <div
          :class="[
            'text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md border animate-pulse',
            twoFactorEnabled
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          ]"
        >
          {{ twoFactorEnabled ? 'SISTEMA PROTEGIDO' : 'VULNERABLE' }}
        </div>
      </div>

      <div class="p-8">
        <div class="flex flex-col gap-8 items-center">
          <div class="flex-1">
            <p class="text-slate-400 text-sm leading-relaxed font-medium">
              Añade una capa de blindaje adicional. Al iniciar sesión, se te
              solicitará un código único enviado a tu dispositivo de confianza.
            </p>

            <div
              v-if="twoFactorEnabled"
              class="mt-6 flex items-center gap-4 p-4 rounded-2xl bg-white/3 border border-white/5"
            >
              <div
                class="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400"
              >
                <span class="material-symbols-outlined">phonelink_lock</span>
              </div>
              <div>
                <p
                  class="text-white text-xs font-bold uppercase tracking-tight"
                >
                  Método SMS activo
                </p>
                <p class="text-slate-500 text-[11px] font-mono">
                  +34 ••• ••• 789
                </p>
              </div>
              <button
                class="ml-auto text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest"
              >
                Cambiar
              </button>
            </div>
          </div>

          <button
            v-if="twoFactorEnabled"
            @click="handleDisable2FA"
            class="w-full md:w-auto px-6 py-3 border border-rose-500/30 text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-white transition-all"
          >
            Desactivar Blindaje
          </button>
          <button
            v-else
            class="w-full md:w-auto px-6 py-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
          >
            Configurar 2FA
          </button>
        </div>
      </div>
    </div>

    <div
      class="bg-card-dark rounded-2xl border border-border-dark shadow-2xl overflow-hidden"
    >
      <div
        class="px-6 py-4 border-b border-border-dark/50 bg-white/2 flex items-center gap-3"
      >
        <div
          class="h-5 w-1 bg-primary rounded-full shadow-[0_0_10px_#137fec]"
        ></div>
        <h2 class="text-white text-xs font-black uppercase tracking-[0.2em]">
          Sesiones Activas
        </h2>
      </div>

      <div class="divide-y divide-border-dark/50">
        <div class="px-8 py-5 flex items-center justify-between bg-primary/5">
          <div class="flex items-center gap-5">
            <span class="material-symbols-outlined text-primary text-2xl"
              >laptop_mac</span
            >
            <div>
              <div class="flex items-center gap-2">
                <p
                  class="text-white text-sm font-bold uppercase tracking-tight"
                >
                  Chrome en Windows
                </p>
                <span
                  class="text-[8px] bg-primary text-white px-1.5 py-0.5 rounded font-black uppercase"
                  >ESTA SESIÓN</span
                >
              </div>
              <p class="text-slate-500 text-xs mt-0.5 font-medium">
                Madrid, España • Activo ahora
              </p>
            </div>
          </div>
        </div>

        <div
          v-for="dev in devices"
          :key="dev.name"
          class="px-8 py-5 flex items-center justify-between hover:bg-white/2 transition-colors group"
        >
          <div class="flex items-center gap-5">
            <span
              class="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors text-2xl"
              >{{ dev.icon }}</span
            >
            <div>
              <p
                class="text-slate-200 text-sm font-bold uppercase tracking-tight"
              >
                {{ dev.name }}
              </p>
              <p class="text-slate-600 text-xs mt-0.5 font-medium">
                {{ dev.loc }} • {{ dev.time }}
              </p>
            </div>
          </div>
          <button
            class="size-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
          >
            <span class="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </div>

      <div
        class="p-6 bg-black/20 flex justify-center border-t border-border-dark/50"
      >
        <button
          @click="handleLogoutOthers"
          class="text-[10px] font-black text-slate-500 hover:text-rose-400 transition-colors uppercase tracking-[0.2em]"
        >
          Cerrar todas las demás sesiones
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { changePassword } from '@/api/SleepData/me.api'

  const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const isLoading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

  const twoFactorEnabled = ref(true)

  const devices = ref([
    {
      name: 'iPhone 14 Pro',
      loc: 'Barcelona, España',
      time: 'Hace 2 días',
      icon: 'smartphone',
    },
    {
      name: 'MacBook Pro 16',
      loc: 'Valencia, España',
      time: 'Hace 5 días',
      icon: 'laptop',
    },
  ])

  const handlePasswordChange = async () => {
    errorMessage.value = ''
    successMessage.value = ''

    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      errorMessage.value = 'Las contraseñas no coinciden'
      return
    }

    if (passwordForm.value.newPassword.length < 8) {
      errorMessage.value = 'La contraseña debe tener al menos 8 caracteres'
      return
    }

    isLoading.value = true

    try {
      await changePassword(
        passwordForm.value.currentPassword,
        passwordForm.value.newPassword
      )
      successMessage.value = 'Contraseña actualizada correctamente'
      passwordForm.value.currentPassword = ''
      passwordForm.value.newPassword = ''
      passwordForm.value.confirmPassword = ''
    } catch {
      errorMessage.value =
        'Error al cambiar la contraseña. Verifica que la contraseña actual sea correcta.'
    } finally {
      isLoading.value = false
    }
  }

  const handleDisable2FA = () => {
    twoFactorEnabled.value = false
  }

  const handleLogoutOthers = () => {
    console.log('Logging out from other devices')
  }
</script>

<style scoped>
  .material-symbols-outlined {
    font-variation-settings:
      'FILL' 0,
      'wght' 300,
      'GRAD' 0,
      'opsz' 24;
  }
</style>
