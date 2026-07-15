import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { createResolver, logger, defineNuxtModule, addComponent } from '@nuxt/kit'
import { $fetch } from 'ofetch'
import { version } from './package.json'

const { resolve } = createResolver(import.meta.url)
const require = createRequire(import.meta.url)

// That allows to overwrite these dependencies paths via `.env` for local development
const envModules = {
  tokens: process?.env?.THEME_DEV_TOKENS_PATH || '@nuxt-themes/tokens',
  elements: process?.env?.THEME_DEV_ELEMENTS_PATH || '@nuxt-themes/elements',
  typography: process?.env?.THEME_DEV_TYPOGRAPHY_PATH || '@nuxt-themes/typography'
}

const updateModule = defineNuxtModule({
  meta: {
    name: '@nuxt-themes/alpine'
  },
  setup (_, nuxt) {
    if (nuxt.options.dev) {
      $fetch('https://registry.npmjs.org/@nuxt-themes/alpine/latest').then((release) => {
        if (release.version > version) {
          logger.info(`A new version of Alpine (v${release.version}) is available: https://github.com/nuxt-themes/alpine/releases/latest`)
        }
      }).catch(() => {})
    }
  }
})

// `@nuxt-themes/elements` is kept as an extended layer even though none of its components are
// used directly: removing it broke Pinceau's postcss custom-media transform (`@sm`/`@md`/etc.
// stopped resolving to real `@media` queries at all, silently breaking every responsive layout
// in the theme). Verified via bisection: re-adding just this layer (nothing else changed) fixes
// it; the exact mechanism lives deep in an old, unmaintained toolchain (Pinceau + magicast + c12)
// not worth reverse-engineering further given elements costs nothing functionally to keep.
//
// It also ships its own global `components/globals/NuxtImg.vue` (a plain light/dark <img> swap
// helper) under the exact same component name as `@nuxt/image`'s real `NuxtImg`/`NuxtPicture`.
// Without this override, that stub silently wins the name collision and every `<NuxtImg>` in
// this theme (and in consumers) renders an unoptimized <img> with no resizing/format conversion.
const nuxtImageOverride = defineNuxtModule({
  meta: {
    name: 'alpine-nuxt-image-override'
  },
  setup () {
    const nuxtImageDist = dirname(require.resolve('@nuxt/image'))
    addComponent({
      name: 'NuxtImg',
      filePath: join(nuxtImageDist, 'runtime/components/NuxtImg.vue'),
      priority: 10
    })
    addComponent({
      name: 'NuxtPicture',
      filePath: join(nuxtImageDist, 'runtime/components/NuxtPicture.vue'),
      priority: 10
    })
  }
})

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {},
  extends: [envModules.typography, envModules.elements],
  runtimeConfig: {
    public: {
      FORMSPREE_URL: process.env.FORMSPREE_URL
    }
  },
  pages: true,
  modules: [
    envModules.tokens,
    '@nuxt/icon',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/i18n',
    updateModule as any,
    nuxtImageOverride as any
  ],
  // Provider is intentionally left unset here: it defaults to `ipx` (works anywhere).
  // Each consumer chooses its own hosting provider (e.g. `cloudflare`, `vercel`) via
  // its own `nuxt.config.ts` `image.provider` option, or the `NUXT_IMAGE_PROVIDER` env var —
  // no changes to this theme are needed to switch hosts.
  i18n: {
    locales: [
      { code: 'es', language: 'es-PE', name: 'Español', file: 'es.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'es',
    strategy: 'prefix',
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root'
    }
  },
  components: [
    { path: resolve('./components'), global: true },
    { path: resolve('./components/content'), global: true },
    { path: resolve('./components/data-entry'), global: true }
  ],
  css: [
    resolve('./assets/main.css'),
  ],
  colorMode: {
    classSuffix: ''
  },
  experimental: {
    asyncContext: true
  },
  typescript: {
    includeWorkspace: true
  },
  // Full static prerendering by default: this theme is built for content blogs where every
  // page's content is known at build time, so there's no need to keep a dynamic SSR server
  // running per-request. This also sidesteps a real Cloudflare Pages pitfall: `@nuxt/content`
  // v3's Cloudflare preset forces its runtime database to Cloudflare D1 (binding `DB`) for any
  // route rendered dynamically at request time — without a bound D1 database, every content
  // route 500s (surfaced to visitors as a bare 404). Prerendering means content queries only
  // run once at build time; the deployed worker never needs a runtime database at all, on
  // Cloudflare Pages or any other host. Consumers with genuinely dynamic routes (auth, live
  // data, etc.) can override this per-route via their own `routeRules`, e.g.
  // `routeRules: { '/dashboard/**': { prerender: false } }`.
  routeRules: {
    '/**': { prerender: true },
    // `@nuxt/image`'s `ipx` routes are resized on demand and don't exist as real content
    // pages — crawling them at build time requires `sharp`, which isn't available in most
    // CI/Cloudflare build environments and fails the whole prerender step with 500s. Leave
    // them dynamic; they still resolve normally at actual request time on hosts that support
    // `ipx` (or get redirected to that host's own image provider, e.g. Cloudflare's own
    // `cloudflare` provider, which never even generates `/_ipx/` URLs in the first place).
    '/_ipx/**': { prerender: false }
  },
  nitro: {
    prerender: {
      // `/` itself only ever returns a 302 redirect to the default locale (no HTML body for
      // the crawler to extract links from), so it can't discover anything on its own — seed
      // the crawler with the actual locale roots this theme's i18n config always produces.
      routes: ['/es', '/en'],
      crawlLinks: true,
      ignore: ['/__pinceau_tokens_config.json', '/__pinceau_tokens_schema.json']
    }
  },
})
