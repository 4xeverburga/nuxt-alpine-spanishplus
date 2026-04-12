<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() =>
  locales.value.filter((l: any) => l.code !== locale.value)
)
</script>

<template>
  <div class="language-switcher">
    <NuxtLink
      v-for="loc in availableLocales"
      :key="loc.code"
      :to="switchLocalePath(loc.code)"
      class="locale-link"
    >
      {{ loc.code.toUpperCase() }}
    </NuxtLink>
  </div>
</template>

<style scoped lang="ts">
css({
  '.language-switcher': {
    display: 'flex',
    alignItems: 'center',
    gap: '{space.2}',
    '.locale-link': {
      fontSize: '{text.sm.fontSize}',
      fontWeight: '{fontWeight.medium}',
      padding: '{space.1} {space.2}',
      borderRadius: '{radii.md}',
      '&:hover': {
        color: '{color.primary.500}',
      }
    }
  }
})
</style>
