export default defineNuxtPlugin(() => {
  const user = useState('user', () => null)
  user.value = JSON.parse(localStorage.getItem('user') || 'null')
})
