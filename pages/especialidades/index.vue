<template>
  <!-- Menu fixo no topo -->
  <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow">
    <MainMenu />
  </div>

  <!-- Conteúdo principal -->
  <div class="pt-20 px-6 pb-6">
    <div class="flex flex-col md:flex-row items-center justify-between text-gray-600 mb-3 gap-4">
      <div class="text-center md:text-left md:w-1/2">
        <h2 class="text-xl font-bold">Gerenciamento de Especialidades</h2>
      </div>
      <div class="text-center md:text-right md:w-auto">
        <button
          @click="abrirModal = true; limparFormulario()"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow flex items-center gap-2"
          aria-label="Abrir modal para cadastrar especialidade"
        >
          <PlusIcon class="h-5 w-5" />
          Cadastrar Especialidade
        </button>
      </div>
    </div>

    <div class="border-t border-gray-200 mb-8"></div>

    <div v-if="especialidades.length === 0" class="text-center text-gray-500 py-20" role="alert" aria-live="polite">
      <p class="text-lg font-medium">Nenhuma especialidade cadastrada!</p>
    </div>

    <div v-else class="overflow-x-auto rounded-lg border border-gray-200" role="table" aria-label="Tabela de especialidades">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Nome</th>
            <th class="relative px-6 py-3 text-right text-xs text-gray-400">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="esp in especialidades" :key="esp.id" class="hover:bg-gray-50">
            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{{ esp.nome }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium flex gap-4 justify-end">
              <button
                @click="editarEspecialidade(esp)"
                class="text-blue-600 hover:text-blue-900"
                aria-label="Editar especialidade {{ esp.nome }}"
                type="button"
              >
                <PencilIcon class="h-5 w-5" />
              </button>
              <button
                @click="tentarExcluir(esp.id)"
                class="text-red-600 hover:text-red-900"
                aria-label="Excluir especialidade {{ esp.nome }}"
                type="button"
              >
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
          class="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative overflow-y-auto"
          @keydown.esc="abrirModal = false"
          tabindex="0"
        >
          <h3 id="modalCadastroTitulo" class="text-lg font-bold mb-4">
            Cadastrar Especialidade
          </h3>

          <form @submit.prevent="handleCadastrarEspecialidade" class="space-y-4" novalidate>
            <div>
              <label for="nome" class="block text-sm font-medium text-gray-700">Nome</label>
              <input
                id="nome"
                v-model="novaEspecialidade.nome"
                type="text"
                required
                class="input"
                autocomplete="off"
              />
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                class="text-gray-600 hover:text-black font-medium"
                @click="abrirModal = false"
              >
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

          <button
            @click="abrirModal = false"
            class="absolute top-3 right-3 text-gray-400 hover:text-black"
            aria-label="Fechar modal de cadastro"
          >
            <XMarkIcon class="h-6 w-6 text-blue-600"  />
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHead } from '#imports'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import Swal from 'sweetalert2'

interface Especialidade {
  id: number
  nome: string
}

const especialidades = ref<Especialidade[]>([])
const novaEspecialidade = ref({ nome: '' })
const abrirModal = ref(false)
const salvando = ref(false)

useHead({ title: 'Especialidades | MedAgendaAPP' })

async function fetchEspecialidades() {
  try {
    const response = await $fetch<Especialidade[]>('/api/especialidades')
    especialidades.value = response
  } catch (err) {
    console.error('Erro ao buscar especialidades:', err)
  }
}

function limparFormulario() {
  novaEspecialidade.value = { nome: '' }
}

async function handleCadastrarEspecialidade() {
  try {
    salvando.value = true
    const payload = { ...novaEspecialidade.value }
    await $fetch('/api/especialidades', {
      method: 'post',
      body: payload,
    })
    Swal.fire('Cadastrada!', 'Especialidade cadastrada com sucesso.', 'success')
    abrirModal.value = false
    limparFormulario()
    await fetchEspecialidades()
  } catch (error: any) {
    console.error('Erro:', error)
    Swal.fire('Erro', error?.data?.message || 'Erro ao salvar especialidade.', 'error')
  } finally {
    salvando.value = false
  }
}

async function excluirEspecialidade(id: number) {
  try {
    await $fetch(`/api/especialidades/${id}`, { method: 'delete' })
    Swal.fire('Excluída!', 'A especialidade foi excluída.', 'success')
    await fetchEspecialidades()
  } catch (error) {
    console.error(error)
    Swal.fire('Erro', 'Erro ao excluir especialidade.', 'error')
  }
}

async function tentarExcluir(id: number | null) {
  if (id === null) return
  const { isConfirmed } = await Swal.fire({
    title: 'Excluir especialidade?',
    text: 'Essa ação não poderá ser desfeita.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar',
  })
  if (isConfirmed) {
    await excluirEspecialidade(id)
  }
}

function editarEspecialidade(esp: Especialidade) {
  novaEspecialidade.value = { ...esp }
  abrirModal.value = true
}

onMounted(() => {
  fetchEspecialidades()
})
</script>

<style scoped>
.input {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50;
}
</style>
