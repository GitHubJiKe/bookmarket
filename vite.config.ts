import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [vue(), tailwindcss()], 
     resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@stores': path.resolve(__dirname, 'src/stores'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@types': path.resolve(__dirname, 'src/types'),
        '@lib': path.resolve(__dirname, 'src/lib'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@router': path.resolve(__dirname, 'src/router'),
        '@assets': path.resolve(__dirname, 'src/assets'),
      }
    },
  }
})
