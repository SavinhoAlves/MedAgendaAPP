<!-- components/Timeline.vue -->
<template>
  <div class="relative border-l-2 border-blue-500 ml-4 mt-4">
    <div
      v-for="(evento, index) in eventos"
      :key="index"
      class="mb-6 ml-4"
    >
      <div class="absolute w-4 h-4 bg-blue-500 rounded-full -left-2.5 top-1.5"></div>
      <div class="bg-white shadow p-4 rounded-md border">
        <p class="text-sm text-gray-500">{{ evento.data }}</p>
        <p class="font-semibold">{{ evento.titulo }}</p>
        <p class="text-gray-700">{{ evento.descricao }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const eventos = [
  {
    data: '11/07/2025 - 09:00',
    titulo: 'Consulta com Dr. João',
    descricao: 'Paciente: Maria Silva, Clínica Geral',
  },
  {
    data: '11/07/2025 - 11:00',
    titulo: 'Retorno com Dra. Ana',
    descricao: 'Paciente: Carlos Souza, Dermatologia',
  }
  // ... puxar do banco futuramente
]
</script>
