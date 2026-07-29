<script setup lang="ts">
import { ref, computed } from 'vue'

const { locale } = useI18n()

const props = defineProps({
  path: {
    type: String,
    default: 'articles'
  },
  // Real route param (`/articles/2024`) when browsing a specific year's archive, passed down
  // by `app/pages/articles/[year].vue`. Left undefined on the bare `/articles` index page,
  // which falls back to the current year below.
  year: {
    type: Number,
    default: undefined
  }
})

const currentYear = computed(() => props.year ?? new Date().getFullYear())
const startYear = 2023
const maxVisibleYearsWithoutGaps = 4
const years = ref(Array.from({ length: new Date().getFullYear() - startYear + 1 }, (_, i) => new Date().getFullYear() - i))

const fetchArticles = async (year: number) => {
  const path = `/${locale.value}/${props.path}/${year}`
  const { data } = await useAsyncData(path, () =>
    queryCollection('content').where('path', 'LIKE', `${path}/%`).order('date', 'DESC').all()
  )
  return data
}

const _articles = ref(await fetchArticles(currentYear.value))

const articles = computed(() => _articles.value || [])

// Real navigation to `/{locale}/{path}/{year}` instead of a query-param + reload hack: gives
// each year archive its own crawlable, indexable static URL (better SEO) and makes the
// article "back" link land on a real page, since it derives the parent path from
// `route.path` segments — a real path segment survives that derivation; a query param does
// not.
const yearLink = (year: number) => `/${locale.value}/${props.path}/${year}`

const addGapMarkers = (visibleYears: number[]) => {
  const items: Array<number | string> = []

  visibleYears.forEach((year, index) => {
    if (index > 0 && year - visibleYears[index - 1] > 1) {
      items.push('...')
    }

    items.push(year)
  })

  return items
}

const yearButtons = computed(() => {
  if (years.value.length <= maxVisibleYearsWithoutGaps) {
    return years.value.slice().reverse()
  }

  const currentIndex = years.value.indexOf(currentYear.value)
  const buttons: number[] = []

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

  return addGapMarkers(buttons.reverse())
})

</script>

<template>
  <div>
    <div
      v-if="articles?.length"
      class="articles-list"
    >
      <div
        class="featured"
      >
        <ArticlesListItem
          :article="articles[0]"
          :featured="true"
        />
      </div>
      <div class="layout">
        <ArticlesListItem
          v-for="(article, index) in articles.slice(1)"
          :key="index"
          :article="article"
        />
      </div>
    </div>
    <div
      v-else
      class="tour"
    >
      <p>{{ $t('articles.empty', { year: currentYear }) }}</p>
    </div>
    <div class="spacing" />
    <div class="navigation-buttons">
      <template
        v-for="(item, index) in yearButtons"
        :key="`${item}-${index}`"
      >
        <span
          v-if="item === '...' || item === currentYear"
          class="nav-button"
        >
          {{ item }}
        </span>
        <NuxtLink
          v-else
          :to="yearLink(Number(item))"
          class="nav-button"
        >
          {{ item }}
        </NuxtLink>
      </template>
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
    '.nav-button': {
      display: 'inline-block',
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      textDecoration: 'none',
      color: 'inherit',
      '&:is(span)': {
        // Current year / gap marker: not a real link, styled as inactive.
        cursor: 'default',
        opacity: 0.5,
      }
    }
  }
})
</style>