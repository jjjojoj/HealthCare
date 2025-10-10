import { createSSRApp } from 'vue'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)

  // 全局错误处理器
  app.config.errorHandler = (err, instance, info) => {
    console.error('全局错误捕获:', err)
    console.error('错误来源组件:', instance)
    console.error('错误信息:', info)

    // 显示用户友好的错误提示
    uni.showToast({
      title: '出错了，请稍后重试',
      icon: 'none',
      duration: 2000
    })

    // 在生产环境可以上报错误到监控平台
    // reportError(err, instance, info)
  }

  // 警告处理器（开发环境）
  app.config.warnHandler = (msg, instance, trace) => {
    console.warn('Vue 警告:', msg)
    console.warn('警告来源:', trace)
  }

  return {
    app
  }
}
