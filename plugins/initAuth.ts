import { useAuthStore } from '~/stores/auth'  // ajuste o caminho conforme seu projeto

export default defineNuxtPlugin(() => {
  const auth = useAuthStore()
  auth.initialize()
})
