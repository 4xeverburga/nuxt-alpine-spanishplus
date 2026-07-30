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

// Favicon is opt-in via `alpine.favicon` so the starter (which ships no branded icon) isn't
// forced into a broken/default one. Google's own favicon guidelines require a `<link rel="icon">`
// pointing at a stable, crawlable URL - without it, Google falls back to a generic globe/circle
// icon in search results (confirmed missing entirely before this change). SVG is an explicitly
// supported format per Google's docs, but a PNG fallback is included too for older
// browsers/bots and for `apple-touch-icon` (Apple never rasterizes SVG for home-screen icons).
useHead({
  link: [
    ...(alpine.favicon?.svg ? [{ rel: 'icon', type: 'image/svg+xml', href: alpine.favicon.svg }] : []),
    ...(alpine.favicon?.png ? [{ rel: 'icon', type: 'image/png', href: alpine.favicon.png }] : []),
    ...(alpine.favicon?.appleTouchIcon ? [{ rel: 'apple-touch-icon', href: alpine.favicon.appleTouchIcon }] : [])
  ]
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