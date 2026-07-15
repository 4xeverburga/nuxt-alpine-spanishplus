<script setup lang="ts">
import type { PropType } from 'vue'

type HTMLElementsTags = keyof HTMLElementTagNameMap

defineProps({
  as: {
    type: String as PropType<HTMLElementsTags>,
    required: false,
    default: 'div'
  },
  padded: {
    type: Boolean,
    default: true
  },
  fluid: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <component
    :is="as"
    class="container"
    :class="{ padded, fluid }"
  >
    <slot />
  </component>
</template>

<style lang="ts" scoped>
css({
  '.container': {
    marginInlineStart: 'auto',
    marginInlineEnd: 'auto',
    width: '100%',

    '&.padded': {
      px: '{layout.container.padding.mobile}',
      '@xs': {
        px: '{layout.container.padding.xs}'
      },
      '@sm': {
        px: '{layout.container.padding.sm}'
      },
      '@md': {
        px: '{layout.container.padding.md}'
      }
    },

    '&:not(.fluid)': {
      maxWidth: '{layout.container.maxWidth}'
    }
  }
})
</style>
