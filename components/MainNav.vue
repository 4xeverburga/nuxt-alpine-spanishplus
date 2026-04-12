<script lang="ts" setup>
const { navigation } = useContent()
const { locale } = useI18n()

const emits = defineEmits(['linkClick'])

function handleClick() {
  emits('linkClick')
}

const localizedNavigation = computed(() => {
  if (!navigation.value) return []
  // Find the locale subtree in navigation (e.g. /es or /en)
  const localeRoot = navigation.value.find(
    (item: any) => item._path === `/${locale.value}`
  )
  return localeRoot?.children || navigation.value
})
</script>

<template>
  <nav>
    <ul>
      <li
        v-for="link of localizedNavigation"
        :key="link._path"
      >
        <NuxtLink
          :to="link._path"
          @click="handleClick"
        >
          <span class="underline-fx" />
          {{ link.title }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="ts">
css({
  nav: {
    ul: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      justifyContent: 'center',
      gap: '{space.4}',
      '@sm': {
        flexDirection: 'row',
        gap: '{space.8}',
      },
      a: {
        position: 'relative',
        '&.router-link-active': {
          color: '{color.primary.500}'
        },
        '.underline-fx': {
          position: 'absolute',
          bottom: '-4px',
          width: 0,
          height: '1px',
          backgroundColor: 'currentColor',
          transition: 'width 200ms ease-in-out',
          'a:hover &&': {
            width: '100%'
          }
        }
      },

    }
  }
})
</style>
