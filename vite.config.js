import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { realpathSync } from 'fs'

const rootPath = realpathSync(process.cwd())

// https://vite.dev/config/
export default defineConfig({
  root: rootPath,
  plugins: [react()]
})
