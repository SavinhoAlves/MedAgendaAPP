<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4"
  >
    <div class="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
      <h3 class="text-lg font-bold mb-4">Editar Profissional</h3>

      <form @submit.prevent="handleSalvar" class="space-y-4" novalidate>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="nome" class="block text-sm font-medium text-gray-700">Nome</label>
            <input id="nome" v-model="form.nome" type="text" class="input" required />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">E-mail</label>
            <input id="email" v-model="form.email" type="email" class="input" required />
          </div>

          <div>
            <label for="telefone" class="block text-sm font-medium text-gray-700">Telefone</label>
            <input id="telefone" v-model="form.telefone" type="tel" class="input" />
          </div>

          <div>
            <label for="tipo_conselho" class="block text-sm font-medium text-gray-700">Tipo Conselho</label>
            <input id="tipo_conselho" v-model="form.tipo_conselho" type="text" class="input" />
          </div>

          <div>
            <label for="numero_conselho" class="block text-sm font-medium text-gray-700">Nº Conselho</label>
            <input id="numero_conselho" v-model="form.numero_conselho" type="text" class="input" />
          </div>

          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select id="status" v-model="form.status" class="input">
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
        </div>

        <!-- Especialidades -->
        <div>
          <fieldset class="grid grid-cols-2 gap-2 max-h-48 overflow-auto border border-gray-300 rounded-lg p-3">
            <legend class="sr-only">Especialidades</legend>
            <label
              v-for="esp in especialidades"
              :key="esp.id"
              class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 py-1"
              :for="'especialidade-' + esp.id"
            >
              <input
                :id="'especialidade-' + esp.id"
                type="checkbox"
                :value="esp.id"
                v-model="form.especialidades_ids"
                class="form-checkbox h-4 w-4 text-blue-600"
              />
              <span class="text-sm">{{ esp.nome }}</span>
            </label>
          </fieldset>
        </div>

        <!-- Dias da Semana -->
        <div v-if="form.dias">
          <fieldset class="flex flex-wrap gap-3">
            <legend class="block text-sm font-medium text-gray-700 mb-1">Dias da Semana</legend>
            <button
              v-for="dia in diasSemana"
              :key="dia"
              type="button"
              @click.prevent="toggleDia(dia)"
              :aria-pressed="form.dias.includes(dia)"
              :class="[
                'px-3 py-1 rounded-lg text-sm font-medium focus:outline-none',
                form.dias.includes(dia) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              ]"
            >
              {{ dia }}
            </button>
          </fieldset>
        </div>

        <!-- Horários de Atendimento -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="horario_inicio" class="block text-sm font-medium text-gray-700">Início</label>
            <input id="horario_inicio" v-model="form.horario_inicio" type="time" class="input" />
          </div>

          <div>
            <label for="horario_fim" class="block text-sm font-medium text-gray-700">Fim</label>
            <input id="horario_fim" v-model="form.horario_fim" type="time" class="input" />
          </div>

          <div>
            <label for="intervalo_minutos" class="block text-sm font-medium text-gray-700">Intervalo (min)</label>
            <input id="intervalo_minutos" v-model.number="form.intervalo_minutos" type="number" class="input" min="1" />
          </div>
        </div>

        <!-- Horário Extra -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label for="hora_extra_inicio" class="block text-sm font-medium text-gray-700">Início Extra</label>
            <input id="hora_extra_inicio" v-model="form.hora_extra_inicio" type="time" class="input" />
          </div>

          <div>
            <label for="hora_extra_fim" class="block text-sm font-medium text-gray-700">Fim Extra</label>
            <input id="hora_extra_fim" v-model="form.hora_extra_fim" type="time" class="input" />
          </div>

          <div>
            <label for="intervalo_extra_minutos" class="block text-sm font-medium text-gray-700">Intervalo Extra (min)</label>
            <input id="intervalo_extra_minutos" v-model.number="form.intervalo_extra_minutos" type="number" class="input" min="1" />
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button type="button" class="text-gray-600 hover:text-black font-medium" @click="fechar">
            Cancelar
          </button>

          <button type="submit" :disabled="salvando" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow">
            {{ salvando ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>

        <button @click="fechar" class="absolute top-3 right-3 text-gray-400 hover:text-black" aria-label="Fechar modal" type="button">
          <XMarkIcon class="h-6 w-6 text-blue-600" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface ProfissionalEdit {
  id: number | null
  nome: string
  email: string
  telefone: string
  tipo_conselho: string
  numero_conselho: string
  especialidades_ids: number[]
  dias: string[]
  status: string
  horario_inicio: string
  horario_fim: string
  intervalo_minutos: number | null
  hora_extra_inicio: string
  hora_extra_fim: string
  intervalo_extra_minutos: number | null
}

const props = defineProps<{
  visible: boolean
  profissional: ProfissionalEdit | null
  especialidades: { id: number; nome: string }[]
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'salvo'): void
}>()

const form = ref<ProfissionalEdit>({
  id: null,
  nome: '',
  email: '',
  telefone: '',
  tipo_conselho: '',
  numero_conselho: '',
  especialidades_ids: [],
  dias: [],
  status: 'Ativo',
  horario_inicio: '',
  horario_fim: '',
  intervalo_minutos: null,
  hora_extra_inicio: '',
  hora_extra_fim: '',
  intervalo_extra_minutos: null,
})

const salvando = ref(false)

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// Atualiza o form quando o modal abre
watchEffect(() => {
  if (props.visible && props.profissional) {
    form.value = {
      id: props.profissional.id,
      nome: props.profissional.nome,
      email: props.profissional.email,
      telefone: props.profissional.telefone,
      tipo_conselho: props.profissional.tipo_conselho,
      numero_conselho: props.profissional.numero_conselho,
      especialidades_ids: [...(props.profissional.especialidades_ids ?? [])],
      dias: [...(props.profissional.dias ?? [])],
      status: props.profissional.status ?? 'Ativo',
      horario_inicio: props.profissional.horario_inicio ?? '',
      horario_fim: props.profissional.horario_fim ?? '',
      intervalo_minutos: props.profissional.intervalo_minutos ?? null,
      hora_extra_inicio: props.profissional.hora_extra_inicio ?? '',
      hora_extra_fim: props.profissional.hora_extra_fim ?? '',
      intervalo_extra_minutos: props.profissional.intervalo_extra_minutos ?? null,
    }
  }
})

function toggleDia(dia: string) {
  if (form.value.dias.includes(dia)) {
    form.value.dias = form.value.dias.filter(d => d !== dia)
  } else {
    form.value.dias.push(dia)
  }
}

function fechar() {
  emit('update:visible', false)
}

async function handleSalvar() {
  if (!form.value.nome || !form.value.email || form.value.especialidades_ids.length === 0) {
    alert('Preencha nome, e-mail e selecione ao menos uma especialidade.')
    return
  }

  salvando.value = true
  try {
    await $fetch(`/api/profissionais/${form.value.id}`, {
      method: 'put',
      body: form.value,
    })
    emit('salvo')
    fechar()
  } catch (error: any) {
    console.error('Erro ao salvar profissional:', error)
    alert('Erro ao salvar profissional.')
  } finally {
    salvando.value = false
  }
}
</script>
