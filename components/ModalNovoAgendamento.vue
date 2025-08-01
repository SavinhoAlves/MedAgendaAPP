<template>
  <div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
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
          <label class="block mb-2 text-sm">Profissional:</label>
          <input type="text" :value="profissionalSelecionado?.nome" disabled class="w-full border p-2 rounded" />
        </div>

        <!-- Etapa 1: Dias da semana -->
        <div v-else-if="etapaAtual === 1">
          <label class="block mb-2 text-sm font-medium text-gray-700">Dias de atendimento:</label>
          <div class="flex flex-wrap gap-4">
            <button
              v-for="dia in diasSemana"
              :key="dia"
              type="button"
              :class="[
                'px-4 py-2 rounded border',
                diasSelecionados.includes(dia)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300'
              ]"
              @click="toggleDia(dia)"
            >
              {{ dia }}
            </button>
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
          <button class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 mr-4"  @click="abrirCadastroPaciente">
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
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

// Etapas do formulário
const etapaAtual = ref(0)
const etapas = ['Profissional', 'Dias', 'Horário', 'Dados do Paciente']

// Estado dos campos
const profissionais = ref<any[]>([])
const profissionalId = ref<number | null>(null)
const profissionalSelecionado = ref<any>(null)
const diasSelecionados = ref<string[]>([])
const horarioSelecionado = ref<string | null>(null)
const pacienteNome = ref('')
const pacienteTelefone = ref('')
const pacienteEmail = ref('')
const sugestoesPacientes = ref<any[]>([])
const emit = defineEmits(['abrirCadastroPaciente', 'close'])

// Dias da semana e mapeamento
const diasSemana = ['Seg', 'Ter', 'Quar', 'Qui', 'Sex', 'Sáb', 'Dom']
const mapaDias = {
  Dom: 0,
  Seg: 1,
  Ter: 2,
  Quar: 3,
  Qui: 4,
  Sex: 5,
  Sáb: 6
} as const
type DiaAbreviado = keyof typeof mapaDias

type Profissional = {
  id: number
  nome: string
  dias: string[]
  horario_inicio: string
  horario_fim: string
  intervalo_minutos: number
}

const horariosDisponiveis = ref<string[]>([])

// Rota para pegar id inicial do profissional
const route = useRoute()

// Inicializa profissionalId com parâmetro da rota query ?profissional_id=2
onMounted(async () => {
  try {
    profissionais.value = await $fetch('/api/profissionais')

    const profissionalIdQuery = route.query.profissional_id
    if (typeof profissionalIdQuery === 'string') {
      profissionalId.value = parseInt(profissionalIdQuery)
      profissionalSelecionado.value = profissionais.value.find(p => p.id === profissionalId.value) || null
    }

    if (profissionalId.value !== null) {
      await carregarDiasProfissional()
      gerarHorariosDisponiveis()
    }
  } catch (error) {
    console.error('Erro ao carregar profissionais:', error)
  }
})

// Atualiza dias e horários ao mudar profissional
watch(profissionalId, async (novoId, antigoId) => {
  if (novoId !== antigoId && novoId !== null) {
    await carregarDiasProfissional()
    gerarHorariosDisponiveis()
  }
})

// Carrega o nome dos pacientes de acordo com a pesquisa do nome do mesmo
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
    sugestoesPacientes.value = []
  }
}

function selecionarPaciente(paciente: any) {
  pacienteNome.value = paciente.nome
  pacienteTelefone.value = paciente.telefone
  pacienteEmail.value = paciente.email
  sugestoesPacientes.value = []
}

// Carrega os dias da semana do profissional
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

  diasSelecionados.value = profissional.dias
    .map((dia: string) => mapDiaCompletoParaAbreviado[dia.trim()])
    .filter(Boolean)
}

// Gera os horários com base no horário de atendimento e intervalo
function gerarHorariosDisponiveis() {
  if (profissionalId.value === null) return

  const profissional = profissionais.value.find(p => p.id === profissionalId.value)
  if (!profissional || !profissional.horario_inicio || !profissional.horario_fim || !profissional.intervalo_minutos) {
    console.warn('Horários incompletos:', profissional)
    horariosDisponiveis.value = []
    return
  }

  const inicio = profissional.horario_inicio
  const fim = profissional.horario_fim
  const intervalo = parseInt(profissional.intervalo_minutos)

  const horarios: string[] = []
  let [hora, minuto] = inicio.split(':').map(Number)
  const [horaFim, minutoFim] = fim.split(':').map(Number)

  while (hora < horaFim || (hora === horaFim && minuto <= minutoFim)) {
    const h = hora.toString().padStart(2, '0')
    const m = minuto.toString().padStart(2, '0')
    horarios.push(`${h}:${m}`)

    minuto += intervalo
    if (minuto >= 60) {
      hora += 1
      minuto -= 60
    }
  }

  horariosDisponiveis.value = horarios
  console.log('Horários disponíveis:', horarios)
}

// Marcar ou desmarcar dias
function toggleDia(dia: string) {
  if (diasSelecionados.value.includes(dia)) {
    diasSelecionados.value = diasSelecionados.value.filter(d => d !== dia)
  } else {
    diasSelecionados.value.push(dia)
  }
}

// Seleciona horário, desabilitando os demais
function selecionarHorario(hora: string) {
  if (horarioSelecionado.value === hora) {
    horarioSelecionado.value = null
  } else if (!horarioSelecionado.value) {
    horarioSelecionado.value = hora
  }
}

// Controle de etapas com validação simples
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

// Salva agendamento no backend
async function salvarAgendamento() {
  try {
    if (profissionalId.value === null || !horarioSelecionado.value) return

    const primeiroDia = diasSelecionados.value[0] as DiaAbreviado
    const dataCompleta = formatarDataMySQL(primeiroDia, horarioSelecionado.value)

    await $fetch('/api/agendamentos', {
      method: 'POST',
      body: {
        profissional_id: profissionalId.value,
        data_hora: dataCompleta,
        paciente_nome: pacienteNome.value,
        paciente_telefone: pacienteTelefone.value,
        paciente_email: pacienteEmail.value,
        observacoes: ''
      }
    })

    // Limpar formulário após salvar
    etapaAtual.value = 0
    profissionalId.value = null
    diasSelecionados.value = []
    horarioSelecionado.value = null
    pacienteNome.value = ''
    pacienteTelefone.value = ''
    pacienteEmail.value = ''

    // Emitir evento para fechar modal (se desejar)
    // $emit('saved')

  } catch (error) {
    console.error('Erro ao salvar agendamento:', error)
  }
}

// Gera string data+hora formato MySQL para o próximo dia da semana selecionado
function formatarDataMySQL(diaSemana: DiaAbreviado, horario: string): string {
  const hoje = new Date()
  const diaAlvo = mapaDias[diaSemana]
  const diff = (diaAlvo + 7 - hoje.getDay()) % 7 || 7

  const dataFinal = new Date()
  dataFinal.setDate(hoje.getDate() + diff)

  const dataStr = dataFinal.toISOString().split('T')[0]
  return `${dataStr} ${horario}:00`
}

function abrirCadastroPaciente() {
  emit('abrirCadastroPaciente')
}


// Voltar etapa
function voltarEtapa() {
  if (etapaAtual.value > 0) {
    etapaAtual.value--
  }
}
</script>