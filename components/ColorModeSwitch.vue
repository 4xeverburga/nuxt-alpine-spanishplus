<script setup lang="ts">
const colorMode = useColorMode()
const onClick = () => {
  const values = ['system', 'light', 'dark']
  const index = values.indexOf(colorMode.preference)
  const next = (index + 1) % values.length

  colorMode.preference = values[next]
}
</script>

<template>
  <button :aria-label="$t('colorMode.label')" @click="onClick">
    <ColorScheme>
      <template v-if="colorMode.preference === 'dark'">
        <Icon name="uil:moon" />
        <span class="sr-only">{{ $t('colorMode.dark') }}</span>
      </template>
      <template v-else-if="colorMode.preference === 'light'">
        <Icon name="uil:sun" />
        <span class="sr-only">{{ $t('colorMode.light') }}</span>
      </template>
      <template v-else>
        <Icon name="uil:desktop" />
        <span class="sr-only">{{ $t('colorMode.system') }}</span>
      </template>
    </ColorScheme>
  </button>
</template>

<style scoped lang="ts">
css({
  button: {
    display: 'flex',
    '--color-mode-switcher-size': '24px',
    width: 'var(--color-mode-switcher-size)',
    height: 'var(--color-mode-switcher-size)',
    ':hover': {
      color: '{color.primary.500}',
    },
    svg: {
      width: '100%',
      height: '100%',
    }
  }
})
</style>
