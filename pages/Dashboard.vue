<template>
    <div :class="['p-2 space-y-6', containerClasses]">
      <!-- Título -->
      <div>
        <h1 class="text-2xl font-semibold">Painel do MedAgenda</h1>
        <p class="text-gray-500">Visão geral do sistema de agendamentos</p>
      </div>
  
      <!-- Indicadores -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard title="Consultas Hoje" :value="25" />
        <DashboardCard title="Consultas Semana" :value="112" />
        <DashboardCard title="Pacientes Ativos" :value="356" />
        <DashboardCard title="Profissionais" :value="14" />
      </div>
  
      <!-- Gráfico e Agenda -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Placeholder de gráfico -->
        <div class="bg-white shadow rounded p-4">
          <h2 class="text-lg font-medium mb-2">Consultas por Especialidade</h2>
          <div class="h-64 flex items-center justify-center text-gray-400">
            (Gráfico aqui)
          </div>
        </div>
  
        <!-- Consultas do dia -->
        <div class="bg-white shadow rounded p-4">
          <h2 class="text-lg font-medium mb-2">Consultas de Hoje</h2>
          <ul class="divide-y divide-gray-100 max-h-64 overflow-y-auto">
            <li
              v-for="consulta in consultasHoje"
              :key="consulta.id"
              class="py-3"
            >
              <p class="font-medium">{{ consulta.paciente }}</p>
              <p class="text-sm text-gray-500">
                {{ consulta.profissional }} - {{ consulta.horario }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useHead } from '#imports'
  import { useSidebarCollapsed } from '@/composables/useSidebar'

  const collapsed = useSidebarCollapsed()
  
  useHead({
    title: 'Dashboard - MedAgenda'
  })
  
  definePageMeta({
    middleware: ['auth'],
    requiresAdmin: true
  })
  
  const consultasHoje = [
    { id: 1, paciente: 'Maria Silva', profissional: 'Dr. João - Cardiologia', horario: '08:30' },
    { id: 2, paciente: 'Carlos Mendes', profissional: 'Dra. Ana - Dermatologia', horario: '10:00' },
    { id: 3, paciente: 'Luciana Lima', profissional: 'Dr. Pedro - Ortopedia', horario: '11:15' },
  ]
  
  const containerClasses = computed(() => {
    return collapsed.value ? '' : 'ml-3'
  })
  

function definePageMeta(arg0: { middleware: string[]; requiresAdmin: boolean }) {
    throw new Error('Function not implemented.')
}
</script>
  