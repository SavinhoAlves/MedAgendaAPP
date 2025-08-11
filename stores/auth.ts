export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { id: number; nome: string; tipo: string },
    token: null as null | string,
  }),
  actions: {
    login(user: { id: number; nome: string; tipo: string }, token: string) {
      this.user = user
      this.token = token
      localStorage.setItem('auth_user', JSON.stringify(user))
      localStorage.setItem('auth_token', token)
    },
    initialize() {
      const user = localStorage.getItem('auth_user')
      const token = localStorage.getItem('auth_token')
      if (user && token) {
        this.user = JSON.parse(user)
        this.token = token
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
    },
  },
})
