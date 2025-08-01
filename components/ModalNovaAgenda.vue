<template>
  <div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-lg w-full max-w-lg">
      <!-- Cabeçalho -->
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-lg font-bold">Nova Agenda</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-red-500 text-xl font-bold">×</button>
      </div>

      <!-- Corpo -->
      <div class="p-4 space-y-4">
        <div>
          <label class="block mb-2 text-sm">Profissional:</label>
          <select v-model="profissionalId" class="w-full border p-2 rounded" @change="carregarDiasProfissional">
            <option value="" disabled>Selecione um profissional</option>
            <option v-for="prof in profissionais" :key="prof.id" :value="prof.id">
              {{ prof.nome }}
            </option>
          </select>
        </div>

        <div v-if="diasSelecionados.length">
          <label class="block mb-1 text-sm">Dias de atendimento:</label>
          <p class="text-gray-700">
            {{ diasSelecionados.join(', ') }}
          </p>
        </div>
      </div>

      <!-- Rodapé -->
      <div class="flex justify-end p-4 border-t">
        <button
          @click="salvarAgenda"
          :disabled="!profissionalId"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Criar Agenda
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const profissionalId = ref('')
const profissionais = ref<any[]>([])
const diasSelecionados = ref<string[]>([])

onMounted(async () => {
  profissionais.value = await $fetch('/api/profissionais')
})

async function carregarDiasProfissional() {
  const profissional = profissionais.value.find(p => p.id === parseInt(profissionalId.value))
  if (!profissional) return

  const diasRaw = profissional.dias_atendimento // Atenção: nome correto do campo

  const mapDiaCompletoParaAbreviado: Record<string, string> = {
    'Domingo': 'Dom',
    'Segunda': 'Seg',
    'Terça': 'Ter',
    'Quarta': 'Qua',
    'Quinta': 'Qui',
    'Sexta': 'Sex',
    'Sábado': 'Sáb'
  }

  if (typeof diasRaw === 'string') {
    diasSelecionados.value = diasRaw
      .split(',')
      .map((dia: string) => mapDiaCompletoParaAbreviado[dia.trim()])
      .filter(Boolean)
  } else {
    diasSelecionados.value = []
  }
}

async function salvarAgenda() {
  try {
    await $fetch('/api/agendas', {
      method: 'POST',
      body: {
        profissional_id: parseInt(profissionalId.value),
        data: '2025-07-30 14:00:00', // Substituir futuramente por seleção dinâmica
        cliente_nome: 'Paciente Teste',
        descricao: 'Consulta de rotina'
      }
    })

    window.location.reload()
  } catch (error) {
    console.error('Erro ao salvar agenda:', error)
  }
}
</script>