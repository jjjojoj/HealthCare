/**
 * 本地存储工具类
 * 封装 uni.storage API，提供更便捷的使用方式
 */

/**
 * 设置存储
 */
export function setStorage(key, value) {
  try {
    uni.setStorageSync(key, value)
    return true
  } catch (error) {
    console.error('设置存储失败:', error)
    return false
  }
}

/**
 * 获取存储
 */
export function getStorage(key, defaultValue = null) {
  try {
    const value = uni.getStorageSync(key)
    return value !== '' ? value : defaultValue
  } catch (error) {
    console.error('获取存储失败:', error)
    return defaultValue
  }
}

/**
 * 移除存储
 */
export function removeStorage(key) {
  try {
    uni.removeStorageSync(key)
    return true
  } catch (error) {
    console.error('移除存储失败:', error)
    return false
  }
}

/**
 * 清空所有存储
 */
export function clearStorage() {
  try {
    uni.clearStorageSync()
    return true
  } catch (error) {
    console.error('清空存储失败:', error)
    return false
  }
}

/**
 * 获取存储信息
 */
export function getStorageInfo() {
  try {
    return uni.getStorageInfoSync()
  } catch (error) {
    console.error('获取存储信息失败:', error)
    return null
  }
}

export default {
  set: setStorage,
  get: getStorage,
  remove: removeStorage,
  clear: clearStorage,
  getInfo: getStorageInfo
}

