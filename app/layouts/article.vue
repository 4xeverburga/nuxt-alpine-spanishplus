<template>
  <article ref="article">
    <!-- TODO: could be refactored as a transparent ButtonLink -->
    <NuxtLink
      :to="parentPath"
      class="back"
    >
      <Icon name="ph:arrow-left" />
      <span>
        {{ $t('article.back') }}
      </span>
    </NuxtLink>
    <header>
      <h1
        v-if="page?.title"
        class="title"
      >
        {{ page.title }}
      </h1>
      <time
        v-if="page?.date"
        :datetime="page.date"
      >
        {{ formatDate(page.date) }}
      </time>
        <span v-if="page?.author?.name" class="author">
          &nbsp;•&nbsp;{{ $t('article.byAuthor') }} <strong>{{ page.author.name }}</strong>
        </span>
    </header>

    <div class="prose">
      <slot />
      <div
        v-if="alpine?.backToTop"
        class="back-to-top"
      >
        <ProseA @click.prevent.stop="onBackToTop">
          {{ resolveLocaleValue(alpine?.backToTop?.text) || $t('article.backToTop') }}
          <Icon :name="alpine?.backToTop?.icon || 'material-symbols:arrow-upward'" />
        </ProseA>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{ page?: any }>()
const page = computed(() => props.page)
const route = useRoute()
const alpine = useAppConfig().alpine
const { locale } = useI18n()

const resolveLocaleValue = (val: any) => {
  if (typeof val === 'object' && val !== null) return val[locale.value] || val.es || Object.values(val)[0]
  return val
}

const article = ref<HTMLElement | null>(null)

if (page.value) {
  const linkArray = []
  const metaArray = []
  
  if (page.value.cover) {
    metaArray.push({ property: 'og:image', content: toAbsoluteUrl(page.value.cover) })
  }
  if (page.value.canonical) {
    linkArray.push({ rel: 'canonical', href: page.value.canonical })
  }
  useHead({
    meta: metaArray,
    link: linkArray
  })
}

// Article paths look like `/{locale}/{section}/{year}/{month}/{slug}` (e.g.
// `/es/articles/2024/diciembre/haikus`). The parent to go "back" to is the section's
// year archive (`/es/articles/2024`), which is a real, crawlable route — not just the bare
// section index — so the back link preserves the exact year the reader was browsing.
// `filter(Boolean)` (rather than a fixed `pop()` count) also makes this immune to a stray
// trailing slash in `route.path` (e.g. from a shared link or a proxy normalizing URLs),
// which previously threw off the pop-count and produced a broken, non-existent link.
const parentPath = computed(
  () => {
    const segments = route.path.split('/').filter(Boolean)
    return `/${segments.slice(0, 3).join('/')}`
  }
)

const onBackToTop = () => {
  article.value?.scrollIntoView({
    behavior: 'smooth'
  })
}
</script>

<style scoped lang="ts">
css({
  article: {
    maxWidth: '{layout.container.maxWidth}',
    mx: 'auto',
    py: '{space.4}',
    '@sm': {
      py: '{space.12}',
    },
    '.back': {
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: '{text.lg.fontSize}',
      borderBottom: '1px solid {elements.border.secondary.static}',
      '& :deep(svg)': {
        width: '{size.16}',
        height: '{size.16}',
        marginRight: '{space.2}'
      }
    },
    header: {
      marginTop: '{space.16}',
      marginBottom: '{space.12}',
    },
    '.title': {
      fontSize: '{text.5xl.fontSize}',
      lineHeight: '{text.5xl.lineHeight}',
      fontWeight: '{fontWeight.semibold}',
      marginBottom: '{space.4}'
    },
    time: {
      color: '{elements.text.secondary.color.static}'
    },
    '.author': {
      fontSize: '0.95em',
      color: '#666',
      fontWeight: 'normal',
      marginLeft: '8px',
    },
    '.prose': {
      maxWidth: '{alpine.readableLine}',
      mx: 'auto',
      '.back-to-top': {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        a: {
          cursor: 'pointer',
          fontSize: '{text.lg.fontSize}'
        }
      },
      '& :deep(h1)': {
        display: 'none'
      },
      // Escapes the narrow readable-line column so a specific element (e.g. a hero image)
      // can span the same width as the navbar/Container, regardless of how narrow the
      // surrounding prose text is. `.hero-breakout` uses the classic full-bleed vw trick to
      // break out of its (narrow) parent; `.hero-breakout-inner` then re-applies the exact
      // same maxWidth + responsive padding tokens as `Container.vue`, so its content width is
      // pixel-identical to the navbar's content width at every breakpoint.
      '& :deep(.hero-breakout)': {
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
      },
      '& :deep(.hero-breakout-inner)': {
        maxWidth: '{layout.container.maxWidth}',
        mx: 'auto',
        px: '{layout.container.padding.mobile}',
        '@xs': {
          px: '{layout.container.padding.xs}',
        },
        '@sm': {
          px: '{layout.container.padding.sm}',
        },
        '@md': {
          px: '{layout.container.padding.md}',
        },
        img: {
          width: '100%',
        },
      },
    }
  }
})
</style>
