import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
  root: path.resolve(__dirname, 'problems/07-css'),
  server: {
    port: 5173,
    open: '/index.html',
  },
})
