// middleware/auth.global.ts
type Usuario = {
    id: number
    nome: string
    tipo: string // ou 'usuarios_tipo' se tiver o tipo importado
  }
  
  export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useState<Usuario | null>('user', () => null)
  
    if (!user.value) {
      try {
        const data = await $fetch<{ user: Usuario | null }>('/api/auth/me', {
          credentials: 'include'
        })
        user.value = data.user
      } catch {
        return navigateTo('/login')
      }
    }
  
    if (!user.value && to.path !== '/login') {
      return navigateTo('/login')
    }
  })
  