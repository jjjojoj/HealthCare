import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [
      uni({
        inputDir: 'src'
      })
    ],
    
    // 路径别名
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@pages': resolve(__dirname, 'src/pages'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@api': resolve(__dirname, 'src/api'),
        '@styles': resolve(__dirname, 'src/styles'),
        '@static': resolve(__dirname, 'src/static'),
        '@store': resolve(__dirname, 'src/store')
      }
    },
    
    // 开发服务器配置
    server: {
      host: '0.0.0.0', // 允许局域网访问
      port: 5174,
      open: false,
      cors: true,
      
      // API 代理配置
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    
    // 构建优化
    build: {
      // 压缩选项
      minify: 'terser',
      terserOptions: {
        compress: {
          // 生产环境移除 console
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      },
      // chunk 大小警告限制
      chunkSizeWarningLimit: 1000
    },
    
    // 环境变量前缀
    envPrefix: 'VITE_'
  }
})
