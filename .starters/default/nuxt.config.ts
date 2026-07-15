// `@nuxt/devtools` is a transitive dependency of `nuxt` itself (bundled for the built-in
// Shift+Alt+D integration), so it must be explicitly disabled here: leaving it enabled made
// the dev server's memory balloon unbounded (observed 3.7GB+ RSS within ~60s, still growing).
// Pinning the version doesn't help either: upgrading it standalone to the latest stable
// (3.2.4) fixed the leak but broke Pinceau's design token resolution instead — `enabled: false`
// is the only combination that avoids both problems.
export default defineNuxtConfig({
  extends: '@4xeverburga/alpine-spanishplus',
  devtools: { enabled: false },
  // GitHub Pages serves this repo's demo under a subpath (https://<org>.github.io/<repo>/),
  // not the domain root, so every asset/link needs that prefix baked in at build time.
  // `GITHUB_PAGES` is a custom env var set only by `.github/workflows/demo.yml` — everywhere
  // else (local dev, the theme's own CI/test builds) this stays unset and the site builds
  // for the domain root as normal.
  app: {
    baseURL: process.env.GITHUB_PAGES ? '/nuxt-alpine-spanishplus/' : '/'
  }
})
