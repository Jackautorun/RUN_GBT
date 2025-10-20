import { defineConfig } from 'vite'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  css: {
    postcss: { plugins: [tailwind(), autoprefixer()] }
  }
})
