<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useMeStore } from '@/stores/me.store'
  import MainSeguridad from './components/MainSeguridad.vue'
  import { ToastType, type UpdateUser, type User } from '@/types/types'
  import MainInfo from './components/MainInfo.vue'
  import { updateProfile } from '@/api/SleepData/me.api'
  import { useToast } from '@/composables/useToast'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth.store'

  const meStore = useMeStore()
  const activeTab = ref<'personal' | 'security'>('personal')
  const showPhotoModal = ref(false)
  const toast = useToast()

  const userCopy = ref<UpdateUser>({
    fullName: '',
    email: '',
    phone: '',
    avatar: null,
  })

  onMounted(async () => {
    await meStore.fetchMe()
    if (meStore.me) {
      const { avatar, fullName, email, phone } = meStore.me
      userCopy.value = { fullName, email, phone, avatar }
    }
  })
  const router = useRouter()
  const authStore = useAuthStore()
  const handleLogout = async () => {
    await authStore.logout()
    router.push('/')
  }

  const handleSave = async () => {
    console.log('Guardando usuario:', userCopy.value)
    const updated = await updateProfile({
      fullName: userCopy.value.fullName,
      email: userCopy.value.email,
      phone: userCopy.value.phone,
      avatar: userCopy.value.avatar,
    })
    if (updated) {
      meStore.reset()
      await meStore.fetchMe()
      toast.setToast(ToastType.SUCCESS, 'Perfil actualizado correctamente')
    } else {
      toast.setToast(ToastType.ERROR, 'Error al actualizar el perfil')
      handleCancel()
    }

    console.log(updated)
  }

  const handleCancel = () => {
    if (meStore.me) {
      const { avatar, fullName, email, phone } = meStore.me
      userCopy.value = { fullName, email, phone, avatar }
    }
  }

  const handlePhotoChange = async (action: 'upload' | 'delete') => {
    if (action === 'delete') {
      userCopy.value.avatar = null
    }
    handleSave()
    showPhotoModal.value = false
  }
</script>
<template>
  <div class="flex h-full min-h-0 w-full flex-col bg-background-dark">
    <div class="flex-1 flex h-full flex-col md:flex-row">
      <aside
        class="hidden md:flex flex-col h-full md:w-72 lg:w-80 border-r border-border-dark p-6 bg-card-dark"
      >
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3 mb-6">
            <div
              class="h-6 w-1 bg-primary rounded-full shadow-[0_0_10px_#137fec]"
            ></div>
            <h2 class="text-white text-xl font-black uppercase tracking-widest">
              Mi Perfil
            </h2>
          </div>

          <div
            class="flex flex-col items-center gap-4 pb-8 border-b border-border-dark/50"
            v-if="userCopy"
          >
            <div
              class="relative group cursor-pointer"
              @click="showPhotoModal = true"
            >
              <div
                class="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl h-28 w-28 ring-2 ring-border-dark transition-all duration-300 shadow-2xl group-hover:ring-primary/50"
                :style="{ backgroundImage: `url(${meStore.me?.avatar})` }"
              >
                <div
                  class="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]"
                >
                  <span class="material-symbols-outlined text-white text-3xl"
                    >photo_camera</span
                  >
                </div>
              </div>
            </div>

            <div class="text-center">
              <p class="text-white font-bold text-lg leading-tight">
                {{ meStore.me?.fullName }}
              </p>
              <p
                class="text-slate-500 text-xs font-medium mt-1 flex items-center justify-center gap-1"
              >
                <span class="material-symbols-outlined text-[14px]">mail</span>
                {{ meStore.me?.email }}
              </p>
            </div>
          </div>

          <nav class="flex flex-col gap-2 mt-6">
            <button
              v-for="tab in ['personal', 'security']"
              :key="tab"
              @click="activeTab = tab as any"
              :class="[
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border',
                activeTab === tab
                  ? 'bg-primary/10 border-primary/30 text-white shadow-[0_0_15px_rgba(19,127,236,0.1)]'
                  : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200',
              ]"
            >
              <span class="material-symbols-outlined">{{
                tab === 'personal' ? 'person' : 'security'
              }}</span>
              <span class="font-bold text-sm uppercase tracking-wider">{{
                tab === 'personal' ? 'Información' : 'Seguridad'
              }}</span>
              <span
                v-if="activeTab === tab"
                class="material-symbols-outlined ml-auto text-sm text-primary"
                >circle</span
              >
            </button>
          </nav>
        </div>

        <div class="mt-auto pt-6 border-t border-border-dark/50">
          <button
            @click="handleLogout"
            class="flex items-center justify-center gap-3 w-full rounded-xl px-4 py-3 bg-red-500/5 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-widest"
          >
            <span class="material-symbols-outlined text-sm">logout</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main
        class="flex-1 px-4 sm:px-10 py-8 md:overflow-y-auto bg-background-dark"
      >
        <div class="w-full max-w-2xl mx-auto">
          <div class="md:hidden flex flex-col items-center gap-4 mb-4">
            <div
              class="h-24 w-24 rounded-2xl bg-center bg-cover border-2 border-border-dark"
              :style="{ backgroundImage: `url(${meStore.me?.avatar})` }"
              @click="showPhotoModal = true"
            ></div>
            <div class="text-center">
              <p class="text-white font-black uppercase tracking-widest">
                {{ meStore.me?.fullName }}
              </p>
            </div>

            <button
              @click="handleLogout"
              class="md:hidden mb-8 flex items-center justify-center gap-2 w-full py-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60"
            >
              <span class="material-symbols-outlined text-sm">logout</span>
              Cerrar Sesión
            </button>
          </div>

          <div
            class="md:hidden flex p-1 bg-card-dark border border-border-dark rounded-xl mb-4"
          >
            <button
              v-for="tab in ['personal', 'security']"
              :key="tab"
              @click="activeTab = tab as any"
              :class="[
                'flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all',
                activeTab === tab
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-500',
              ]"
            >
              {{ tab === 'personal' ? 'Perfil' : 'Seguridad' }}
            </button>
          </div>

          <div
            v-if="activeTab === 'personal' && userCopy"
            class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <MainInfo
              v-model="userCopy"
              @photo-click="showPhotoModal = true"
              @save="handleSave"
              @cancel="handleCancel"
            />

            <div
              class="p-6 bg-card-dark rounded-2xl border border-border-dark relative group"
            >
              <div class="absolute top-0 left-0 w-1 bg-primary/50"></div>
              <h3
                class="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-primary text-lg"
                  >verified_user</span
                >
                Metadatos de la cuenta
              </h3>

              <div class="grid grid-cols-2 gap-8">
                <div class="space-y-1">
                  <p class="text-slate-500 text-[10px] font-bold uppercase">
                    Estado
                  </p>
                  <p
                    class="text-emerald-400 text-sm font-black flex items-center gap-1"
                  >
                    <span
                      class="size-1.5 rounded-full bg-emerald-400 animate-pulse"
                    ></span>
                    ACTIVA
                  </p>
                </div>
                <div class="space-y-1">
                  <p class="text-slate-500 text-[10px] font-bold uppercase">
                    Miembro desde
                  </p>
                  <p class="text-white text-sm font-black">ENERO 2024</p>
                </div>
              </div>
            </div>
          </div>

          <div
            v-else-if="activeTab === 'security'"
            class="animate-in fade-in duration-500"
          >
            <MainSeguridad />
          </div>
        </div>
      </main>
    </div>

    <Teleport to="body">
      <div
        v-if="showPhotoModal"
        class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-card-dark rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-border-dark animate-in zoom-in-95 duration-200"
        >
          <div class="text-center space-y-4">
            <h3 class="text-white text-xl font-black uppercase tracking-tight">
              Imagen de Perfil
            </h3>

            <div
              class="mx-auto bg-center bg-cover rounded-3xl h-40 w-40 ring-4 ring-primary/20 shadow-2xl"
              :style="{ backgroundImage: `url(${meStore.me?.avatar})` }"
            ></div>

            <div class="pt-4 space-y-3">
              <input
                type="url"
                v-model="userCopy.avatar"
                class="w-full bg-black/40 border border-border-dark rounded-xl px-4 py-3 text-white text-sm focus:border-primary transition-all outline-none"
                placeholder="Pega la URL de tu imagen..."
              />

              <div class="flex gap-2 pt-2">
                <button
                  @click="handlePhotoChange('upload')"
                  class="flex-1 bg-primary text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-xl hover:bg-primary/80 transition-all"
                >
                  Actualizar
                </button>
                <button
                  @click="handlePhotoChange('delete')"
                  class="px-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>

              <button
                @click="showPhotoModal = false"
                class="text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors pt-2"
              >
                Cerrar sin guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
