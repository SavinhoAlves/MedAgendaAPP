<template>
  <aside
    :class="[
      'bg-white border-r h-screen fixed top-0 left-0 z-40 flex flex-col justify-between transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    ]"
  >
    <!-- TOPO: Logo + Botão de colapsar -->
    <div class="flex items-center justify-between p-4">
      <div class="flex items-center gap-2">
        <CalendarDaysIcon class="h-6 w-6 text-blue-600" />

        <!-- Texto completo quando expandido -->
        <template v-if="!collapsed">
          <span class="text-xl font-bold text-blue-600">Med</span>
          <span class="text-xl font-bold text-gray-800">Agenda</span>
        </template>

        <!-- Apenas "M" quando colapsado -->
        <!-- <template v-else>
          <span class="text-xl font-bold text-blue-600"><CalendarDaysIcon class="h-6 w-6 text-blue-600" /></span>
        </template> -->
      </div>

      <button
        @click="collapsed = !collapsed"
        class="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition ml-2 border border-blue-300">
        <ChevronLeftIcon
          :class="[
            'w-5 h-5 transform transition-transform text-blue-800',
            collapsed ? 'rotate-180' : ''
          ]"
        />
      </button>
    </div>

    <!-- LINKS -->
    <nav class="flex-1 mt-4 space-y-1">
      <SidebarLink
        v-for="item in links"
        :key="item.to"
        :to="item.to"
        :icon="item.icon"
        :label="item.label"
        :collapsed="collapsed"
      />
    </nav>

    <!-- RODAPÉ: Dropdown do usuário -->
    <div class="p-4 border-t">
      <div class="relative" @click="open = !open">
        <button
          class="w-full flex items-center gap-2 text-sm font-medium text-gray-700 rounded p-2"
        >
          <UserIcon class="w-5 h-5" />
          <span v-if="!collapsed">
            {{ user?.nome || 'Usuário' }}
          </span>
          <ChevronDownIcon class="w-4 h-4 ml-auto" v-if="!collapsed" />
        </button>

        <!-- Dropdown -->
        <div
          v-if="open && !collapsed"
          class="absolute bottom-12 left-0 w-full bg-white shadow rounded-md z-50"
        >
          <ul class="text-sm text-gray-700">
            <li>
              <a href="#" class="block px-4 py-2">Perfil</a>
            </li>
            <li>
              <button
                class="w-full text-left px-4 py-2"
                @click="logout"
              >
                Sair
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue' // <-- Importar onMounted aqui
import {
  HomeIcon,
  UserIcon,
  UsersIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline'
import SidebarLink from './SidebarLink.vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useSidebarCollapsed } from '@/composables/useSidebar'

const collapsed = useSidebarCollapsed()
const toast = useToast()
const router = useRouter()
const open = ref(false)

// Usuário logado
const user = ref<{ id: number; nome: string; tipo: string } | null>(null)

async function fetchUser() {
  try {
    const data = await $fetch('/api/auth/me', {
      credentials: 'include'
    })
    if (data.user) {
      user.value = data.user
    } else {
      router.push('/login')
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    router.push('/login')
  }
}

onMounted(() => {
  fetchUser()
})

const logout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    toast.success('Logout realizado com sucesso!')
    router.push('/login')
  } catch (err) {
    toast.error('Erro ao deslogar: ' + (err instanceof Error ? err.message : String(err)))
  }
}

const links = [
  { to: '/Dashboard', icon: HomeIcon, label: 'Dashboard' },
  { to: '/Pacientes', icon: UserIcon, label: 'Pacientes' },
  { to: '/Profissionais', icon: UsersIcon, label: 'Profissionais' },
  { to: '/Relatorios', icon: ChartBarIcon, label: 'Relatórios' },
]
</script>
