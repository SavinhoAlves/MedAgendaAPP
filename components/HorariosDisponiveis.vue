<template>
  <div>
    <label class="block mb-2 font-semibold">Selecione um horário</label>

    <div class="grid grid-cols-3 gap-2">
      <div
        v-for="(hora, index) in todosHorarios"
        :key="index"
        class="flex items-center gap-1"
      >
        <button
          :class="[
            'w-full border px-4 py-2 rounded text-sm flex-1 transition',
            modelValue === hora ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
          ]"
          @click="$emit('update:modelValue', hora)"
        >
          {{ hora }}
        </button>

        <button
          v-if="index === todosHorarios.length - 1"
          @click="abrirModal"
          class="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-400"
        >
          <PlusIcon class="w-4 h-4 mx-auto" />
        </button>
      </div>

      <button
        v-if="todosHorarios.length === 0"
        @click="abrirModal"
        class="col-span-3 py-2 px-4 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 flex items-center justify-center gap-2"
      >
        <PlusIcon class="w-4 h-4" />
        Adicionar horário
      </button>
    </div>

    <!-- Modal -->
    <div
      v-if="mostrarModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
        <h2 class="text-lg font-semibold mb-4">Adicionar horário</h2>
        <input
          v-model="novaHora"
          type="time"
          class="w-full border rounded px-3 py-2 mb-4"
        />
        <div class="flex justify-end gap-2">
          <button
            @click="fecharModal"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            @click="adicionarHorarioPersonalizado"
            class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  modelValue: string
  inicio: string // ex: '07:00'  -> horario_inicio
  fim: string // ex: '17:00'    -> horario_fim
  intervalo: number // ex: 15   -> intervalo_minutos
  extraInicio?: string // ex: '17:15' -> hora_extra_inicio
  extraFim?: string // ex: '18:30'    -> hora_extra_fim
}>()

const emit = defineEmits(['update:modelValue'])

const mostrarModal = ref(false)
const novaHora = ref('')
const personalizados = ref<string[]>([])

function abrirModal() {
  novaHora.value = ''
  mostrarModal.value = true
}

function fecharModal() {
  mostrarModal.value = false
}

function adicionarHorarioPersonalizado() {
  if (
    novaHora.value &&
    !todosHorarios.value.includes(novaHora.value)
  ) {
    personalizados.value.push(novaHora.value)
    emit('update:modelValue', novaHora.value)
  }
  fecharModal()
}

function gerarHorarios(inicio: string, fim: string, intervalo: number): string[] {
  if (!inicio || !fim || intervalo <= 0) return []

  const result: string[] = []
  const [h1, m1] = inicio.split(':').map(Number)
  const [h2, m2] = fim.split(':').map(Number)

  let current = new Date()
  current.setHours(h1, m1, 0, 0)
  const end = new Date()
  end.setHours(h2, m2, 0, 0)

  while (current <= end) {
    result.push(current.toTimeString().slice(0, 5))
    current.setMinutes(current.getMinutes() + intervalo)
  }

  return result
}

// Horários principais
const horariosNormais = computed(() =>
  gerarHorarios(props.inicio, props.fim, props.intervalo)
)

// Horários extras
const horariosExtras = computed(() => {
  if (!props.extraInicio || !props.extraFim) return []
  return gerarHorarios(props.extraInicio, props.extraFim, props.intervalo)
})

const todosHorarios = computed(() =>
  [...horariosNormais.value, ...horariosExtras.value, ...personalizados.value].sort()
)
</script>
