import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@nuxt-themes/config/module',
    '@nuxtjs/design-tokens/module',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@nuxthq/studio'
  ],
  tailwindcss: {
    exposeConfig: true,
    injectPosition: 'last'
  },
  css: [
    // Including Inter CSS is the first component to reproduce HMR issue. It also causes playground to look better,
    // since Inter is a native font for Tailwind UI
    '@fontsource/inter/400.css',
    '@fontsource/inter/500.css',
    '@fontsource/inter/600.css',
    '@fontsource/inter/700.css'
  ],
  content: {
    documentDriven: true,
    navigation: {
      fields: ['navTitle']
    },
    highlight: {
      theme: 'one-dark-pro',
      preload: ['json', 'js', 'ts', 'html', 'css', 'vue', 'diff', 'shell', 'markdown', 'yaml', 'bash', 'ini', 'c', 'cpp']
    }
  },
  theme: {
    meta: {
      name: 'Alpine',
      description: 'Just a basic blog theme for Nuxt.',
      author: 'NuxtLabs'
    },
    options: true,
    tokens: true
  }
})
