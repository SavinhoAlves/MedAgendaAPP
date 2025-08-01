import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { id: number, nome: string, tipo: string }
  }),
  actions: {
    async loadUserFromCookie() {
      try {
        const { user } = await $fetch('/api/auth/me')
        this.user = user
      } catch (err) {
        console.error('Erro ao carregar usuário:', err)
        this.user = null
      }
    },
    logout() {
      this.user = null
      // Aqui você pode fazer um endpoint que limpa o cookie, se quiser
    }
  }
})
