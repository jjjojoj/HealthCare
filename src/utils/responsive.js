/**
 * 响应式适配工具
 * 提供多端适配解决方案
 */

// 设计稿宽度（px）
const DESIGN_WIDTH = 750

/**
 * rpx 转 px
 * @param {Number} rpx rpx 值
 * @returns {Number} px 值
 */
export function rpxToPx(rpx) {
  // uni-app 会自动处理 rpx，这里主要用于 JS 计算
  const screenWidth = uni.getSystemInfoSync().screenWidth
  return (rpx / DESIGN_WIDTH) * screenWidth
}

/**
 * px 转 rpx
 * @param {Number} px px 值
 * @returns {Number} rpx 值
 */
export function pxToRpx(px) {
  const screenWidth = uni.getSystemInfoSync().screenWidth
  return (px / screenWidth) * DESIGN_WIDTH
}

/**
 * 获取系统信息
 */
export function getSystemInfo() {
  try {
    return uni.getSystemInfoSync()
  } catch (error) {
    console.error('获取系统信息失败:', error)
    return {}
  }
}

/**
 * 获取屏幕宽度
 */
export function getScreenWidth() {
  return getSystemInfo().screenWidth || 375
}

/**
 * 获取屏幕高度
 */
export function getScreenHeight() {
  return getSystemInfo().screenHeight || 667
}

/**
 * 获取状态栏高度
 */
export function getStatusBarHeight() {
  return getSystemInfo().statusBarHeight || 0
}

/**
 * 获取导航栏高度（含状态栏）
 */
export function getNavBarHeight() {
  const systemInfo = getSystemInfo()
  const statusBarHeight = systemInfo.statusBarHeight || 0
  
  // #ifdef MP-WEIXIN
  // 微信小程序胶囊按钮信息
  const menuButton = uni.getMenuButtonBoundingClientRect()
  const navBarHeight = (menuButton.top - statusBarHeight) * 2 + menuButton.height
  return statusBarHeight + navBarHeight
  // #endif
  
  // #ifdef H5
  return statusBarHeight + 44
  // #endif
  
  // #ifdef APP-PLUS
  return statusBarHeight + 44
  // #endif
  
  return statusBarHeight + 44
}

/**
 * 获取底部安全区域高度
 */
export function getSafeAreaBottom() {
  const systemInfo = getSystemInfo()
  const screenHeight = systemInfo.screenHeight || 0
  const safeAreaBottom = systemInfo.safeArea?.bottom || screenHeight
  
  return screenHeight - safeAreaBottom
}

/**
 * 判断是否为 iPhone X 系列（有刘海屏）
 */
export function isIPhoneX() {
  const systemInfo = getSystemInfo()
  const safeAreaBottom = getSafeAreaBottom()
  
  return systemInfo.platform === 'ios' && safeAreaBottom > 0
}

/**
 * 判断是否为移动端
 */
export function isMobile() {
  // #ifdef H5
  return /Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  // #endif
  
  return true
}

/**
 * 判断是否为微信环境
 */
export function isWeixin() {
  // #ifdef H5
  return /MicroMessenger/i.test(navigator.userAgent)
  // #endif
  
  // #ifdef MP-WEIXIN
  return true
  // #endif
  
  return false
}

/**
 * 获取平台信息
 */
export function getPlatformInfo() {
  const systemInfo = getSystemInfo()
  
  return {
    platform: systemInfo.platform, // ios, android, windows, mac
    system: systemInfo.system, // iOS 14.0, Android 11 等
    model: systemInfo.model, // 手机型号
    brand: systemInfo.brand, // 手机品牌
    pixelRatio: systemInfo.pixelRatio, // 设备像素比
    screenWidth: systemInfo.screenWidth,
    screenHeight: systemInfo.screenHeight,
    windowWidth: systemInfo.windowWidth,
    windowHeight: systemInfo.windowHeight,
    statusBarHeight: getStatusBarHeight(),
    navBarHeight: getNavBarHeight(),
    safeAreaBottom: getSafeAreaBottom(),
    isIPhoneX: isIPhoneX()
  }
}

/**
 * 动态设置页面标题
 */
export function setPageTitle(title) {
  // #ifdef H5
  document.title = title
  // #endif
  
  // #ifdef MP-WEIXIN || APP-PLUS
  uni.setNavigationBarTitle({ title })
  // #endif
}

/**
 * 动态设置导航栏样式
 */
export function setNavBarStyle(options = {}) {
  const {
    backgroundColor = '#ffffff',
    frontColor = '#000000', // #ffffff 或 #000000
    title = ''
  } = options
  
  // #ifdef MP-WEIXIN || APP-PLUS
  uni.setNavigationBarColor({
    frontColor,
    backgroundColor
  })
  
  if (title) {
    uni.setNavigationBarTitle({ title })
  }
  // #endif
}

/**
 * 计算响应式尺寸
 * 根据屏幕宽度自动适配
 */
export function getResponsiveSize(size, baseWidth = 375) {
  const screenWidth = getScreenWidth()
  return (size / baseWidth) * screenWidth
}

/**
 * 获取元素节点信息
 */
export function getNodeInfo(selector, context = null) {
  return new Promise((resolve) => {
    const query = context ? uni.createSelectorQuery().in(context) : uni.createSelectorQuery()
    
    query.select(selector).boundingClientRect((data) => {
      resolve(data)
    }).exec()
  })
}

/**
 * 获取多个元素节点信息
 */
export function getNodesInfo(selector, context = null) {
  return new Promise((resolve) => {
    const query = context ? uni.createSelectorQuery().in(context) : uni.createSelectorQuery()
    
    query.selectAll(selector).boundingClientRect((data) => {
      resolve(data)
    }).exec()
  })
}

export default {
  rpxToPx,
  pxToRpx,
  getSystemInfo,
  getScreenWidth,
  getScreenHeight,
  getStatusBarHeight,
  getNavBarHeight,
  getSafeAreaBottom,
  isIPhoneX,
  isMobile,
  isWeixin,
  getPlatformInfo,
  setPageTitle,
  setNavBarStyle,
  getResponsiveSize,
  getNodeInfo,
  getNodesInfo
}

