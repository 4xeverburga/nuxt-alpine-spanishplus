<!--
  @nuxt/content v3 (via @nuxtjs/mdc) renders INLINE `code` with the `ProseCode` component, and
  fenced blocks with `ProsePre`. @nuxt-themes/typography 0.11 was written for content v2, where
  `ProseCode` was the full-width code-BLOCK wrapper (div.prose-code, width: 100%, filename, copy
  button) and inline code was `ProseCodeInline`. Without this override, every inline `code` in an
  article renders as a full-width block that breaks the paragraph/list item apart.
-->
<template>
  <ProseCodeInline><slot /></ProseCodeInline>
</template>
