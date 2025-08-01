<template>
  <header class="bg-white shadow px-6 py-4 flex justify-between items-center">
    <!-- Logo -->
    <div class="flex items-center gap-1">
      <CalendarDaysIcon class="h-6 w-6 text-blue-600" />
      <span class="text-xl font-bold text-blue-600">Med</span>
      <span class="text-xl font-bold text-gray-800">Agenda</span>
    </div>


    <!-- Menu central -->
    <nav>
      <ul class="flex items-center space-x-6 text-sm font-medium text-gray-700">
        <li>
          <NuxtLink
            to="/dashboard"
            :class="[
              'transition',
              ($route.path.startsWith('/dashboard') || $route.path.startsWith('/agendas'))
                ? 'text-blue-600 font-semibold'
                : 'hover:text-blue-600'
            ]"
          >
            Início
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/profissionais"
            :class="[
              'transition',
              $route.path.startsWith('/profissionais') ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
            ]"
          >
            Profissionais
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/especialidades"
            :class="[
              'transition',
              $route.path.startsWith('/especialidades') ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
            ]"
          >
            Especialidades
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/relatorios"
            :class="[
              'transition',
              $route.path.startsWith('/relatorios') ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
            ]"
          >
            Relatórios
          </NuxtLink>
        </li>
      </ul>
</nav>

    <!-- Usuário logado -->
    <div class="relative">
      <div class="flex items-center gap-3 cursor-pointer" @click="dropdownOpen = !dropdownOpen">
        
        <!-- Avatar e nome -->
        <div class="flex items-center gap-3 cursor-pointer" @click="dropdownOpen = !dropdownOpen">
          <div
            class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm uppercase"
          >
            <template v-if="user?.nome">
              {{ getIniciais(user.nome) }}
            </template>
            <template v-else>
              <UserIcon class="h-5 w-5 text-blue-600" />
            </template>
          </div>
        </div>

        <!-- Nome e tipo -->
        <div class="text-sm text-left">
          <p class="font-semibold text-gray-800">{{ user?.nome || 'Usuário' }}</p>
          <p class="text-xs text-gray-500">
            <template v-if="isUserLoaded">{{ user?.tipo || 'Perfil' }}</template>
            <template v-else>Perfil</template>
          </p>

        </div>
      </div>

      <!-- Dropdown -->
      <div
        v-if="dropdownOpen"
        class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow z-50"
      >
      <button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        Perfil
      </button>
        <button
          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          @click="auth.logout()"
        >
          Sair
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from '#imports'
import { UserIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline'

// Autenticação
const auth = useAuthStore()
const { user } = storeToRefs(auth)

const isUserLoaded = ref(false)

// Estado do dropdown
const dropdownOpen = ref(false)

function getIniciais(nome: string): string {
  const partes = nome.trim().split(' ')
  const primeira = partes[0]?.[0] || ''
  const ultima = partes.length > 1 ? partes[partes.length - 1]?.[0] : ''
  return (primeira + ultima).toUpperCase()
}

onMounted(async () => {
  await auth.loadUserFromCookie()
  isUserLoaded.value = true

  // Fechar dropdown ao clicar fora
  window.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.relative')) {
      dropdownOpen.value = false
    }
  })
})

</script>
