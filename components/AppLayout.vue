<script setup lang="ts">
const alpine = useAppConfig().alpine

defineProps({
  padded: {
    type: Boolean,
    default: true
  }
})

useSeoMeta({
  title: alpine.title,
  description: alpine.description,
  ogTitle: alpine.title,
  ogDescription: alpine.description,
  ogSiteName: alpine.siteName || alpine.title,
  ogImage: alpine.image && {
    // Must be absolute - see toAbsoluteUrl's comment (app/composables/path.ts) for why a
    // relative default image src silently breaks link previews on nested routes.
    url: toAbsoluteUrl(alpine.image.src),
    alt: alpine.image.alt,
    width: alpine.image.width,
    height: alpine.image.height
  },
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <Container class="app-layout">
    <AppLoadingBar />
    <AppHeader v-if="alpine.header" />
    <slot />
    <AppFooter v-if="alpine.footer" />
  </Container>
</template>

<style lang="ts" scoped>
css({
  '.app-layout': {
    minWidth: '{size.xs}'
  }
})
</style>