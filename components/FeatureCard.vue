<template>
    <div class="bg-white p-6 rounded-lg shadow text-left">
      <div class="text-3xl mb-2">{{ icon }}</div>
      <h3 class="font-semibold text-lg">{{ title }}</h3>
      <p class="text-sm text-gray-600">{{ description }}</p>
    </div>
  </template>
  
  <script setup>
  defineProps(['icon', 'title', 'description'])
  </script>
  