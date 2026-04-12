<script setup lang="ts">
import { withTrailingSlash } from 'ufo'
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { locale } = useI18n()

const props = defineProps({
  path: {
    type: String,
    default: 'articles'
  }
})

const currentYear = ref(parseInt(route.query.year as string) || new Date().getFullYear())
const startYear = 2023
const years = ref(Array.from({ length: new Date().getFullYear() - startYear + 1 }, (_, i) => new Date().getFullYear() - i))

const fetchArticles = async (year: number) => {
  const path = `${locale.value}/${props.path}/${year}`
  const { data } = await useAsyncData(path, async () => await queryContent(withTrailingSlash(path)).sort({ date: -1 }).find())
  return data
}

const _articles = ref(await fetchArticles(currentYear.value))

const articles = computed(() => _articles.value || [])

const updateYear = async (year: number) => {
  currentYear.value = year
  await router.push({ query: { year: currentYear.value } })
  window.location.reload()
}

const yearButtons = computed(() => {
  const currentIndex = years.value.indexOf(currentYear.value)
  const buttons = []

  if (currentIndex > 1) {
    buttons.push(years.value[0])
  }

  if (currentIndex > 0) {
    buttons.push(years.value[currentIndex - 1])
  }

  buttons.push(currentYear.value)

  if (currentIndex < years.value.length - 1) {
    buttons.push(years.value[currentIndex + 1])
  }

  if (currentIndex < years.value.length - 2) {
    buttons.push(years.value[years.value.length - 1])
  }

  return buttons.reverse()
})

</script>

<template>
  <div>
    <div v-if="articles?.length" class="articles-list">
      <div class="featured">
        <ArticlesListItem :article="articles[0]" :featured="true" />
      </div>
      <div class="layout">
        <ArticlesListItem v-for="(article, index) in articles.slice(1)" :key="index" :article="article" />
      </div>
    </div>
    <div v-else class="tour">
      <p>{{ $t('articles.empty', { year: currentYear }) }}</p>
    </div>
    <div class="spacing"> </div>
    <div class="navigation-buttons">
      <button
        v-for="year in yearButtons"
        :key="year"
        :disabled="year === currentYear"
        @click="updateYear(year)"
        class="nav-button"
      >
        {{ year }}
      </button>
    </div>
  </div>
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
  },
  '.navigation-buttons': {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      '&:disabled': {
      // cursor: 'not-allowed', not quite good looking
        opacity: 0.5,
      }
    }
  }
})
</style>