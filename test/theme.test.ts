import { fileURLToPath } from 'node:url'
import { spawn, execFileSync, type ChildProcess } from 'node:child_process'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

// These tests build and serve the theme's own starter (`.starters/default`) exactly the
// way a real consumer would — a real `nuxi build` in a child process, then the actual
// built server started as its own process — and inspect the real rendered HTML/CSS, not
// just component-usage/grep checks. Both regressions below were completely silent (zero
// errors or warnings at build or dev time) and only visible in the generated output.
const rootDir = fileURLToPath(new URL('..', import.meta.url))
const PORT = 31789
const BASE_URL = `http://127.0.0.1:${PORT}`

let server: ChildProcess

async function waitForServer (retries = 60) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${BASE_URL}/es`)
      if (res.ok) return
    } catch {
      // not up yet
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  throw new Error('Server did not become ready in time')
}

beforeAll(async () => {
  execFileSync('pnpm', ['build'], { cwd: rootDir, stdio: 'inherit' })

  server = spawn('node', ['.starters/default/.output/server/index.mjs'], {
    cwd: rootDir,
    env: { ...process.env, PORT: String(PORT), HOST: '127.0.0.1' },
    stdio: 'ignore'
  })

  await waitForServer()
})

afterAll(() => {
  server?.kill('SIGKILL')
})

describe('responsive layout (Pinceau custom-media transform)', () => {
  it('resolves @sm/@md/@lg breakpoints into real @media queries, not literal unresolved at-rules', async () => {
    const html = await (await fetch(`${BASE_URL}/es`)).text()

    // Regression: removing `@nuxt-themes/elements` from `extends` silently broke Pinceau's
    // postcss custom-media transform. `@sm{...}` was emitted as literal, invalid CSS instead
    // of being resolved to `@media (min-width: 640px){...}` — with no build/dev error at all.
    expect(html).not.toMatch(/@sm\{/)
    expect(html).not.toMatch(/@md\{/)
    expect(html).not.toMatch(/@lg\{/)
    expect(html).toMatch(/@media\s*\(min-width:\s*640px\)/)
  })

  it('hides the mobile menu button and shows the desktop nav at the `sm` breakpoint', async () => {
    const html = await (await fetch(`${BASE_URL}/es`)).text()

    // header .menu (mobile hamburger/dots) must be hidden, and header .main-nav (desktop
    // links) must switch to flex, once the `sm` breakpoint resolves correctly.
    expect(html).toMatch(/header \.menu[^{]*\{display:none/)
    expect(html).toMatch(/header \.main-nav[^{]*\{display:flex/)
  })
})

describe('NuxtImg / @nuxt/image', () => {
  it('resolves <NuxtImg> to the real @nuxt/image component, not a plain unoptimized <img>', async () => {
    const html = await (await fetch(`${BASE_URL}/es`)).text()

    // Regression: `@nuxt-themes/elements` ships its own global `NuxtImg.vue` (a plain
    // light/dark <img> swap helper) under the same component name as `@nuxt/image`'s real
    // `NuxtImg`. Without an explicit override, that stub silently wins the name collision
    // and every image renders unoptimized, with no resizing/format conversion at all.
    const imgTags = [...html.matchAll(/<img[^>]*>/g)].map(m => m[0])
    expect(imgTags.length).toBeGreaterThan(0)

    // The real @nuxt/image component adds `data-nuxt-img` and rewrites `src` through a
    // provider (`/_ipx/...` for the default ipx provider); the stub does neither.
    const optimizedImgTags = imgTags.filter(tag => tag.includes('data-nuxt-img'))
    expect(optimizedImgTags.length).toBe(imgTags.length)
  })
})

describe('smoke test', () => {
  it('builds and serves the starter successfully', async () => {
    const html = await (await fetch(`${BASE_URL}/es`)).text()
    expect(html).toContain('<html')
  })
})
