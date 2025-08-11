export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  if (!auth.user) {
    return navigateTo('/login')
  }

  // Garante que auth.user possui a propriedade 'tipo'
  const userTipo = (auth.user as any).tipo

  if (to.meta.requiresAdmin && userTipo !== 'admin') {
    return navigateTo('/dashboard')
  }

  if (to.meta.requiresProfissional && userTipo !== 'profissional') {
    return navigateTo('/dashboard')
  }
})
