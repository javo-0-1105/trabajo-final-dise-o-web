

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/trabajo-final-dise-o-web/'  // <— Muy importante
})
