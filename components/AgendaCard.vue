<script setup lang="ts">
import {
  UserIcon,
  CalendarIcon,
  ClockIcon,
  CalendarDaysIcon
} from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  id: number
  nome: string
  area: string
  dias: string
  agendados: number
}>()

const emit = defineEmits(['abrirModal'])

function abrirAgenda() {
  // Exemplo: emitir evento
  emit('abrirModal')
  
  // Ou navegar direto, se preferir:
  router.push(`/agendas?id=${props.id}`)
}
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow-md border border-gray-200 p-5 flex flex-col h-full transition hover:shadow-lg"
  >
    <!-- Se não houver agendas -->
    <template v-if="agendados === 0">
      <div class="flex flex-col justify-center items-center text-gray-400 text-center flex-1">
        <UserIcon class="h-10 w-10 mb-2" />
        <p class="text-base font-medium">Nenhuma agenda aberta no momento</p>
      </div>
    </template>

    <!-- Conteúdo do card -->
    <template v-else>
      <!-- Nome e status -->
      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-3">
          <div class="bg-blue-100 p-1 rounded-full">
            <UserIcon class="h-5 w-5 text-blue-600" />
          </div>
          <p class="text-base font-semibold text-gray-900 truncate w-40">{{ nome }}</p>
        </div>
        <span class="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
          Ativo
        </span>
      </div>

      <hr class="mb-4 border-gray-100" />

      <div class="mb-2 text-sm text-gray-600">
        <span class="font-semibold">Especialidade:</span> {{ area }}
      </div>

      <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <CalendarIcon class="h-4 w-4 text-blue-500" />
        <span>{{ dias }}</span>
      </div>

      <div class="flex items-center gap-2 text-sm text-orange-600 font-semibold mb-4">
        <ClockIcon class="h-4 w-4" />
        <span>{{ agendados }} agendado{{ agendados > 1 ? 's' : '' }} hoje</span>
      </div>

      <button
        @click="abrirAgenda"
        class="mt-auto bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition"
      >
        <CalendarDaysIcon class="h-5 w-5" />
        Visualizar Agenda
      </button>
    </template>
  </div>
</template>
