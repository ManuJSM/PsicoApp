<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useMeStore } from '@/stores/me.store'
  import MainSeguridad from './components/MainSeguridad.vue'
  import type { User } from '@/types/types'
  import MainInfo from './components/MainInfo.vue'

  const meStore = useMeStore()
  const activeTab = ref<'personal' | 'security'>('personal')
  const showPhotoModal = ref(false)

  const userCopy = ref<User>()

  onMounted(async () => {
    await meStore.fetchMe()
    if (meStore.me) {
      userCopy.value = { ...meStore.me }
    }
  })

  const handleSave = () => {
    console.log('Guardando usuario:', userCopy.value)
    // meStore.updateUser(userCopy.value)
  }

  const handleCancel = () => {
    if (meStore.me) {
      userCopy.value = { ...meStore.me }
    }
  }

  const handlePhotoChange = (action: 'upload' | 'delete') => {
    if (action === 'delete' && userCopy.value) {
      userCopy.value.avatar = ''
    } else if (action === 'upload') {
      // Aquí iría la lógica de subir archivo
      console.log('Subir nueva foto')
    }
    showPhotoModal.value = false
  }
</script>

<template>
  <div class="flex h-full min-h-0 w-full flex-col">
    <div class="flex-1 flex h-full flex-col md:flex-row">
      <!-- Sidebar para desktop -->
      <aside
        class="hidden md:flex flex-col h-full md:w-72 lg:w-80 xl:w-96 border-r border-slate-700/50 p-6 bg-card-dark"
      >
        <div class="flex flex-col gap-4">
          <!-- Header con ícono decorativo -->
          <div class="flex items-center gap-3 mb-2">
            <div class="h-8 w-1 bg-primary rounded-full"></div>
            <h2 class="text-white text-2xl font-bold bg-clip-text">
              Mi Perfil
            </h2>
          </div>

          <!-- Foto de perfil en sidebar -->
          <div
            class="flex flex-col items-center gap-4 pb-6 border-b border-slate-700/30"
            v-if="userCopy"
          >
            <div class="relative group">
              <div
                class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-28 w-28 ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 shadow-xl cursor-pointer"
                :style="{
                  backgroundImage: `url(${meStore.me?.avatar})`,
                }"
                @click="showPhotoModal = true"
              >
                <div
                  class="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <span class="material-symbols-outlined text-white text-3xl"
                    >photo_camera</span
                  >
                </div>
              </div>
            </div>
            <div class="text-center">
              <p class="text-white font-semibold text-lg">
                {{ meStore.me?.fullName }}
              </p>
              <p
                class="text-slate-400 text-sm flex items-center justify-center gap-1"
              >
                <span class="material-symbols-outlined text-xs">email</span>
                {{ meStore.me?.email }}
              </p>
            </div>

            <!-- Botón cambiar foto en sidebar -->
            <button
              @click="showPhotoModal = true"
              class="flex items-center justify-center rounded-lg h-9 px-4 bg-linear-to-r from-slate-700 to-slate-600 text-white text-xs font-medium hover:from-slate-600 hover:to-slate-500 transition-all duration-300 mt-2 shadow-lg cursor-pointer"
            >
              <span class="material-symbols-outlined text-base mr-2"
                >photo_camera</span
              >
              <span class="truncate">Actualizar foto</span>
            </button>
          </div>

          <!-- Navegación sidebar -->
          <nav class="flex flex-col gap-2 mt-2">
            <a
              :class="[
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer',
                activeTab === 'personal'
                  ? 'bg-linear-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/30'
                  : 'text-slate-300 hover:bg-slate-700/50',
              ]"
              @click.prevent="activeTab = 'personal'"
            >
              <span class="material-symbols-outlined">person</span>
              <span class="font-medium">Información Personal</span>
              <span
                v-if="activeTab === 'personal'"
                class="material-symbols-outlined ml-auto text-sm"
                >chevron_right</span
              >
            </a>
            <a
              :class="[
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer',
                activeTab === 'security'
                  ? 'bg-linear-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/30'
                  : 'text-slate-300 hover:bg-slate-700/50',
              ]"
              @click.prevent="activeTab = 'security'"
            >
              <span class="material-symbols-outlined">security</span>
              <span class="font-medium">Seguridad</span>
              <span
                v-if="activeTab === 'security'"
                class="material-symbols-outlined ml-auto text-sm"
                >chevron_right</span
              >
            </a>
          </nav>
        </div>
      </aside>

      <main class="flex-1 px-4 sm:px-8 py-6 overflow-y-auto">
        <div
          class="layout-content-container flex flex-col w-full max-w-3xl mx-auto"
        >
          <!-- Header para móvil/tablet -->
          <div class="block md:hidden mb-6">
            <div
              class="flex flex-col gap-4 p-4 bg-linear-to-r from-primary/10 to-transparent rounded-2xl"
            >
              <p
                class="text-white text-3xl sm:text-4xl font-black leading-tight"
              >
                Mi Perfil
              </p>
              <div class="border-b border-slate-700">
                <nav class="-mb-px flex space-x-8">
                  <a
                    href="#"
                    :class="[
                      'whitespace-nowrap border-b-2 px-1 py-3 text-sm sm:text-base font-bold transition-all duration-300 cursor-pointer',
                      activeTab === 'personal'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-slate-400 hover:border-slate-500 hover:text-slate-300',
                    ]"
                    @click.prevent="activeTab = 'personal'"
                  >
                    Información Personal
                  </a>
                  <a
                    href="#"
                    :class="[
                      'whitespace-nowrap border-b-2 px-1 py-3 text-sm sm:text-base font-medium transition-all duration-300 cursor-pointer',
                      activeTab === 'security'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-slate-400 hover:border-slate-500 hover:text-slate-300',
                    ]"
                    @click.prevent="activeTab = 'security'"
                  >
                    Seguridad
                  </a>
                </nav>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'personal' && userCopy">
            <!-- Sección de foto para móvil -->
            <div
              class="flex p-6 @container mt-2 md:hidden bg-slate-800/30 rounded-2xl backdrop-blur-sm"
            >
              <div class="flex w-full flex-col gap-4 items-center">
                <div class="flex gap-6 flex-col items-center">
                  <div
                    class="relative group cursor-pointer"
                    @click="showPhotoModal = true"
                  >
                    <div
                      class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 ring-4 ring-primary/20 shadow-xl transition-all duration-300 group-hover:ring-primary/40"
                      :style="{
                        backgroundImage: `url(${meStore.me?.avatar})`,
                      }"
                    >
                      <div
                        class="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <span
                          class="material-symbols-outlined text-white text-3xl"
                          >photo_camera</span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col items-center justify-center">
                    <p
                      class="text-white text-xl sm:text-2xl font-bold text-center"
                    >
                      {{ meStore.me?.fullName }}
                    </p>
                    <p
                      class="text-slate-400 text-sm sm:text-base flex items-center gap-1"
                    >
                      <span class="material-symbols-outlined text-xs"
                        >email</span
                      >
                      {{ meStore.me?.email }}
                    </p>
                  </div>
                </div>
                <button
                  @click="showPhotoModal = true"
                  class="flex items-center justify-center rounded-xl h-11 px-6 bg-linear-to-r from-slate-700 to-slate-600 text-white text-sm font-medium hover:from-slate-600 hover:to-slate-500 transition-all duration-300 w-full max-w-xs shadow-lg hover:scale-105"
                >
                  <span class="material-symbols-outlined text-base mr-2"
                    >photo_camera</span
                  >
                  <span class="truncate">Cambiar foto de perfil</span>
                </button>
              </div>
            </div>
            <MainInfo
              v-model="userCopy"
              @photo-click="showPhotoModal = true"
              @save="handleSave"
              @cancel="handleCancel"
            />

            <div
              class="mt-6 p-4 bg-slate-800/30 rounded-xl backdrop-blur-sm border border-slate-700/30"
            >
              <h3
                class="text-white text-sm font-semibold mb-3 flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-primary text-base"
                  >info</span
                >
                Información de la cuenta
              </h3>
              <div class="flex justify-center md:justify-start gap-8">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-primary text-base"
                    >verified</span
                  >
                  <div>
                    <p class="text-slate-400 text-xs">Estado</p>
                    <p class="text-green-400 text-sm font-medium">
                      Cuenta Activa
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-primary text-base"
                    >calendar_month</span
                  >
                  <div>
                    <p class="text-slate-400 text-xs">Miembro desde</p>
                    <p class="text-white text-sm">Enero 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'security'">
            <MainSeguridad />
          </div>
        </div>
      </main>
    </div>

    <!-- Modal para cambiar foto -->
    <Teleport to="body">
      <div
        v-if="showPhotoModal"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="showPhotoModal = false"
      >
        <div
          class="bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-700"
          @click.stop
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-white text-xl font-bold">Cambiar foto de perfil</h3>
            <button
              @click="showPhotoModal = false"
              class="text-slate-400 hover:text-white transition-colors"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="flex flex-col items-center gap-4 py-4">
            <div
              class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 ring-4 ring-primary/30 shadow-xl"
              :style="{
                backgroundImage: `url(${userCopy?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userCopy?.fullName || '')})`,
              }"
            ></div>

            <div class="flex gap-3 w-full">
              <button
                @click="handlePhotoChange('upload')"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl h-11 bg-slate-700 text-white hover:bg-slate-600 transition-colors hover:scale-105"
              >
                <span class="material-symbols-outlined">upload</span>
                Subir foto
              </button>
              <button
                @click="handlePhotoChange('delete')"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl h-11 bg-slate-700 text-white hover:bg-red-600/80 transition-colors hover:scale-105"
              >
                <span class="material-symbols-outlined">delete</span>
                Eliminar
              </button>
            </div>

            <p class="text-slate-400 text-xs mt-2">
              Recomendado: imagen cuadrada, mínimo 400x400px
            </p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
