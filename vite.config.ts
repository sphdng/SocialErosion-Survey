import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Actions Pages serves the build artifact from the site root
// (e.g. https://<name>.pages.github.io/), not a /repo-name/ subpath.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
