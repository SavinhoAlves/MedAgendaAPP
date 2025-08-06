<template>
  <div>
    <!-- Menu fixo no topo -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow">
      <MainMenu />
    </div>

    <!-- Conteúdo principal -->
    <div class="pt-20 px-6 pb-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Agendas por Profissional</h1>
          <p class="text-gray-500 text-sm">Selecione um profissional para abrir sua agenda de atendimento</p>
        </div>

        <!-- Botão Nova Agenda -->
        <button
          @click="mostrarModal = true"
          class="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg shadow transition-colors"
          aria-label="Nova Agenda"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </button>
      </div>

      <!-- Divisor -->
      <div class="border-t border-gray-200 mb-8"></div>

      <!-- Barra de ações -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-2 mt-2">
        <!-- Filtros -->
        <div class="flex flex-wrap items-center gap-2">
          <input
            id="filtro-busca"
            name="busca"
            v-model="filtros.busca"
            type="text"
            placeholder="Buscar profissional..."
            class="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            id="filtro-especialidade"
            name="especialidade"
            v-model="filtros.especialidade"
            class="px-3 py-2 border rounded-lg text-sm text-gray-700"
          >
            <option value="">Todas especialidades</option>
            <option v-for="esp in especialidadesUnicas" :key="esp" :value="esp">
              {{ esp }}
            </option>
          </select>

          <select
          id="filtro-dia"
          name="dia"
          v-model="filtros.dia"
          class="px-3 py-2 border rounded-lg text-sm text-gray-700"
        >
            <option value="">Todos os dias</option>
            <option v-for="dia in diasSemana" :key="dia" :value="dia">
              {{ dia }}
            </option>
          </select>

          <label for="filtro-hoje" class="flex items-center gap-2 text-sm">
            <input id="filtro-hoje" name="somenteHoje" type="checkbox" v-model="filtros.somenteHoje" />
            Hoje
          </label>
        </div>

        <!-- Botão de visualização -->
        <button
          @click="alternarVisualizacao"
          class="px-3 py-2 border rounded-lg text-sm hover:bg-gray-100 flex items-center gap-2 items-certer"
        >
          <span v-if="modoGrid"><QueueListIcon class="h-5 w-5 mb-1" /></span>
          <span v-else><Squares2X2Icon class="h-5 w-5 mb-1" /></span>
        </button>
      </div>

      <!-- Grid -->
      <div v-if="modoGrid" class="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
          v-for="agenda in agendasFiltradas"
          :key="agenda.id"
          class="p-4 bg-white shadow rounded-lg hover:border-blue-600"
        >
          <h3 class="text-lg font-bold flex items-center mb-1"><UserIcon class="h-5 w-5 mr-1 text-blue-600" />{{ agenda.nome_profissional || agenda.nome }}</h3>
          <p class="text-sm text-gray-600 font-regular bg-blue-100 rounded-xl w-28 text-center px-2 mb-3">{{ agenda.area || 'Sem especialidade' }}</p>
          <p class="text-sm flex mb-2"><ClockIcon class="h-5 w-5 mr-2 text-gray-400" /><span class="font-bold mr-2">Hora:</span> {{ agenda.horario_inicio ? `${agenda.horario_inicio} às ${agenda.horario_fim}` : 'Não informado' }}</p>
          <p class="text-sm flex mb-2"><CalendarIcon class="h-5 w-5 mr-2 text-gray-400" /><span class="font-bold mr-2">Atende:</span> {{ abreviarDias(agenda.dias_atendimento || agenda.dias_atendimento) }}</p>
          <p class="text-sm flex text-black mb-2"><BookmarkIcon class="h-5 w-5 mr-2 text-gray-400" /> <span class="font-semibold mr-2">{{ agenda.total_agendamentos }}</span> agendamentos</p>
          <p class="text-sm flex mb-2"><ClipboardIcon class="h-5 w-5 mr-2 text-gray-400" /> <span class="font-semibold mr-2">{{ agenda.agendamentos_hoje }}</span> consulta(s) hoje</p>
          <NuxtLink
            :to="`/agendas/${agenda.id}`"
            class="bg-blue-600 py-2 px-6 w-52 rounded-lg text-white mt-1 hover:bg-blue-900 transition-all block text-center"
          >
            Abrir Agenda
          </NuxtLink>
        </div>
      </div>

      <!-- Lista -->
      <div v-else>
        <table class="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Profissional</th>
              <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Especialidade</th>
              <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Dias</th>
              <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Hora</th>
              <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Agendamentos</th>
              <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Hoje</th>
              <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr
              v-for="agenda in agendasFiltradas"
              :key="agenda.id"
            >
              <td class="px-4 py-2">{{ agenda.nome_profissional || agenda.nome }}</td>
              <td class="px-4 py-2">{{ agenda.area || 'Sem especialidade' }}</td>
              <td class="px-4 py-2">{{ abreviarDias(agenda.dias_atendimento || agenda.dias_atendimento) }}</td>
              <td class="px-4 py-2">{{ agenda.horario_inicio ? `${agenda.horario_inicio} às ${agenda.horario_fim}` : 'Não informado' }}</td>
              <td class="px-4 py-2">
                <span v-if="agenda.agendamentos_hoje > 0" class="text-blue-600 font-medium">
                  {{ agenda.total_agendamentos }}
                </span>
                <span v-else class="text-gray-400">0</span>
              </td>
              
              <td class="px-4 py-2">
                <span v-if="agenda.agendamentos_hoje > 0" class="text-blue-600 font-medium">
                  {{ agenda.agendamentos_hoje }}
                </span>
                <span v-else class="text-gray-400">0</span>
              </td>
              <td class="px-4 py-2">
                <NuxtLink
                  :to="`/agendas/${agenda.id}`"
                  class="px-4 py-2 rounded-md text-white font-semibold shadow-md
                        bg-gradient-to-r from-blue-600 to-blue-300
                        bg-[length:200%_100%] bg-[position:0%_0%]
                        transition-[background-position] duration-700 ease-in-out
                        hover:bg-[position:100%_0%] block text-center"
                >
                  Abrir Agenda
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      
    </div>

    <!-- Modal de criação -->
    <ModalNovaAgenda v-if="mostrarModal" @close="mostrarModal = false" />
  </div>
</template>

<script setup lang="ts">
import { CalendarIcon, 
  QueueListIcon, 
  UserIcon, 
  ClipboardIcon, 
  ClockIcon, 
  BookmarkIcon,
  Squares2X2Icon
 } from '@heroicons/vue/24/outline'
import { ref, onMounted, computed } from 'vue'
import MainMenu from '~/components/MainMenu.vue'
import ModalNovaAgenda from '~/components/ModalNovaAgenda.vue'

const mostrarModal = ref(false)
const agendas = ref<Agenda[]>([])
const loading = ref(true)
const modoGrid = ref(true)
const filtros = ref({
  busca: '',
  especialidade: '',
  dia: '',
  somenteHoje: false
})
const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

useHead({ title: 'Agendas | MedAgendaAPP' })

interface Agenda {
  id: number
  profissional_id: number
  data: string
  cliente_nome: string
  descricao: string
  nome: string
  nome_profissional: string
  tipo_conselho: string
  numero_conselho: string
  telefone: string
  horario_inicio: string
  horario_fim: string
  intervalo_minutos: number
  hora_extra_inicio: string
  hora_extra_fim: string
  area: string
  total_agendamentos: number
  agendamentos_hoje: number
  dias_atendimento?: string
}

function abreviarDias(dias?: string): string {
  if (!dias) return 'Dias não informados'

  const diasMap: Record<string, string> = {
    Domingo: 'Dom',
    Segunda: 'Seg',
    Terça: 'Ter',
    Quarta: 'Qua',
    Quinta: 'Qui',
    Sexta: 'Sex',
    Sábado: 'Sáb'
  }

  return dias
    .split(',')
    .map((dia) => diasMap[dia.trim()] || dia.trim().slice(0, 3))
    .join(', ')
}

function abrirAgenda(id: number) {
  navigateTo(`/agendas/${id}`)
}

function alternarVisualizacao() {
  modoGrid.value = !modoGrid.value
  localStorage.setItem('modoVisualizacao', modoGrid.value ? 'grid' : 'lista')
}

onMounted(async () => {
  const modoSalvo = localStorage.getItem('modoVisualizacao')
  if (modoSalvo === 'lista') modoGrid.value = false

  try {
    const res = await $fetch<Agenda[]>('/api/agendas')
    agendas.value = res
  } catch (err) {
    console.error('Erro ao carregar agendas:', err)
  } finally {
    loading.value = false
  }
})

const especialidadesUnicas = computed(() => {
  const lista = agendas.value.map(a => a.area || '').filter(Boolean)
  const set = new Set<string>()
  lista.forEach(item => item.split(',').forEach(e => set.add(e.trim())))
  return Array.from(set).sort()
})

const agendasFiltradas = computed(() => {
  return agendas.value.filter((agenda) => {
    const nome = agenda.nome_profissional || agenda.nome || ''
    const area = agenda.area || ''
    const dias = abreviarDias(agenda.dias_atendimento || '')
    const agendamentosHoje = agenda.agendamentos_hoje || 0

    const nomeMatch = nome.toLowerCase().includes(filtros.value.busca.toLowerCase())
    const espMatch = !filtros.value.especialidade || area.includes(filtros.value.especialidade)
    const diaMatch = !filtros.value.dia || dias.includes(filtros.value.dia)
    const hojeMatch = !filtros.value.somenteHoje || agendamentosHoje > 0

    return nomeMatch && espMatch && diaMatch && hojeMatch
  })
})
</script>

