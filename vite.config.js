import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { renameSync, existsSync } from 'node:fs'

/** Dev/build from index.dev.html so production index.html at repo root stays intact. */
function useDevHtml() {
  return {
    name: 'use-dev-html',
    configureServer(server) {
      return () => {
        server.middlewares.use((req, _res, next) => {
          const [pathname, search = ''] = (req.url ?? '').split('?')
          if (pathname === '/' || pathname === '/index.html') {
            req.url = `/index.dev.html${search ? `?${search}` : ''}`
          }
          next()
        })
      }
    },
    closeBundle() {
      const from = resolve(__dirname, 'dist/index.dev.html')
      const to = resolve(__dirname, 'dist/index.html')
      if (existsSync(from)) {
        renameSync(from, to)
      }
    },
  }
}

export default defineConfig({
  plugins: [vue(), useDevHtml()],
  base: '/',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.dev.html'),
      },
    },
  },
})
