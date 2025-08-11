<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { CalendarDaysIcon } from '@heroicons/vue/24/outline'
import { useHead } from '#imports'

useHead({
  title: 'Login | MedAgendaAPP'
})

definePageMeta({
  layout: 'blank'
})

const toast = useToast()
const router = useRouter()

const email = ref('')
const password = ref('')

const loading = ref(false)
const login = async () => {
  if (!email.value || !password.value) {
    toast.error('Preencha todos os campos.')
    return
  }

  loading.value = true

  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })

    if (!res.success) {
      toast.error(res.message)
      return
    }

    toast.success(`Bem-vindo, ${res.usuario.nome}!`)
    router.push('/dashboard')
  } catch (err) {
    toast.error('Erro ao tentar logar.')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const { user } = await $fetch('/api/auth/me')
    if (user) {
      router.push('/dashboard')
    }
  } catch {}
})

</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <!-- Logo e título -->
      <div class="flex items-center justify-center mb-4 gap-2">
        <CalendarDaysIcon class="h-6 w-6 text-blue-600" />
        <span class="text-xl font-bold text-blue-600">Med</span>
        <span class="text-xl font-bold text-gray-800">Agenda</span>
      </div>
      <h2 class="text-center text-gray-500 mb-6">Sistema de Gestão Médica</h2>

      <!-- Formulário -->
      <form @submit.prevent="login">
        <div class="mb-4 text-left">
          <label for="email" class="block text-gray-700 mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            v-model="email"
            placeholder="Digite seu e-mail"
            class="w-full border rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        <div class="mb-4 text-left">
          <label for="senha" class="block text-gray-700 mb-1">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            v-model="password"
            placeholder="Digite sua senha"
            class="w-full border rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        <div class="flex items-center justify-between text-sm text-gray-600 mb-6">
          <label for="lembrar" class="flex items-center gap-1">
            <input id="lembrar" name="lembrar" type="checkbox" />
            <span>Lembrar-me</span>
          </label>
          <a href="#" aria-label="Recuperar senha" class="hover:underline">Esqueceu sua senha?</a>
        </div>

        <button
          :disabled="loading"
          type="submit"
          class="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <span v-if="!loading">Entrar</span>
          <span v-else>Entrando...</span>
        </button>

      </form>
    </div>
  </div>
</template>
