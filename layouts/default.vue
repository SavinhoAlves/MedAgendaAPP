<template>
  <div class="flex min-h-screen bg-gray-50">
    <SideMenu />
    <main :class="[
        'transition-all duration-300 w-full p-6',
        collapsed ? 'ml-20' : 'ml-64'
      ]">
      <slot />
    </main>
  </div>
</template>

<script setup>
import SideMenu from '@/components/SideMenu.vue'
import { useSidebarCollapsed } from '@/composables/useSidebar'

const collapsed = useSidebarCollapsed()
</script>
