import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
        host: true,
        cors: true,
        strictPort: true,
        port: 3000
    },
    build: {
        outDir: "./build",
        chunkSizeWarningLimit: 1600,
    },
})
