<script setup lang="ts">
const page = await useContentPage()
</script>

<template>
  <NuxtLayout :name="page.layout || 'default'" :page="page">
    <ContentRenderer :value="page" />
  </NuxtLayout>
</template>
