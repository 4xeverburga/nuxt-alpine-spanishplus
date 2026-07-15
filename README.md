# Alpine Spanish Plus

Fork en español del tema [Alpine](https://github.com/nuxt-themes/alpine) de Nuxt, empaquetado como capa reutilizable para sitios basados en Nuxt Content.

## Características

- Capa de tema Nuxt: extiende configuración, layouts, componentes, estilos y utilidades
- Traducciones y adaptaciones al español
- Starter interno en `.starters/default` para validación de build

## Instalación

```bash
npm install @4xeverburga/alpine-spanishplus
```

Luego extiende tu proyecto en `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: '@4xeverburga/alpine-spanishplus'
})
```

## Despliegue: prerenderizado estático por defecto

Este tema genera el sitio como **estático por defecto** (`routeRules: { '/**': { prerender: true } }`), pensado para blogs de contenido donde todo se conoce en tiempo de build. Esto evita un problema real en Cloudflare Pages: `@nuxt/content` v3 fuerza su base de datos en tiempo de ejecución a Cloudflare D1 (binding `DB`) para cualquier ruta renderizada dinámicamente — sin una base D1 vinculada, cada ruta de contenido falla en el servidor y se ve como un 404 genérico ante el visitante, no como un error de base de datos.

Si tu proyecto necesita rutas realmente dinámicas (auth, datos en vivo, etc.), puedes desactivar el prerenderizado por ruta desde tu propio `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: '@4xeverburga/alpine-spanishplus',
  routeRules: {
    '/dashboard/**': { prerender: false }
  }
})
```

**Si despliegas en Cloudflare Pages**, además del prerenderizado hay una limitación propia de Cloudflare a tener en cuenta: el preset `cloudflare_pages` genera un `_worker.js` con un `_routes.json` que tiene un tope duro de **100 entradas**. Si tu sitio supera ese número de páginas prerenderizadas (artículos, por ejemplo), algunas páginas caen silenciosamente al worker en vez de servirse como archivos estáticos, reproduciendo el mismo problema de D1 solo para esas rutas. La solución es forzar el preset `cloudflare_pages_static` (que omite el worker por completo) en el build de Cloudflare:

```ts
export default defineNuxtConfig({
  extends: '@4xeverburga/alpine-spanishplus',
  nitro: {
    preset: process.env.CF_PAGES ? 'cloudflare_pages_static' : undefined
  }
})
```

Cualquier ruta de servidor propia (`server/routes/*.ts`) que no esté enlazada con un `<a href>` real en el sitio no será descubierta por el crawler de prerenderizado — agrégala explícitamente a `nitro.prerender.routes` en tu propio `nuxt.config.ts`.

**En Vercel** (u otros hosts sin este requisito de D1 ni límite de rutas) el mismo prerenderizado por defecto simplemente produce un sitio estático normal, sin configuración adicional.

## Desarrollo local

```bash
pnpm install
pnpm dev       # Levanta el starter interno
pnpm build     # Compila el starter interno
```

### Probar cambios sin publicar en npm

**Opción 1: tarball (recomendada)**

```bash
# En este repo
pnpm pack

# En tu proyecto consumidor
npm install ../nuxt-alpine-spanishplus/<archivo-generado>.tgz
```

**Opción 2: dependencia local por ruta**

En el `package.json` de tu proyecto consumidor, usa una dependencia tipo `file:` apuntando a este repo e instala dependencias.

**Opción 3: link local**

Vincula el paquete con `pnpm link` y úsalo como dependencia enlazada en tu proyecto.

## CI/CD

| Workflow | Archivo | Rama | Descripción |
|---|---|---|---|
| ci-main | `.github/workflows/ci.yml` | `main` | Valida build en push y PR |
| ci-dev | `.github/workflows/ci-dev.yml` | `dev` | Valida build en push y PR |
| publish | `.github/workflows/publish.yml` | `main` / `dev` | Publica en npm: `latest` desde main, `-dev` con dist-tag `dev` desde dev |
| studio | `.github/workflows/studio.yml` | `main` | Genera sitio estático y despliega a GitHub Pages |

Los workflows de publicación usan [trusted publishing (OIDC)](https://docs.npmjs.com/generating-provenance-statements#publishing-packages-with-provenance-via-trusted-publishing) en lugar de tokens. Para configurarlo:

1. En [npmjs.com](https://www.npmjs.com) → paquete → **Settings** → **Trusted Publisher**
2. Seleccionar **GitHub Actions** y completar:
   - **Organization or user**: `4xeverburga`
   - **Repository**: `alpine-theme`
   - **Workflow filename**: `publish.yml`

## Licencia

[MIT](./LICENSE)
