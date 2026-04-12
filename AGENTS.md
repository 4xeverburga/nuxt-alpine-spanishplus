# Project Guidelines

## Overview

This is `@4verburga/alpine-spanishplus` — a Nuxt theme layer forked from `@nuxt-themes/alpine`, customized for a bilingual personal blog. Published to npm and consumed by blog projects (e.g., `meblog`) via `extends`.

## Architecture

- **Nuxt theme layer**: Not a standalone app. Consumed via `extends: '@4verburga/alpine-spanishplus'` in consumer projects.
- **Starter** (`.starters/default/`): Internal test harness that extends this theme via `workspace:*` link. Used for local dev and CI builds.
- **pnpm workspace**: Root package (the theme) + `.starters/default` (the test consumer).
- **Document-driven**: Uses `@nuxt/content` with `documentDriven: true`. Pages are markdown files in `content/`.

## Tech Stack

| Component | Version | Notes |
|-----------|---------|-------|
| Nuxt | 3.14.0 | Pinned. Requires jiti 2.x for Node 22 |
| Vue | ^3.5.0 | Required for `useId` composable |
| pnpm | 8.5.1 | Set via `packageManager` field |
| Node | 22+ | CI uses 22.14 |
| ufo | ^1.5.4 | Required for `joinRelativeURL` |

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
- **`publish.yml`**: Triggered by `workflow_run` after CI success. Uses npm OIDC trusted publishing (no `NPM_TOKEN`).
  - `dev` branch → publishes as `X.Y.Z-dev.<hash>` with `--tag dev`
  - `main` branch → publishes as `X.Y.Z` (latest)
  - The workflow YAML always runs from `main` (GitHub constraint), but checks out code from the triggering branch

**Important**: Any changes to `publish.yml` must be merged to `main` before they take effect.

## Conventions

- Branch `main` is protected — all changes via PR
- Version bumps go in their own commit: `chore: bump version to X.Y.Z`
- CI workflows use `--ignore-scripts` for `pnpm install` to avoid `nuxi prepare` failures in CI
- Components in `components/content/` and `components/data-entry/` are registered globally

## Content Structure

Articles are organized by year/month: `content/articles/YYYY/month/slug.md`

Layouts: `article` (for blog posts with author display), `default`, `page`
