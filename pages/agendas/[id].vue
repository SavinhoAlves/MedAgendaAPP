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
          class="border rounded px-2 py-1 text-sm"
          v-model="filtroMes"
          @change="carregarAgendamentosPorFiltro"
        />
        <button
          @click="mostrarModalAgendamento = true"
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
    </div>
  </div>

  <!-- Modais -->
  <ModalNovoAgendamento
    v-if="mostrarModalAgendamento"
    :profissional-id="route.params.id"
    @close="mostrarModalAgendamento = false"
    @agendamentoCriado="carregarAgendamentosPorFiltro"
  />
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
const mostrarModalAgendamento = ref(false)
const mostrarModalCadastroPaciente = ref(false)
const pacienteSelecionado = ref<{ id: number; nome: string } | null>(null)

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

async function carregarAgendamentosPorFiltro() {
  try {
    const idProfissional = route.params.id
    const res = await $fetch<Response>(`/api/agendamentos/${idProfissional}?mes=${filtroMes.value}`)

    agendamentos.value = res.agendamentos
    nomeProfissional.value = res.nome_profissional
  } catch (error) {
    toast.error('Erro ao carregar agendamentos.')
    console.error(error)
  }
}
</script>
