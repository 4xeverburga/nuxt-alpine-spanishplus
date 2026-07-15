<script setup lang="ts">
import ArticleIndexEntry from './ArticleIndexEntry.vue'

const { locale } = useI18n()

const props = defineProps({
  path: {
    type: String,
    default: 'articles'
  }
})

const contentPath = computed(() => `/${locale.value}/${props.path}`)

// Namespaced (not just the bare content path) so this can never collide with another
// `useAsyncData` call using the same path as its key elsewhere in the app — Nitro's
// static prerenderer renders multiple routes concurrently and shares the Nuxt payload
// cache across them, so two calls with an identical key can otherwise race and one can
// observe the other's still-pending promise instead of the resolved array.
const { data: _articles } = await useAsyncData(`articles-index:${contentPath.value}`, () =>
  queryCollection('content').where('path', 'LIKE', `${contentPath.value}/%`).order('date', 'DESC').all()
)

const articles = computed(() => (Array.isArray(_articles.value) ? _articles.value : []).map((article) => {
  const date = new Date(article.date)
  return { ...article, year: date.getFullYear(), month: date.getMonth() }
}))


</script>

<template>
  <!-- TODO: group the outputs of article.path on each year and month -->
  <ArticleIndexEntry  v-for="(article, index) in articles" :key="index" :article="article" />
  <!-- <d>DEBUG: articulo de indice 0 {{articles[0]}}</d> -->

</template>

<style scoped lang="ts">
css({
  '.articles-list': {
    '@sm': {
      px: '{space.12}',
    },
    '@md': {
      px: 0,
    },
    '.featured': {
      my: '{space.12}',
      '@md': {
        my: '{space.8}',
      }
    },
    '.layout': {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
      gap: '{space.12}',
      '@md': {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '{space.8}',
      },
      '@lg': {
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      },
    }
  },
  '.tour': {
    minHeight: '30vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
</style>
