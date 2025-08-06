<template>
  <!-- Menu fixo -->
  <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow">
    <MainMenu />
  </div>

  <div class="pt-20 px-6 pb-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
      <div>
        <h1 class="text-2xl font-bold">Agenda - {{ nomeProfissional }}</h1>
        <p class="text-gray-500 text-sm">Exibindo agendamentos de {{ mesAnoSelecionado }}</p>
      </div>

      <!-- Filtro de mês -->
      <div class="flex gap-2 items-center">
        <input
          type="month"
          id="filtroMes"
          class="border rounded px-2 py-1 text-sm"
          v-model="filtroMes"
          @change="carregarAgendamentosPorFiltro"
        />
        <button
          @click="modalAberto = true"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Novo Agendamento
        </button>
      </div>
    </div>

    <!-- Divisor -->
    <div class="border-t border-gray-200 mb-8"></div>

    <!-- Lista de agendamentos -->
    <div class="grid gap-4">
      <!-- Se houver agendamentos -->
      <div
        v-for="agendamento in agendamentos"
        :key="agendamento.id"
        class="p-4 border rounded shadow-sm bg-white"
      >
        <div class="font-semibold text-lg">{{ agendamento.nome_paciente }}</div>
        <div class="text-sm text-gray-600">📅 {{ agendamento.data }} às {{ agendamento.hora }}</div>
        <div class="text-sm text-gray-600">📞 {{ agendamento.telefone }}</div>
        <div
          v-if="agendamento.observacoes"
          class="text-sm italic mt-1 text-gray-500"
        >
          📝 {{ agendamento.observacoes }}
        </div>
      </div>

      <!-- Se NÃO houver agendamentos -->
      <div
        v-if="agendamentos.length === 0"
        class="text-center text-gray-500 text-sm py-10"
      >
        Nenhum agendamento para esta agenda.
      </div>
    </div>
  </div>

  <!-- Modal Novo Agendamento -->
  <ModalNovoAgendamento
    :isOpen="modalAberto"
    :diasAtendimento="diasArray"
    :profissionalSelecionado="profissionalSelecionado"
    :profissionalId="profissionalSelecionado?.id ?? null"
    @close="modalAberto = false"
    @dataSelecionada="handleDataSelecionada"
  />


  <!-- Modal Cadastro do Paciente -->
  <ModalCadastroPaciente
    v-if="mostrarModalCadastroPaciente"
    @close="mostrarModalCadastroPaciente = false"
    @pacienteSelecionado="pacienteSelecionado = $event"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

import ModalNovoAgendamento from '~/components/ModalNovoAgendamento.vue'
import ModalCadastroPaciente from '~/components/ModalCadastroPaciente.vue'
import MainMenu from '~/components/MainMenu.vue'

useHead({ title: 'Agenda - MedAgendaAPP' })

interface Agendamento {
  id: number
  nome_paciente: string
  telefone: string
  data: string
  hora: string
  observacoes?: string
}

interface Response {
  agendamentos: Agendamento[]
  nome_profissional: string
}

const route = useRoute()
const toast = useToast()

const agendamentos = ref<Agendamento[]>([])
const nomeProfissional = ref('')
const modalAberto = ref(false)
const mostrarModalCadastroPaciente = ref(false)
const pacienteSelecionado = ref<{ id: number; nome: string } | null>(null)
const profissionalSelecionado = ref<{
  id: number
  nome: string
  dias_atendimento: string[]
  horario_inicio: string
  horario_fim: string
  intervalo_minutos: number
} | undefined>(undefined)

// Computed property para dias de atendimento no formato esperado pelo modal
const diasArray = computed(() => profissionalSelecionado.value?.dias_atendimento ?? [])

const filtroMes = ref(new Date().toISOString().slice(0, 7)) // yyyy-MM

const mesAnoSelecionado = computed(() => {
  const [ano, mes] = filtroMes.value.split('-')
  return new Date(parseInt(ano), parseInt(mes) - 1).toLocaleString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })
})

onMounted(() => {
  carregarAgendamentosPorFiltro()
})

// Função para lidar com o evento de data selecionada no ModalNovoAgendamento
function handleDataSelecionada(data: any) {
  // Você pode implementar ações ao selecionar data, por exemplo, recarregar lista
  carregarAgendamentosPorFiltro()
}

async function carregarAgendamentosPorFiltro() {
  try {
    const idProfissional = route.params.id

    // 1. Buscar agendamentos filtrados por mês
    const res = await $fetch<Response>(`/api/agendamentos/${idProfissional}?mes=${filtroMes.value}`)
    agendamentos.value = res.agendamentos
    nomeProfissional.value = res.nome_profissional

    // 2. Buscar dados reais do profissional
    interface Profissional {
      id: number;
      nome: string;
      dias_atendimento: string[] | string;
      horario_inicio: string;
      horario_fim: string;
      intervalo_minutos: number;
    }
    const profissional = await $fetch<Profissional>(`/api/profissionais/${idProfissional}`)

    // 3. Ajustar dias de atendimento para array de strings
    profissionalSelecionado.value = {
      id: profissional.id,
      nome: profissional.nome,
      dias_atendimento: Array.isArray(profissional.dias_atendimento)
        ? profissional.dias_atendimento
        : typeof profissional.dias_atendimento === 'string'
          ? profissional.dias_atendimento.split(',').map(d => d.trim()).filter(Boolean)
          : [],
      horario_inicio: profissional.horario_inicio,
      horario_fim: profissional.horario_fim,
      intervalo_minutos: profissional.intervalo_minutos
    }

    toast.success('Agendamentos carregados com sucesso!')

  } catch (error) {
    toast.error('Erro ao carregar agendamentos.')
    console.error(error)
  }
}
</script>