import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Base dev server config with sensible defaults
  const DEV_PORT = Number(env.VITE_DEV_PORT || 5173)
  const DEV_HOST = env.VITE_DEV_HOST || 'localhost'

  // HMR adjustments for proxied/remote development scenarios
  const HMR_HOST = env.VITE_HMR_HOST || DEV_HOST
  const HMR_CLIENT_PORT = Number(env.VITE_HMR_CLIENT_PORT || DEV_PORT)
  const HMR_PROTOCOL = env.VITE_HMR_PROTOCOL || 'ws' // can be 'wss' behind HTTPS proxies

  return {
    plugins: [
      vue(),
      vuetify({ autoImport: true })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: true, // listen on all addresses (0.0.0.0)
      port: DEV_PORT,
      strictPort: true,
      hmr: {
        host: HMR_HOST,
        clientPort: HMR_CLIENT_PORT,
        protocol: HMR_PROTOCOL
      },
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:3000',
          changeOrigin: true
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia', 'vuetify'],
            echarts: ['echarts', 'vue-echarts'],
            xlsx: ['xlsx'],
            jspdf: ['jspdf', 'jspdf-autotable']
          }
        }
      }
    }
  }
})

