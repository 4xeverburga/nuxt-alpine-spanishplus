// `@nuxt/devtools` is a transitive dependency of `nuxt` itself (bundled for the built-in
// Shift+Alt+D integration), so it must be explicitly disabled here: leaving it enabled made
// the dev server's memory balloon unbounded (observed 3.7GB+ RSS within ~60s, still growing).
// Pinning the version doesn't help either: upgrading it standalone to the latest stable
// (3.2.4) fixed the leak but broke Pinceau's design token resolution instead — `enabled: false`
// is the only combination that avoids both problems.
export default defineNuxtConfig({
  extends: '@4xeverburga/alpine-spanishplus',
  devtools: { enabled: false }
})
