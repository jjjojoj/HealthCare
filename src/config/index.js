/**
 * 配置文件
 */

// 获取环境变量
const env = import.meta.env

export default {
  // API 基础路径
  apiBaseUrl: env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // API 超时时间（毫秒）
  apiTimeout: parseInt(env.VITE_API_TIMEOUT) || 30000,
  
  // 是否使用 Mock 数据
  useMock: env.VITE_USE_MOCK === 'true',
  
  // 微信小程序 AppID
  weixinAppId: env.VITE_WEIXIN_APPID || '',
  
  // 是否显示调试信息
  showDebug: env.VITE_SHOW_DEBUG === 'true',
  
  // 应用标题
  appTitle: env.VITE_APP_TITLE || '远程医疗系统',
  
  // 页面路径配置
  pages: {
    home: '/pages/home/home',
    login: '/pages/login/login',
    profile: '/pages/my/my',
    records: '/pages/records/list',
    recordDetail: '/pages/records/detail',
    upload: '/pages/upload/upload',
    chatbot: '/pages/chatbot/chat',
    trends: '/pages/trends/trends',
    meds: '/pages/meds/meds',
    emergency: '/pages/emergency/emergency',
    prescription: '/pages/prescription/prescription',
    video: '/pages/video/video'
  },
  
  // 本地存储 key
  storageKeys: {
    token: 'healthcare_token',
    userInfo: 'healthcare_userInfo',
    language: 'healthcare_language'
  }
}

