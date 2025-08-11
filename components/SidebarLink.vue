<template>
    <NuxtLink
      :to="to"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors"
      :class="[
        $route.path === '/', 
        isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100',
        collapsed ? 'justify-center' : ''
      ]"
    >
      <component :is="icon" class="w-5 h-5" />
      <span v-if="!collapsed">{{ label }}</span>
    </NuxtLink>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  
  const props = defineProps<{
    to: string
    icon: any
    label: string
    collapsed: boolean
  }>()
  
  const route = useRoute()
  
  // Verifica se a rota atual bate com o link
  const isActive = computed(() => {
  if (props.to.toLowerCase() === '/dashboard') {
    return route.path === '/' || route.path.toLowerCase().startsWith('/dashboard')
  }
  return route.path.toLowerCase().startsWith(props.to.toLowerCase())
})

  </script>
  
  