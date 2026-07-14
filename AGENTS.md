# Project Guidelines

## Overview

This is `@4xeverburga/alpine-spanishplus` — a Nuxt theme layer forked from `@nuxt-themes/alpine`, customized for a bilingual personal blog. Published to both **npmjs.org** and **GitHub Packages** under the same scope and consumed by blog projects (e.g., `meblog`) via `extends`.

## Architecture

- **Nuxt theme layer**: Not a standalone app. Consumed via `extends: '@4xeverburga/alpine-spanishplus'` in consumer projects.
- **Starter** (`.starters/default/`): Internal test harness that extends this theme via `workspace:*` link. Used for local dev and CI builds.
- **pnpm workspace**: Root package (the theme) + `.starters/default` (the test consumer).
- **Document-driven**: Uses `@nuxt/content` with `documentDriven: true`. Pages are markdown files in `content/`.
- **i18n**: Uses `@nuxtjs/i18n@8.5.5` with `strategy: 'prefix'`. Content must be under locale folders (`content/es/`, `content/en/`). Default locale is `es`.

## Tech Stack

| Component | Version | Notes |
|-----------|---------|-------|
| Nuxt | 3.14.0 | Pinned. Requires jiti 2.x for Node 22 |
| Vue | ^3.5.0 | Required for `useId` composable |
| pnpm | 8.5.1 | Set via `packageManager` field |
| Node | 22+ | CI uses 22.14 |
| ufo | ^1.5.4 | Required for `joinRelativeURL` |
| @nuxtjs/i18n | ^8.5.5 | v9/v10 incompatible with @nuxt/kit@3.14.0 |

### pnpm Overrides (important)

The `pnpm.overrides` in `package.json` pin `@nuxt/kit@3.14.0`, `@nuxt/schema@3.14.0`, and `nuxt-component-meta@0.9.0`. These prevent transitive dependencies from pulling incompatible newer versions. Do not remove them without testing.

## Build and Test

```bash
pnpm install --ignore-scripts   # Install deps (skip prepare to avoid jiti issues)
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

- Branch `main` is protected — all changes via PR
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
- `composables/date.ts` uses `useI18n().locale` for dynamic date formatting
- Consumer projects must organize content under `content/es/` and `content/en/`

## Content Structure

Articles are organized by locale and year/month: `content/{locale}/articles/YYYY/month/slug.md`

The starter (`.starters/default/`) has content in both `content/es/` and `content/en/`.

Layouts: `article` (for blog posts with author display), `default`, `page`
