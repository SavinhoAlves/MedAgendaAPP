<template>
  <div
  v-if="isOpen" 
  class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-lg w-full max-w-2xl">
      <!-- Cabeçalho -->
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-lg font-bold">Novo Agendamento</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-red-500 text-xl font-bold">×</button>
      </div>

      <!-- Etapas -->
      <div class="p-4">
        <div class="flex justify-between mb-6">
          <div
            v-for="(etapa, index) in etapas"
            :key="index"
            :class="[
              'flex-1 text-center py-2 border-b-4',
              etapaAtual === index
                ? 'border-blue-500 font-semibold text-blue-600'
                : 'border-gray-200 text-gray-400'
            ]"
          >
            {{ etapa }}
          </div>
        </div>

        <!-- Etapa 0: Profissional -->
        <div v-if="etapaAtual === 0">
          <label for="profissional" class="block mb-2 text-sm">Profissional:</label>
          <input
            id="profissional"
            type="text"
            :value="$props.profissionalSelecionado?.nome ?? ''"
            disabled
            class="w-full border p-2 rounded text-gray-500 cursor-not-allowed"
          />
        </div>

        <!-- Etapa 1: Selecionar Data em formato de calendário -->
        <div v-else-if="etapaAtual === 1">
          <label for="data" class="block mb-2 text-sm font-medium text-gray-700">Selecione a data:</label>

          <!-- Navegação do mês -->
          <div class="flex justify-between items-center mb-2">
            <button @click="mudarMes(-1)" class="text-blue-600"><chevron-left-icon class="w-5 h-5" /></button>
            <div class="font-semibold">
              {{ nomeMesAno(mesVisivel) }}
            </div>
            <button @click="mudarMes(1)" class="text-blue-600"><chevron-right-icon class="w-5 h-5" /></button>
          </div>

          <!-- Cabeçalho dos dias da semana -->
          <div class="grid grid-cols-7 text-center text-sm font-medium text-gray-600 mb-1">
            <div v-for="dia in diasSemana" :key="dia">{{ dia }}</div>
          </div>

          <!-- Dias do mês -->
          <div class="grid grid-cols-7 gap-1 text-center text-sm">
            <div
              v-for="(info, index) in diasDoMes"
              :key="index"
              class="p-2 rounded cursor-pointer"
              :class="[
                info.selecionavel
                  ? (info.data && diasSelecionados.includes(info.data) ? 'bg-blue-600 text-white' : 'hover:bg-blue-100')
                  : 'text-gray-400 cursor-not-allowed'
              ]"
             @click="info.selecionavel && info.data && toggleDiaSelecionado(info.data)"
            >
              {{ info.dia ?? '' }}
            </div>
          </div>
        </div>

        <!-- Etapa 2: Horário -->
        <div v-else-if="etapaAtual === 2">
          <label class="block mb-2 text-sm">Horário de atendimento:</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="hora in horariosDisponiveis"
              :key="hora"
              type="button"
              :disabled="!!horarioSelecionado && horarioSelecionado !== hora"
              :class="[
                'px-4 py-2 rounded border text-sm transition-all duration-150',
                horarioSelecionado === hora
                  ? 'bg-blue-600 text-white border-blue-600'
                  : horarioSelecionado
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
              ]"
              @click="selecionarHorario(hora)"
            >
              {{ hora }}
            </button>
          </div>
        </div>

        <!-- Etapa 3: Dados do paciente -->
        <div v-else-if="etapaAtual === 3">
          <div>
            <label class="block mb-2 text-sm">Paciente:</label>
              <input
                v-model="pacienteNome"
                @input="buscarPacientes"
                placeholder="Digite o nome do paciente"
                class="w-full border p-2 rounded mb-2"
              />

              <ul v-if="sugestoesPacientes.length > 0" class="border rounded bg-white max-h-40 overflow-auto">
                <li
                  v-for="paciente in sugestoesPacientes"
                  :key="paciente.id"
                  class="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  @click="selecionarPaciente(paciente)"
                >
                  {{ paciente.nome }} - {{ paciente.telefone }}
                </li>
              </ul>
          </div>

          <div class="flex w-full">

            <div class="col-md-6 mr-3">
              <label id="telefone" class="block mb-2 text-sm">Telefone:</label>
              <input v-model="pacienteTelefone" id="telefone" type="text" class="w-full border p-2 rounded mb-3" />
            </div>

            <div>
              <label id="email" class="block mb-2 text-sm">E-mail:</label>
              <input v-model="pacienteEmail" id="email" type="email" class="w-full border p-2 rounded" />
            </div>

          </div>

          <div class="h-30">
            <label id="observacoes" class="block mb-2 text-sm">Observações</label>
            <textarea class="border w-full rounded" name="observacoes" id="observacoes"></textarea>
          </div>

        </div>
      </div>

      <!-- Rodapé -->
      <div class="flex justify-between p-4 border-t">
        <button :disabled="etapaAtual === 0" @click="voltarEtapa" class="px-4 py-2 rounded text-gray-600 hover:text-black disabled:opacity-50">
          Voltar
        </button>

        <div>
          <button class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 mr-4"  @click="onAbrirCadastroPaciente">
            Cadastrar Paciente
          </button>
          <button class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600" @click="proximaEtapa">
            {{ etapaAtual === etapas.length - 1 ? 'Salvar' : 'Avançar' }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

const { isOpen, profissionalSelecionado } = defineProps<{
  isOpen: boolean
  profissionalSelecionado: { nome: string; id: number } | undefined
}>()

const emit = defineEmits(['abrirCadastroPaciente', 'close'])

const etapaAtual = ref(0)
const etapas = ['Profissional', 'Dias', 'Horário', 'Dados do Paciente']
const profissionais = ref<any[]>([])
const profissionalId = ref<number | null>(null)
const diasSelecionados = ref<string[]>([])
const horarioSelecionado = ref<string | null>(null)
const pacienteNome = ref('')
const pacienteTelefone = ref('')
const pacienteEmail = ref('')
const sugestoesPacientes = ref<any[]>([])
const horariosDisponiveis = ref<string[]>([])
const diasAtendimento = ref<string[]>([])
const observacoes = ref('')

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const mapaDias = { Dom: 0, Seg: 1, Ter: 2, Quar: 3, Qui: 4, Sex: 5, Sáb: 6 } as const
type DiaAbreviado = keyof typeof mapaDias

const hoje = new Date()
const mesVisivel = ref(new Date(hoje.getFullYear(), hoje.getMonth(), 1))

const route = useRoute()

const diasDoMes = computed(() => {
  const ano = mesVisivel.value.getFullYear()
  const mes = mesVisivel.value.getMonth()
  const primeiroDia = new Date(ano, mes, 1)
  const ultimoDia = new Date(ano, mes + 1, 0)
  const dias: { dia: number | null, data: string | null, selecionavel: boolean }[] = []

  const offset = primeiroDia.getDay()
  for (let i = 0; i < offset; i++) {
    dias.push({ dia: null, data: null, selecionavel: false })
  }

  for (let d = 1; d <= ultimoDia.getDate(); d++) {
    const data = new Date(ano, mes, d)
    const diaSemanaAbrev = diasSemana[data.getDay()]
    const selecionavel = diasAtendimento.value.includes(diaSemanaAbrev)
    const dataFormatada = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

    dias.push({
      dia: d,
      data: dataFormatada,
      selecionavel
    })
  }

  return dias
})

function nomeMesAno(date: Date) {
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

function mudarMes(delta: number) {
  const ano = mesVisivel.value.getFullYear()
  const mes = mesVisivel.value.getMonth()
  mesVisivel.value = new Date(ano, mes + delta, 1)
}

function toggleDiaSelecionado(data: string) {
  if (diasSelecionados.value.includes(data)) {
    diasSelecionados.value = diasSelecionados.value.filter(d => d !== data)
  } else {
    diasSelecionados.value.push(data)
  }
}

function selecionarHorario(hora: string) {
  if (horarioSelecionado.value === hora) {
    horarioSelecionado.value = null
  } else {
    horarioSelecionado.value = hora
  }
}

function proximaEtapa() {
  if (etapaAtual.value === 0 && profissionalId.value === null) return
  if (etapaAtual.value === 1 && diasSelecionados.value.length === 0) return
  if (etapaAtual.value === 2 && !horarioSelecionado.value) return

  if (etapaAtual.value < etapas.length - 1) {
    etapaAtual.value++
  } else {
    salvarAgendamento()
  }
}

function voltarEtapa() {
  if (etapaAtual.value > 0) {
    etapaAtual.value--
  }
}

async function buscarPacientes() {
  if (pacienteNome.value.length < 3) {
    sugestoesPacientes.value = []
    return
  }

  try {
    const resultados = await $fetch(`/api/pacientes?busca=${encodeURIComponent(pacienteNome.value)}`)
    sugestoesPacientes.value = resultados
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error)
  }
}

function selecionarPaciente(p: any) {
  pacienteNome.value = p.nome
  pacienteTelefone.value = p.telefone
  pacienteEmail.value = p.email
  sugestoesPacientes.value = []
}

async function carregarDiasProfissional() {
  if (profissionalId.value === null) return

  const profissional = profissionais.value.find(p => p.id === profissionalId.value)
  if (!profissional) return

  const mapDiaCompletoParaAbreviado: Record<string, string> = {
    'Domingo': 'Dom',
    'Segunda-Feira': 'Seg',
    'Terça-Feira': 'Ter',
    'Quarta-Feira': 'Quar',
    'Quinta-Feira': 'Qui',
    'Sexta-Feira': 'Sex',
    'Sábado': 'Sáb'
  }

  const dias = (profissional.dias_atendimento || [])
    .map((dia: string) => mapDiaCompletoParaAbreviado[dia.trim()])
    .filter(Boolean)

  diasAtendimento.value = dias
  gerarHorariosDisponiveis()
}

function gerarHorariosDisponiveis() {
  if (profissionalId.value === null) return

  const profissional = profissionais.value.find(p => p.id === profissionalId.value)
  if (!profissional) return

  const { horario_inicio, horario_fim, intervalo_minutos } = profissional

  let [h, m] = horario_inicio.split(':').map(Number)
  const [hf, mf] = horario_fim.split(':').map(Number)

  const horarios: string[] = []

  while (h < hf || (h === hf && m < mf)) {
    horarios.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    m += intervalo_minutos
    if (m >= 60) {
      h++
      m -= 60
    }
  }

  horariosDisponiveis.value = horarios
}

async function salvarAgendamento() {
  try {
    const dataHora = `${diasSelecionados.value[0]} ${horarioSelecionado.value}:00`

    await $fetch('/api/agendamentos', {
      method: 'POST',
      body: {
        profissional_id: profissionalId.value,
        data_hora: dataHora,
        paciente_nome: pacienteNome.value,
        paciente_telefone: pacienteTelefone.value,
        paciente_email: pacienteEmail.value,
        observacoes: ''
      }
    })

    etapaAtual.value = 0
    profissionalId.value = null
    diasSelecionados.value = []
    horarioSelecionado.value = null
    pacienteNome.value = ''
    pacienteTelefone.value = ''
    pacienteEmail.value = ''

    emit('close')
  } catch (error) {
    console.error('Erro ao salvar agendamento:', error)
  }
}

watch(
  () => profissionalSelecionado,
  (novoProfissional) => {
    profissionalId.value = novoProfissional && typeof novoProfissional === 'object' ? novoProfissional.id : null
    if (profissionalId.value !== null) {
      carregarDiasProfissional()
    }
  },
  { immediate: true }
)

onMounted(async () => {
  try {
    const resposta = await $fetch('/api/profissionais')
    if (Array.isArray(resposta)) {
      profissionais.value = resposta
    } else {
      profissionais.value = []
      console.error('Erro ao buscar profissionais:', resposta?.mensagem || 'Resposta inesperada da API')
    }
  } catch (error) {
    profissionais.value = []
    console.error('Erro ao buscar profissionais:', error)
  }
})
</script>
