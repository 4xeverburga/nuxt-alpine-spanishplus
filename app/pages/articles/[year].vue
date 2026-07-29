<script setup lang="ts">
// Real, crawlable per-year archive route (`/articles/2024`, etc.) instead of the previous
// `?year=` query param approach. This fixes two things at once: (1) SEO — year archives are
// now distinct, indexable, static URLs instead of being invisible to crawlers behind a query
// param, and (2) the article "back" link, which derives its target purely from `route.path`
// segments — a real path segment survives that derivation reliably, unlike a query param.
const route = useRoute()
const { locale } = useI18n()

const year = computed(() => Number(route.params.year))

if (!Number.isInteger(year.value)) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

// Reuse the same content document as the bare `/articles` page for title/description/layout,
// keyed by the fixed collection path (not `route.path`, which differs per year).
const { data: page } = await useAsyncData(`articles-page:${locale.value}`, () =>
  queryCollection('content').path(`/${locale.value}/articles`).first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

useHead({
  title: page.value.title,
  meta: [
    { name: 'description', content: page.value.description }
  ]
})
</script>

<template>
  <NuxtLayout :name="page.layout || 'default'" :page="page">
    <ArticlesList path="articles" :year="year" />
  </NuxtLayout>
</template>
