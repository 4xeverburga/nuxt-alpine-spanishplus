import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  ignores: ['dist', 'node_modules', '.output', '.nuxt']
}).append({
  rules: {
    // Global
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'quote-props': ['error', 'as-needed'],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    // Vue
    indent: ['error', 2],
    'vue/multi-word-component-names': 0,
    'vue/no-v-html': 0,

    // Preserve pre-flat-config leniency: these type-aware rules weren't
    // enforced under @nuxt/eslint-config@0.2.0 and the codebase relies on
    // `any` and `expr && call()` guards throughout.
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true }]
  }
}).append({
  files: ['.starters/default/**'],
  rules: {
    'vue/max-attributes-per-line': 'off',
    'vue/multi-word-component-names': 'off'
  }
})
