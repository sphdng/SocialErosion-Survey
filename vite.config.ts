import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Must match the GitHub repo name for GitHub Pages project sites.
// https://cophee-lab.github.io/SocialErosion-Survey/
export default defineConfig({
  base: '/SocialErosion-Survey/',
  plugins: [react()],
})
