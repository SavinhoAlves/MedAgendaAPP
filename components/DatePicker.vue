<template>
  <div class="w-full p-4 border rounded shadow bg-white">
    <div class="flex items-center justify-between mb-4">
      <button @click="mesAnterior">‹</button>
      <h2 class="font-semibold">
        {{ meses[mes] }} {{ ano }}
      </h2>
      <button @click="mesSeguinte">›</button>
    </div>

    <!-- Abreviações no topo -->
    <div class="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-600">
      <div v-for="(dia, i) in diasAbreviados" :key="i">{{ dia }}</div>
    </div>

    <div class="grid grid-cols-7 gap-2 mt-2 text-center text-sm">
      <!-- Usando array diasBrancos para renderizar os espaços vazios -->
      <div v-for="(blank, i) in diasBrancos" :key="'blank-' + i">&nbsp;</div>

      <div
        v-for="(dia, index) in diasMes"
        :key="index"
        class="flex items-center justify-center h-14 w-14 rounded-lg text-base font-semibold transition duration-150 ease-in-out"
        :class="[
            isSelecionado(dia)
            ? 'bg-green-600 text-white ring-2 ring-green-800'
            : isDiaPermitido(dia)
            ? 'bg-green-200 hover:bg-green-300 text-black cursor-pointer'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        ]"
        @click="isDiaPermitido(dia) && selecionarDia(dia)"
      >
        {{ dia }}
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: string
  diasAtendimento: string[] | string
}>()

const emit = defineEmits(['update:modelValue'])

const diasAbreviados = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const nomesCompletos = [
  'Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira',
  'Quinta-Feira', 'Sexta-Feira', 'Sábado'
]
const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const hoje = new Date()
const mes = ref(hoje.getMonth())
const ano = ref(hoje.getFullYear())

const primeiroDiaMes = computed(() => new Date(ano.value, mes.value, 1).getDay())
const diasBrancos = computed(() => Array.from({ length: primeiroDiaMes.value }))
const diasNoMes = computed(() => new Date(ano.value, mes.value + 1, 0).getDate())
const diasMes = computed(() => Array.from({ length: diasNoMes.value }, (_, i) => i + 1))

function normalizeDia(dia: string) {
  return dia.toLowerCase().trim()
}

const diasPermitidos = computed(() => {
  const entrada = Array.isArray(props.diasAtendimento)
    ? props.diasAtendimento
    : typeof props.diasAtendimento === 'string'
      ? props.diasAtendimento.split(',')
      : []

  return entrada.map(normalizeDia)
})

function isDiaPermitido(dia: number) {
  const data = new Date(ano.value, mes.value, dia)
  const diaSemana = normalizeDia(nomesCompletos[data.getDay()])
  return diasPermitidos.value.includes(diaSemana)
}

function formatarData(data: Date) {
  const yyyy = data.getFullYear()
  const mm = String(data.getMonth() + 1).padStart(2, '0')
  const dd = String(data.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function isSelecionado(dia: number) {
  const data = new Date(ano.value, mes.value, dia, 12)

  const yyyy = data.getFullYear()
  const mm = String(data.getMonth() + 1).padStart(2, '0')
  const dd = String(data.getDate()).padStart(2, '0')

  return props.modelValue === `${yyyy}-${mm}-${dd}`
}

function selecionarDia(dia: number) {
  if (!isDiaPermitido(dia)) return
  const data = new Date(ano.value, mes.value, dia, 12) // o '12' evita fuso/offset

  const yyyy = data.getFullYear()
  const mm = String(data.getMonth() + 1).padStart(2, '0')
  const dd = String(data.getDate()).padStart(2, '0')

  emit('update:modelValue', `${yyyy}-${mm}-${dd}`)
}

function mesAnterior() {
  if (mes.value === 0) {
    mes.value = 11
    ano.value--
  } else {
    mes.value--
  }
}

function mesSeguinte() {
  if (mes.value === 11) {
    mes.value = 0
    ano.value++
  } else {
    mes.value++
  }
}
</script>