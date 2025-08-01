<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Agendas Cadastradas</h1>

    <div v-if="loading" class="text-gray-500">Carregando agendas...</div>

    <div v-else-if="agendas.length === 0" class="text-gray-500">Nenhuma agenda cadastrada.</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="agenda in agendas"
        :key="agenda.id"
        class="bg-white shadow rounded-xl p-4 border border-gray-200"
      >
        <!-- Cabeçalho com nome e data -->
        <div class="flex items-center justify-between mb-2">
          <h2 class="font-semibold text-lg text-gray-700">{{ agenda.nome }}</h2>
          <span class="text-sm text-gray-500">{{ formatDate(agenda.data) }}</span>
        </div>

        <!-- Informações básicas -->
        <div class="text-sm text-gray-600 space-y-1">
          <p><strong>{{ agenda.tipo_conselho }}:</strong> {{ agenda.numero_conselho }}</p>
          <p><strong>Telefone:</strong> {{ agenda.telefone }}</p>
          <p><strong>Especialidades:</strong> {{ agenda.area }}</p>
          <p><strong>Descrição:</strong> {{ agenda.descricao || '---' }}</p>
        </div>

        <!-- Rodapé com estatísticas -->
        <div class="mt-4 flex items-center justify-between text-sm text-gray-700">
          <span>
            <strong>{{ agenda.total_agendamentos }}</strong> agendamentos
          </span>
          <span>
            <strong>{{ agenda.agendamentos_hoje }}</strong> consultas hoje
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

const agendas = ref<any[]>([])
const loading = ref(true)

const formatDate = (date: string) => {
  return dayjs(date).locale('pt-br').format('ddd, DD [de] MMM')
}

interface Agenda {
  id: number
  data: string
  profissional: string
  // adicione os campos que realmente vêm do backend
}

onMounted(async () => {
  try {
    const res = await $fetch<Agenda[]>('/api/agendas')
    agendas.value = res
  } catch (error) {
    console.error('Erro ao carregar agendas:', error)
  } finally {
    loading.value = false
  }
})

</script>
