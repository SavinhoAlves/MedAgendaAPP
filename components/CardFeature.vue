<template>
  <div class="card">
    <div class="card-icon">{{ icon }}</div>
    <div class="card-title">{{ title }}</div>
    <div class="card-desc">{{ desc }}</div>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  title: String,
  desc: String
})
</script>
