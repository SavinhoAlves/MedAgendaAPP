<template>
    <div class="bg-white shadow rounded p-4">
      <p class="text-sm text-gray-500">{{ title }}</p>
      <p class="text-2xl font-bold text-primary mt-1">{{ value }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    title: string
    value: number
  }>()
  </script>
  