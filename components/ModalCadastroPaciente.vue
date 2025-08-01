<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <!-- Cabeçalho -->
      <div class="flex justify-between items-center p-5 border-b">
        <h2 class="text-xl font-bold text-gray-900">Cadastrar Paciente</h2>
        <button
          @click="$emit('close')"
          aria-label="Fechar modal"
          class="text-gray-400 hover:text-red-500 text-2xl font-bold leading-none"
        >
          &times;
        </button>
      </div>

      <!-- enderecoulário -->
      <endereco @submit.prevent="salvarPaciente" class="p-6 space-y-6">
        <!-- Nome -->
        <div>
          <label for="nome" class="block font-semibold mb-2 text-gray-700">Nome *</label>
          <input
            id="nome"
            v-model="endereco.nome"
            type="text"
            required
            placeholder="Nome completo"
            class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Data nascimento e Telefone lado a lado -->
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label for="data_nascimento" class="block font-semibold mb-2 text-gray-700">Data de Nascimento</label>
            <input
              id="data_nascimento"
              v-model="endereco.data_nascimento"
              type="date"
              class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label for="telefone" class="block font-semibold mb-2 text-gray-700">Telefone</label>
            <input
              id="telefone"
              v-model="endereco.telefone"
              type="tel"
              placeholder="(11) 91234-5678"
              class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block font-semibold mb-2 text-gray-700">Email</label>
          <input
            id="email"
            v-model="endereco.email"
            type="email"
            placeholder="email@exemplo.com"
            class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Endereço completo agrupado -->
        <fieldset class="border border-gray-300 rounded-md p-4">
          <legend class="font-semibold text-gray-700 px-2">Endereço (opcional)</legend>

          <div class="space-y-4 mt-4">
            <div>
              <label for="rua" class="block font-semibold mb-2 text-gray-700">Rua</label>
              <input
                id="rua"
                v-model="endereco.rua"
                type="text"
                placeholder="Rua, Avenida, etc."
                class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div>
                <label for="numero" class="block font-semibold mb-2 text-gray-700">Número</label>
                <input
                  id="numero"
                  v-model="endereco.numero"
                  type="text"
                  placeholder="Número"
                  class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label for="complemento" class="block font-semibold mb-2 text-gray-700">Complemento</label>
                <input
                  id="complemento"
                  v-model="endereco.complemento"
                  type="text"
                  placeholder="Complemento"
                  class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label for="bairro" class="block font-semibold mb-2 text-gray-700">Bairro</label>
                <input
                  id="bairro"
                  v-model="endereco.bairro"
                  type="text"
                  placeholder="Bairro"
                  class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div class="grid grid-cols-4 gap-4">
              <div class="col-span-2">
                <label for="cidade" class="block font-semibold mb-2 text-gray-700">Cidade</label>
                <input
                  id="cidade"
                  v-model="endereco.cidade"
                  type="text"
                  placeholder="Cidade"
                  class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label for="uf" class="block font-semibold mb-2 text-gray-700">UF</label>
                <input
                  id="uf"
                  v-model="endereco.rua"
                  type="text"
                  maxlength="2"
                  placeholder="UF"
                  class="w-full border border-gray-300 rounded-md p-3 uppercase tracking-widest text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label for="cep" class="block font-semibold mb-2 text-gray-700">CEP</label>
                <input
                  id="cep"
                  v-model="endereco.cep"
                  type="text"
                  placeholder="CEP"
                  class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </fieldset>

        <!-- Botões -->
        <div class="flex justify-end gap-4 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-5 py-2 rounded border border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-600 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Salvar
          </button>
        </div>
      </endereco>

      <!-- Feedback -->
      <p v-if="erro" class="text-red-600 text-center mt-4 font-semibold">{{ erro }}</p>
      <p v-if="sucesso" class="text-green-600 text-center mt-4 font-semibold">{{ sucesso }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const emit = defineEmits(['close', 'saved'])

const paciente = reactive({
  nome: '',
  data_nascimento: '',
  telefone: '',
  email: ''
})

const endereco = reactive({
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  cep: ''
})

const erro = ref('')
const sucesso = ref('')

async function salvarPaciente() {
  erro.value = ''
  sucesso.value = ''

  if (!paciente.nome.trim()) {
    erro.value = 'O nome é obrigatório.'
    return
  }

  try {
    const pacienteCriado = await $fetch('/api/pacientes', {
      method: 'POST',
      body: {
        nome: paciente.nome,
        data_nascimento: paciente.data_nascimento || null,
        telefone: paciente.telefone || null,
        email: paciente.email || null,
        endereco: {
          rua: endereco.rua || null,
          numero: endereco.numero || null,
          complemento: endereco.complemento || null,
          bairro: endereco.bairro || null,
          cidade: endereco.cidade || null,
          uf: endereco.uf || null,
          cep: endereco.cep || null
        }
      }
    })

    sucesso.value = 'Paciente cadastrado com sucesso!'
    emit('saved', pacienteCriado)

    // Limpa enderecoulário
    Object.keys(paciente).forEach(k => (paciente[k as keyof typeof paciente] = ''))
    Object.keys(endereco).forEach(k => (endereco[k as keyof typeof endereco] = ''))
  } catch (e: any) {
    erro.value = e?.data?.message || 'Erro ao salvar paciente.'
  }
}
</script>

