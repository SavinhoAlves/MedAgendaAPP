<template>
  <!-- Menu fixo no topo -->
  <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow">
    <MainMenu />
  </div>

  <!-- Conteúdo principal -->
  <div class="pt-20 px-6 pb-6">
    <div class="flex flex-col md:flex-row items-center justify-between text-gray-600 mb-3 gap-4">
      <div class="text-center md:text-left md:w-1/2">
        <h2 class="text-xl font-bold">Gerenciamento de Profissionais</h2>
      </div>
      <div class="text-center md:text-right md:w-auto">
        <button
          @click="abrirModal = true; limparFormulario()"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow flex items-center gap-2"
          aria-label="Abrir modal para cadastrar profissional"
        >
          <PlusIcon class="h-5 w-5" />
          Cadastrar Profissional
        </button>
      </div>
    </div>

    <div class="border-t border-gray-200 mb-8"></div>

    <div v-if="profissionais.length === 0" class="text-center text-gray-500 py-20" role="alert" aria-live="polite">
      <p class="text-lg font-medium">Nenhum profissional cadastrado!</p>
    </div>

    <div v-else class="overflow-x-auto rounded-lg border border-gray-200" role="table" aria-label="Tabela de profissionais">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Nome</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Especialidades</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Tipo Conselho</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Nº Conselho</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Dias Atendimento</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Contato</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
            <th class="relative px-6 py-3 text-right text-xs text-gray-400">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="prof in profissionais" :key="prof.id ?? 'novo-profissional-' + prof.nome" class="hover:bg-gray-50">
            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{{ prof.nome }}</td>
            <td
              class="px-6 py-4 text-sm text-gray-700 max-w-[200px] truncate"
              :title="formatarEspecialidades(prof.especialidades)"
            >
              {{ formatarEspecialidades(prof.especialidades) }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{{ prof.tipo_conselho }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{{ prof.numero_conselho }}</td>
            <td
              class="px-6 py-4 text-sm text-gray-700 max-w-[160px] truncate"
              :title="Array.isArray(prof.dias) ? prof.dias.join(', ') : ''"
            >
              {{ Array.isArray(prof.dias) ? prof.dias.join(', ') : '—' }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-700 space-y-1">
              <div>{{ prof.telefone }}</div>
              <div class="text-blue-600 underline">{{ prof.email }}</div>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  prof.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]"
              >
                {{ prof.status }}
              </span>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium flex gap-4 justify-end">
              <button
                @click="editarProfissional(prof)"
                class="text-blue-600 hover:text-blue-900"
                aria-label="Editar profissional {{ prof.nome }}"
                type="button"
              >
                <PencilIcon class="h-5 w-5" />
              </button>
              <button @click="tentarExcluir(prof.id)" class="text-red-600 hover:text-red-900" aria-label="Excluir profissional {{ prof.nome }}" type="button">
                <TrashIcon class="h-5 w-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Cadastro -->
    <Transition name="fade">
      <div
        v-if="abrirModal"
        class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalCadastroTitulo"
      >
        <div
          class="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]"
          @keydown.esc="abrirModal = false"
          tabindex="0"
        >
          <h3 id="modalCadastroTitulo" class="text-lg font-bold mb-4">
            Cadastrar Profissional
          </h3>

          <form @submit.prevent="handleCadastrarProfissional" class="space-y-4" novalidate>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="nome" class="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  id="nome"
                  v-model="novoProfissional.nome"
                  type="text"
                  required
                  class="input"
                  autocomplete="name"
                />
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">E-mail</label>
                <input
                  id="email"
                  v-model="novoProfissional.email"
                  type="email"
                  required
                  class="input"
                  autocomplete="email"
                />
              </div>

              <div>
                <label for="telefone" class="block text-sm font-medium text-gray-700">Telefone</label>
                <input
                  id="telefone"
                  v-model="novoProfissional.telefone"
                  type="tel"
                  required
                  class="input"
                  autocomplete="tel"
                />
              </div>

              <div>
                <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                <select id="status" v-model="novoProfissional.status" required class="input" aria-required="true">
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              <div>
                <label for="tipo_conselho" class="block text-sm font-medium text-gray-700">Tipo Conselho</label>
                <input
                  id="tipo_conselho"
                  v-model="novoProfissional.tipo_conselho"
                  type="text"
                  required
                  class="input"
                />
              </div>

              <div>
                <label for="numero_conselho" class="block text-sm font-medium text-gray-700">Nº Conselho</label>
                <input
                  id="numero_conselho"
                  v-model="novoProfissional.numero_conselho"
                  type="text"
                  required
                  class="input"
                />
              </div>
            </div>

            <!-- Especialidades -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Especialidades</label>
              <div
                role="group"
                aria-label="Selecionar especialidades"
                class="grid grid-cols-2 gap-2 max-h-48 overflow-auto border border-gray-300 rounded-lg p-3"
              >
                <label
                  v-for="esp in especialidades"
                  :key="esp.id"
                  class="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="esp.id"
                    v-model="novoProfissional.especialidades_ids"
                    class="form-checkbox h-4 w-4 text-blue-600"
                    :aria-checked="novoProfissional.especialidades_ids.includes(esp.id)"
                  />
                  <span class="text-sm">{{ esp.nome }}</span>
                </label>
              </div>
            </div>

            <!-- Dias da Semana -->
            <div class="mb-1">
              <label class="block text-sm font-medium text-gray-700" id="dias-label">Dias da Semana</label>
            </div>

            <div
              class="flex flex-wrap gap-3"
              role="group"
              :aria-labelledby="'dias-label'"
            >
              <button
                v-for="dia in diasSemana"
                :key="dia"
                type="button"
                class="px-5 py-2 border rounded-md text-base font-semibold transition-colors duration-200"
                :class="novoProfissional.dias.includes(dia)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'"
                @click="toggleDia(dia)"
                :aria-pressed="novoProfissional.dias.includes(dia)"
              >
                {{ dia }}
              </button>
            </div>

            <!-- Horas de atendimento -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label for="horario_inicio" class="block text-sm font-medium text-gray-700">Horário Início</label>
                <input
                  id="horario_inicio"
                  v-model="novoProfissional.horario_inicio"
                  type="time"
                  required
                  class="input"
                />
              </div>

              <div>
                <label for="horario_fim" class="block text-sm font-medium text-gray-700">Horário Fim</label>
                <input
                  id="horario_fim"
                  v-model="novoProfissional.horario_fim"
                  type="time"
                  required
                  class="input"
                />
              </div>

              <div>
                <label for="intervalo_minutos" class="block text-sm font-medium text-gray-700">Intervalo (minutos)</label>
                <input
                  id="intervalo_minutos"
                  v-model.number="novoProfissional.intervalo_minutos"
                  type="number"
                  min="1"
                  required
                  class="input"
                />
              </div>
            </div>

            <!-- Horários Extras -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label for="hora_extra_inicio" class="block text-sm font-medium text-gray-700">Extra Início</label>
                <input
                  id="hora_extra_inicio"
                  v-model="novoProfissional.hora_extra_inicio"
                  type="time"
                  class="input"
                />
              </div>

              <div>
                <label for="hora_extra_fim" class="block text-sm font-medium text-gray-700">Extra Fim</label>
                <input
                  id="hora_extra_fim"
                  v-model="novoProfissional.hora_extra_fim"
                  type="time"
                  class="input"
                />
              </div>

              <div>
                <label for="intervalo_extra_minutos" class="block text-sm font-medium text-gray-700">Intervalo Extra (minutos)</label>
                <input
                  id="intervalo_extra_minutos"
                  v-model.number="novoProfissional.intervalo_extra_minutos"
                  type="number"
                  min="1"
                  class="input"
                />
              </div>
            </div>

            <!-- Botões -->
            <div class="flex justify-end gap-3 pt-4">
              <button type="button" class="text-gray-600 hover:text-black font-medium" @click="abrirModal = false">
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="salvando"
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow"
              >
                {{ salvando ? 'Salvando...' : 'Cadastrar' }}
              </button>
            </div>
          </form>

          <!-- Botão de fechar (ícone) -->
          <button
            @click="abrirModal = false"
            class="absolute top-3 right-3 text-gray-400 hover:text-black"
            aria-label="Fechar modal de cadastro"
          >
            <XMarkIcon class="h-6 w-6 text-blue-600" />
          </button>
        </div>
      </div>
    </Transition>

    <!-- Modal de edição -->
    <ModalEditarProfissional
      v-if="profissionalEditar"
      :visible="abrirModalEditar"
      :profissional="profissionalEditar"
      :especialidades="especialidades"
      @salvo="onSalvo"
      @update:visible="abrirModalEditar = $event"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHead } from '#imports'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import Swal from 'sweetalert2'
import ModalEditarProfissional from '~/components/ModalEditarProfissional.vue'

interface Profissional {
  id: number | null
  nome: string
  email: string
  telefone: string
  tipo_conselho: string
  numero_conselho: string
  status: string
  dias: string[]
  especialidades: { id: number; nome: string }[]
  usuario?: string

  // Horários normais
  horario_inicio: string
  horario_fim: string
  intervalo_minutos: number | null

  // Horários extras
  hora_extra_inicio: string
  hora_extra_fim: string
  intervalo_extra_minutos: number | null
}

export interface ProfissionalEdit {
  id: number | null;
  nome: string;
  email: string;
  telefone: string;
  tipo_conselho: string;
  numero_conselho: string;
  status: string;
  dias: string[];
  especialidades: { id: number; nome: string }[];
  especialidades_ids: number[];
  usuario?: string;

  // Adicione esses campos:
  horario_inicio: string;
  horario_fim: string;
  intervalo_minutos: number | null;
  hora_extra_inicio: string;
  hora_extra_fim: string;
  intervalo_extra_minutos: number | null;
}

interface Especialidade {
  id: number
  nome: string
}

const modalAberto = ref(false)
const profissionalSelecionado = ref(null)

const profissionais = ref<Profissional[]>([])
const especialidades = ref<Especialidade[]>([])

const abrirModal = ref(false)
const salvando = ref(false)

const novoProfissional = ref({
  nome: '',
  email: '',
  telefone: '',
  tipo_conselho: '',
  numero_conselho: '',
  status: 'Ativo',
  especialidades_ids: [] as number[],
  dias: [] as string[],

  // Horários normais
  horario_inicio: '',
  horario_fim: '',
  intervalo_minutos: null as number | null,

  // Horários extras
  hora_extra_inicio: '',
  hora_extra_fim: '',
  intervalo_extra_minutos: null as number | null
})

const abrirModalEditar = ref(false)
const profissionalEditar = ref<ProfissionalEdit | null>(null)

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

useHead({ title: 'Profissionais | MedAgendaAPP' })

async function fetchProfissionais() {
  try {
    const response = await $fetch<Profissional[]>('/api/profissionais')
    profissionais.value = response
  } catch (err) {
    console.error('Erro ao buscar profissionais:', err)
  }
}

async function fetchEspecialidades() {
  try {
    const response = await $fetch<Especialidade[]>('/api/especialidades')
    especialidades.value = response
  } catch (err) {
    console.error('Erro ao buscar especialidades:', err)
  }
}

function limparFormulario() {
  novoProfissional.value = {
    nome: '',
    email: '',
    telefone: '',
    tipo_conselho: '',
    numero_conselho: '',
    status: 'Ativo',
    especialidades_ids: [] as number[], // Corrigido
    dias: [] as string[],               // Corrigido

    // Horários normais
    horario_inicio: '',
    horario_fim: '',
    intervalo_minutos: null,           // Deve ser number ou null

    // Horários extras
    hora_extra_inicio: '',
    hora_extra_fim: '',
    intervalo_extra_minutos: null      // Deve ser number ou null
  }
}

async function handleCadastrarProfissional() {
  try {
    salvando.value = true

    const payload = {
      ...novoProfissional.value,
      usuario_id: 1, // ajustar conforme usuário logado
    }

    await $fetch('/api/profissionais', {
      method: 'post',
      body: payload,
    })

    Swal.fire('Cadastrado!', 'Profissional cadastrado com sucesso.', 'success')

    abrirModal.value = false
    limparFormulario()
    await fetchProfissionais()
  } catch (error: any) {
    console.error('Erro:', error)
    Swal.fire('Erro', error?.data?.message || 'Erro ao salvar profissional.', 'error')
  } finally {
    salvando.value = false
  }
}

async function excluirProfissional(id: number) {
  try {
    await $fetch(`/api/profissionais/${id}`, { method: 'post' })
    Swal.fire('Excluído!', 'O profissional foi excluído.', 'success')
    await fetchProfissionais()
  } catch (error) {
    console.error(error)
    Swal.fire('Erro', 'Erro ao excluir profissional.', 'error')
  }
}

async function tentarExcluir(id: number | null) {
  if (id === null) return

  const { isConfirmed } = await Swal.fire({
    title: 'Excluir profissional?',
    text: 'Essa ação não poderá ser desfeita.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar',
  })

  if (!isConfirmed) return

  try {
    const response = await $fetch(`/api/profissionais/${id}`, {
      method: 'DELETE',
    })

    if (response.statusCode === 200) {
      Swal.fire('Excluído!', 'O profissional foi excluído com sucesso.', 'success')
      await fetchProfissionais() // ✅ Atualiza a lista visivelmente
    } else {
      throw new Error(response.message)
    }
  } catch (error: any) {
    console.error('Erro ao excluir:', error)
    Swal.fire('Erro', 'Não foi possível excluir o profissional.', 'error')
  }
}

function editarProfissional(prof: Profissional) {
  profissionalEditar.value = {
    ...prof,
    especialidades_ids: prof.especialidades?.map((e: any) => e.id) || [],
    horario_inicio: prof.horario_inicio ?? '',
    horario_fim: prof.horario_fim ?? '',
    intervalo_minutos: prof.intervalo_minutos ?? null,
    hora_extra_inicio: prof.hora_extra_inicio ?? '',
    hora_extra_fim: prof.hora_extra_fim ?? '',
    intervalo_extra_minutos: prof.intervalo_extra_minutos ?? null,
  } as ProfissionalEdit

  abrirModalEditar.value = true
}

function toggleDia(dia: string) {
  const dias = novoProfissional.value.dias
  novoProfissional.value.dias = dias.includes(dia) ? dias.filter(d => d !== dia) : [...dias, dia]
}

function formatarEspecialidades(especialidades?: { nome: string }[]) {
  if (!especialidades || especialidades.length === 0) {
    return 'Sem especialidade'
  }
  return especialidades.map(e => e.nome).join(', ')
}

function onSalvo() {
  abrirModalEditar.value = false
  fetchProfissionais()
}

onMounted(() => {
  fetchProfissionais()
  fetchEspecialidades()
})
</script>
