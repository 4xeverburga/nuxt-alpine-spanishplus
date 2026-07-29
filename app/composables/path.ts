export const withTrailingSlash = (path: string) => path.endsWith('/') ? path : `${path}/`

// Turns a root-relative path (e.g. "/articles/2026/july/foo-cover.svg") into a fully-qualified
// absolute URL using runtimeConfig.public.siteUrl. Open Graph/Twitter card images must be
// absolute per spec - left as a relative path, many link-preview tools and crawlers resolve it
// with a naive string concat against the *current page URL* instead of a proper relative-URL
// resolution against the origin. For a nested article route that silently produces a broken,
// duplicated URL (e.g. ".../articles/2026/july/foo/articles/2026/july/foo-cover.svg" instead of
// ".../articles/2026/july/foo-cover.svg") - the image 404s even though the raw file exists and
// the path stored in content frontmatter is correct. Leaves already-absolute URLs (http/https,
// e.g. externally hosted images) untouched, and falls back to returning the input unchanged if
// siteUrl isn't configured (e.g. this theme's own starter), same defensive fallback used for the
// WebSite JSON-LD schema in app/pages/index.vue.
export const toAbsoluteUrl = (path?: string) => {
  if (!path) return path
  if (/^https?:\/\//i.test(path)) return path
  const { public: { siteUrl } } = useRuntimeConfig()
  if (!siteUrl) return path
  return `${siteUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}
