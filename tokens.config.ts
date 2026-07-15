import theme from '@nuxt-themes/tokens/config'
import { defineTheme } from 'pinceau'

export default defineTheme({
  alpine: {
    $schema: {
      title: 'All the configurable tokens from Alpine.',
      tags: [
        '@studio-icon carbon:blog'
      ]
    },
    body: {
      backgroundColor: {
        initial: '{color.white}',
        dark: '{color.black}'
      },
      color: {
        initial: '{color.gray.800}',
        dark: '{color.gray.200}'
      }
    },
    backdrop: {
      backgroundColor: {
        initial: '#f4f4f5b3', // TODO: rgba({color.gray.100}, 0.7)
        dark: '#18181bb3' // TODO: rgba({color.gray.900}, 0.7)
      }
    },
    readableLine: '68ch'
  },
  layout: {
    container: {
      maxWidth: '64rem',
      // Pinceau fails to resolve `{space.N}` references from this config specifically once
      // `@nuxt-themes/elements` is no longer extended as a layer (a pre-existing, unexplained
      // reference-resolution quirk in this version of Pinceau/style-dictionary-esm — the
      // `space` scale itself is defined fine and used elsewhere without issue). Using the
      // literal rem values (equal to space.6/8/12/16) sidesteps it entirely.
      padding: {
        mobile: '1.5rem',
        xs: '2rem',
        sm: '3rem',
        md: '4rem'
      }
    }
  },
  color: {
    white: '#FFFFFF',
    // Default accent color. Downstream projects (Nuxt layers extending this
    // theme) can override it in their own `tokens.config.ts`, e.g.:
    //   export default defineTheme({ color: { primary: theme.color.pear } })
    // or with a fully custom palette (50-900 shades), e.g.:
    //   export default defineTheme({ color: { primary: { 50: '#...', ..., 900: '#...' } } })
    // @ts-expect-error theme colors aren't typed on the base palette
    primary: theme.color.lightblue
  },
  prose: {
    p: {
      fontSize: '18px'
    },
  }
})
