import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['problems/**/*.test.{ts,tsx}'],
    environmentMatchGlobs: [
      ['problems/05-react-components/**', 'jsdom'],
      ['problems/06-react-hooks/**', 'jsdom'],
      ['problems/02-data-structure/**/18-dom-tree-traverse/**', 'jsdom'],
      ['problems/04-utils/**/47-get-cookie/**', 'jsdom'],
      ['problems/04-utils/**/51-extract-html-text/**', 'jsdom'],
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
