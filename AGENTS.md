# Project Guidelines

## Overview

This is `@4xeverburga/alpine-spanishplus` — a Nuxt theme layer forked from `@nuxt-themes/alpine`, customized for a bilingual personal blog. Published to both **npmjs.org** and **GitHub Packages** under the same scope and consumed by blog projects (e.g., `meblog`) via `extends`.

## Architecture

- **Nuxt theme layer**: Not a standalone app. Consumed via `extends: '@4xeverburga/alpine-spanishplus'` in consumer projects.
- **Starter** (`.starters/default/`): Internal test harness that extends this theme via `workspace:*` link. Used for local dev and CI builds.
- **pnpm workspace**: Root package (the theme) + `.starters/default` (the test consumer).
- **`app/` directory**: Nuxt 4 layers only auto-discover `pages/`, `layouts/`, `composables/`, `app.vue` from `<layer-root>/app/`, not the layer root itself. `components/` and `assets/` are explicitly resolved via absolute paths in `nuxt.config.ts` so they're exempt from this and stay at the theme root. `content.config.ts`, `nuxt.config.ts`, `tokens.config.ts`, and `app.config.ts` also stay at the theme root.
- **Content v3 collections, not document-driven**: `documentDriven` was removed in `@nuxt/content` v3. Routing is explicit: `app/pages/index.vue` (locale root) and `app/pages/[...slug].vue` (everything else) both call the shared `useContentPage()` composable (`app/composables/content-page.ts`), which queries `queryCollection('content').path(route.path).first()` and renders via `<ContentRenderer>` inside `<NuxtLayout :name="page.layout" :page="page">`. Layouts that need page data (e.g. `article`) receive it as a `page` prop, not via the removed `useContent()`.
- **`content.config.ts` lives in the consumer, not the theme**: `@nuxt/content` v3 collections resolve their `source` glob relative to wherever `content.config.ts` is defined. Since content lives in each consumer's own `content/` directory, each consumer (`.starters/default`, `meblog`, etc.) must define its own `content.config.ts` declaring a `content` collection — the theme's components (`ArticlesList`, `ArticlesIndex`, `MainNav`) all query a collection named `content` and expect it to exist.
- **i18n**: Uses `@nuxtjs/i18n@10` with `strategy: 'prefix'`. Content must be under locale folders (`content/es/`, `content/en/`). Default locale is `es`.
- **No Nuxt Studio**: `@nuxthq/studio` was dropped (no Nuxt 4-compatible release exists as of this writing). Content is edited directly in markdown/git, not through a visual editor.

## Tech Stack

| Component | Version | Notes |
|-----------|---------|-------|
| Nuxt | ^4.4.8 | Requires `experimental.asyncContext: true` — without it, composables called after an `await` (e.g. in `useContentPage()`, `MainNav`'s nav fetch) throw `[nuxt] instance unavailable` |
| Vue | ^3.5.34 | vue-router 5 requires `@vue/compiler-sfc@^3.5.34` |
| pnpm | 8.5.1 | Set via `packageManager` field |
| Node | 22+ | CI uses 22.14 |
| @nuxt/content | ^3.15.0 | SQL-backed collections via `queryCollection`, requires `better-sqlite3` as an explicit dependency (v3 tries to auto-install it otherwise, which fails non-interactively/in CI) |
| @nuxt/icon | ^2.3.1 | Replaces `nuxt-icon` (pulled in transitively by `@nuxt-themes/typography`), which is Nuxt-3-only and silently disables itself under Nuxt 4 |
| @nuxtjs/i18n | ^10.4.1 | `langDir` now resolves relative to `<rootDir>/i18n` by default — set to `'locales'`, not `'i18n/locales'` |
| @nuxt-themes/elements/tokens/typography | pinned, unmaintained | No releases since 2023, but confirmed working under Nuxt 4 as of this migration (verified by building with Studio/Content temporarily disabled before the full jump). **Do not remove `@nuxt-themes/elements`**, even though none of its components (Terminal, Sandbox, CodeGroup, VideoPlayer, etc.) are actually used anywhere in this theme or its consumers — its presence as an extended layer is required for Pinceau's postcss custom-media transform (`@sm`/`@md`/`@lg`/etc.) to resolve into real `@media` queries at all. Removing it silently breaks every responsive layout in the theme (verified via commit bisection: `@sm{...}` gets emitted as literal invalid CSS instead of `@media(min-width:...){...}`, with no error at build or dev time). The exact mechanism wasn't fully root-caused (something in Pinceau/magicast/c12's layer-merge order) — it's simply proven empirically that this layer must stay extended. |

Removed: `ufo`, `@vueuse/core` (no direct usage — see git history), `@nuxthq/studio`, `@nuxtjs/plausible` (module has no Nuxt 4 release; if a consumer needs analytics, add the Plausible `<script>` tag manually via `app.head.script` instead of the module), `nuxt.schema.ts` (existed only to feed Nuxt Studio's visual config UI).

## Build and Test

```bash
pnpm install --ignore-scripts   # Install deps (skip prepare to avoid jiti issues)
pnpm rebuild better-sqlite3     # --ignore-scripts also skips its native build; do this once after install
pnpm build                       # Build via .starters/default
pnpm dev                         # Dev server (may OOM locally — test in consumer project instead)
```

**Local testing workflow**: Pack the theme (`pnpm pack`) and install the tgz in a consumer project like `meblog`, then run `npm run dev` there. The starter dev server has memory issues.

## CI/CD

- **`ci.yml`** / **`ci-dev.yml`**: Build validation on `main` / `dev` branches
- **`publish.yml`**: Triggered by `workflow_run` after CI success. Publishes to **two registries**:
  1. **npmjs.org** as `@4xeverburga/alpine-spanishplus` — uses npm OIDC trusted publishing (no `NPM_TOKEN`)
  2. **GitHub Packages** (`npm.pkg.github.com`) as `@4xeverburga/alpine-spanishplus` — uses `GITHUB_TOKEN` with `packages:write` permission.
  - `dev` branch → publishes as `X.Y.Z-dev.<hash>` with `--tag dev`
  - `main` branch → publishes as `X.Y.Z` (latest)
  - The workflow YAML always runs from `main` (GitHub constraint), but checks out code from the triggering branch

**Important**: Any changes to `publish.yml` must be merged to `main` before they take effect.

### Versioning Rules

- **`dev` branch**: No version bump needed. The publish workflow auto-appends `-dev.<commit-hash>` to the version, so every push produces a unique version (e.g., `3.1.0-dev.f2f6949`).
- **`main` branch**: You **must** bump the version in `package.json` before merging a PR to `main`. npm rejects publishing a version that already exists. Bump in its own commit: `chore: bump version to X.Y.Z`.

## Conventions

- Branch `main` is protected — all changes via PR from dev.
- Version bumps go in their own commit: `chore: bump version to X.Y.Z`
- CI workflows use `--ignore-scripts` for `pnpm install` to avoid `nuxi prepare` failures in CI
- Components in `components/content/` and `components/data-entry/` are registered globally

## i18n / Bilingual Support

- Strategy: `prefix` — URLs are `/es/...` and `/en/...`, root `/` redirects to default locale (`es`)
- Locale files: `i18n/locales/es.json` and `i18n/locales/en.json`
- All user-facing text in components uses `$t()` lookups into the locale JSON files
- `LanguageSwitcher` component in `AppFooter` for switching locales
- `MainNav` filters navigation by locale subtree
- `ArticlesList` / `ArticlesIndex` prepend `locale.value` to content query paths
- `app/composables/date.ts` uses `useI18n().locale` for dynamic date formatting
- Consumer projects must organize content under `content/es/` and `content/en/`

## Content Structure

Articles are organized by locale and year/month: `content/{locale}/articles/YYYY/month/slug.md`

The starter (`.starters/default/`) has content in both `content/es/` and `content/en/`, but its demo articles aren't organized into year subfolders — so `ArticlesList`'s year filter will legitimately show "no articles" for every year on the starter. This is a pre-existing gap in the demo content, not a bug; real consumers (e.g. `meblog`) do use the year/month structure.

Layouts: `article` (for blog posts with author display), `default`, `page`. Layouts needing page data receive it via a `page` prop from `app/pages/index.vue` / `app/pages/[...slug].vue` (see Architecture).
