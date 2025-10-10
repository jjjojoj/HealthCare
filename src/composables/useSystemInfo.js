/**
 * 系统信息组合式 API
 * 用于 Vue 组件中获取系统和适配信息
 */

import { ref, computed } from 'vue'
import responsive from '@/utils/responsive'

// 全局系统信息（单例模式）
let systemInfoInstance = null

export function useSystemInfo() {
  // 如果已存在实例，直接返回
  if (systemInfoInstance) {
    return systemInfoInstance
  }
  
  // 系统信息
  const systemInfo = ref(responsive.getPlatformInfo())
  
  // 状态栏高度
  const statusBarHeight = computed(() => systemInfo.value.statusBarHeight)
  
  // 导航栏高度
  const navBarHeight = computed(() => systemInfo.value.navBarHeight)
  
  // 底部安全区域高度
  const safeAreaBottom = computed(() => systemInfo.value.safeAreaBottom)
  
  // 是否为 iPhone X 系列
  const isIPhoneX = computed(() => systemInfo.value.isIPhoneX)
  
  // 屏幕宽度
  const screenWidth = computed(() => systemInfo.value.screenWidth)
  
  // 屏幕高度
  const screenHeight = computed(() => systemInfo.value.screenHeight)
  
  // 窗口宽度
  const windowWidth = computed(() => systemInfo.value.windowWidth)
  
  // 窗口高度
  const windowHeight = computed(() => systemInfo.value.windowHeight)
  
  // 平台类型
  const platform = computed(() => systemInfo.value.platform)
  
  // 是否为 iOS
  const isIOS = computed(() => platform.value === 'ios')
  
  // 是否为 Android
  const isAndroid = computed(() => platform.value === 'android')
  
  // 刷新系统信息
  const refreshSystemInfo = () => {
    systemInfo.value = responsive.getPlatformInfo()
  }
  
  // 创建实例
  systemInfoInstance = {
    systemInfo,
    statusBarHeight,
    navBarHeight,
    safeAreaBottom,
    isIPhoneX,
    screenWidth,
    screenHeight,
    windowWidth,
    windowHeight,
    platform,
    isIOS,
    isAndroid,
    refreshSystemInfo
  }
  
  return systemInfoInstance
}

export default useSystemInfo

