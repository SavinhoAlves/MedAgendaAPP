<script setup>
import {
  CalendarDaysIcon,
  ClockIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
} from '@heroicons/vue/24/outline'
import { useHead } from '#app'

useHead({ title: 'MedAgendaAPP - Gerenciamento de agendas médicas' });

</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Navbar -->
    <header class="flex items-center justify-between px-6 py-4 border-b shadow-sm">
      <div class="flex items-center gap-2">
        <CalendarDaysIcon class="h-6 w-6 text-blue-600" />
        <span class="text-xl font-semibold text-blue-600">Med</span><span class="text-xl font-semibold text-gray-900">Agenda</span>
      </div>
      <NuxtLink to="/login" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
        Acessar Sistema
      </NuxtLink>
    </header>

    <!-- Conteúdo principal -->
    <main class="flex-1 flex flex-col items-center justify-center px-4 text-center mt-12">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
        Sistema de Agendamento <br />
        <span class="text-blue-600">Médico Profissional</span>
      </h1>
      <p class="mt-4 text-gray-600 max-w-xl">
        Gerencie seus agendamentos de forma simples e eficiente. Calendário interativo, comprovantes automáticos e interface moderna.
      </p>

      <!-- Cartões -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <div class="bg-white shadow-md rounded-xl px-6 py-6 text-center">
          <div class="flex justify-center mb-3">
            <CalendarDaysIcon class="h-8 w-8 text-blue-600" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">Calendário Interativo</h3>
          <p class="text-sm text-gray-500 mt-1">Visualize e agende consultas clicando diretamente nas datas disponíveis.</p>
        </div>

        <div class="bg-white shadow-md rounded-xl px-6 py-6 text-center">
          <div class="flex justify-center mb-3">
            <ClockIcon class="h-8 w-8 text-blue-600" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">Horários Flexíveis</h3>
          <p class="text-sm text-gray-500 mt-1">Escolha entre diversos horários ao longo do dia.</p>
        </div>

        <div class="bg-white shadow-md rounded-xl px-6 py-6 text-center">
          <div class="flex justify-center mb-3">
            <DocumentTextIcon class="h-8 w-8 text-blue-600" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">Comprovantes Automáticos</h3>
          <p class="text-sm text-gray-500 mt-1">Escolha entre diversos horários ao longo do dia.</p>
        </div>

        <div class="bg-white shadow-md rounded-xl px-6 py-6 text-center">
          <div class="flex justify-center mb-3">
            <ShieldCheckIcon class="h-8 w-8 text-blue-600" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">Sistema Seguro</h3>
          <p class="text-sm text-gray-500 mt-1">Escolha entre diversos horários ao longo do dia.</p>
        </div>
      </div>

      <!-- Botão -->
      <NuxtLink to="/login">
        <button class="mt-10 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-3 rounded-xl shadow-md">
          Começar Agora
        </button>
      </NuxtLink>
    </main>

    <!-- Rodapé -->
    <footer class="text-center text-sm text-gray-500 mt-12 mb-4">
      © 2025 MedAgenda. Sistema de agendamento médico profissional.
    </footer>
  </div>
</template>
