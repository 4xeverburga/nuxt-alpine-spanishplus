<script setup lang="ts">
const page = await useContentPage()

// Google's "site name" feature (the bold label shown in search results, separate from the
// per-page title) is generated from WebSite structured data on the home page - this is
// weighted higher than og:site_name/<title>. Without it, Google can fall back to showing the
// raw domain (e.g. 4verburga.kekeros.com) instead of the brand name. alternateName is listed
// in preference order, with the bare domain itself last as the documented "last resort"
// fallback if the primary name isn't selected.
// https://developers.google.com/search/docs/appearance/site-names
const appConfig = useAppConfig()
const { public: { siteUrl } } = useRuntimeConfig()
const siteName = appConfig.alpine.siteName || appConfig.alpine.title

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName,
        alternateName: [
          ...(appConfig.alpine.siteAlternateNames || []),
          siteUrl.replace(/^https?:\/\//, '')
        ],
        url: siteUrl
      })
    }
  ]
})
</script>

<template>
  <NuxtLayout :name="page.layout || 'default'" :page="page">
    <ContentRenderer :value="page" />
  </NuxtLayout>
</template>
