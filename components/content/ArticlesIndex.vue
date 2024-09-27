<script setup lang="ts">
import { withTrailingSlash } from 'ufo'
import ArticleIndexEntry from './ArticleIndexEntry.vue';

const props = defineProps({
  path: {
    type: String,
    default: 'articles'
  }
})

// @ts-ignore
const { data: _articles } = await useAsyncData(props.path, async () => await queryContent(withTrailingSlash(props.path)).sort({ date: -1 }).find())

// create new fields year and month
// const articles = computed(() => _articles.value || [])
const articles = computed(() => _articles.value.map((article) => {
  const date = new Date(article.date)
  article.year = date.getFullYear()
  article.month = date.getMonth()
  return article
}) || [])


</script>

<template>
  <!-- TODO: group the outputs of article._path on each year and month -->
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
