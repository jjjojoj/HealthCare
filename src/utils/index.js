/**
 * 工具函数集合
 */

import storage from './storage'
import validator from './validator'
import date from './date'
import request, { get, post, put, del, upload, download } from './request'

/**
 * 防抖函数
 */
export function debounce(func, wait = 500) {
  let timeout
  return function(...args) {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

/**
 * 节流函数
 */
export function throttle(func, wait = 500) {
  let timeout
  let previous = 0
  
  return function(...args) {
    const context = this
    const now = Date.now()
    
    if (now - previous > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      func.apply(context, args)
      previous = now
    } else if (!timeout) {
      timeout = setTimeout(() => {
        func.apply(context, args)
        previous = Date.now()
        timeout = null
      }, wait)
    }
  }
}

/**
 * 深拷贝
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item))
  }
  
  if (obj instanceof Object) {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

/**
 * 生成唯一 ID
 */
export function generateId(prefix = '') {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  return `${prefix}${timestamp}${random}`
}

/**
 * 价格格式化
 */
export function formatPrice(price, decimal = 2) {
  if (isNaN(price)) return '0.00'
  return Number(price).toFixed(decimal)
}

/**
 * 数字千分位格式化
 */
export function formatNumber(num) {
  if (isNaN(num)) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 隐藏手机号中间四位
 */
export function hidePhone(phone) {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 隐藏身份证号中间部分
 */
export function hideIdCard(idCard) {
  if (!idCard) return ''
  return idCard.replace(/(\d{6})\d+(\d{4})/, '$1********$2')
}

/**
 * 获取文件扩展名
 */
export function getFileExt(filename) {
  if (!filename) return ''
  const index = filename.lastIndexOf('.')
  return index > -1 ? filename.substring(index + 1).toLowerCase() : ''
}

/**
 * 获取文件大小描述
 */
export function getFileSizeDesc(size) {
  if (!size) return '0B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let index = 0
  
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024
    index++
  }
  
  return size.toFixed(2) + units[index]
}

/**
 * URL 参数解析
 */
export function parseUrlParams(url) {
  if (!url) return {}
  
  const params = {}
  const queryString = url.split('?')[1]
  
  if (!queryString) return params
  
  queryString.split('&').forEach(item => {
    const [key, value] = item.split('=')
    params[decodeURIComponent(key)] = decodeURIComponent(value)
  })
  
  return params
}

/**
 * 对象转 URL 参数
 */
export function objectToUrlParams(obj) {
  if (!obj || typeof obj !== 'object') return ''
  
  return Object.keys(obj)
    .filter(key => obj[key] !== null && obj[key] !== undefined)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
}

/**
 * 获取平台信息
 */
export function getPlatform() {
  // #ifdef H5
  return 'h5'
  // #endif
  
  // #ifdef MP-WEIXIN
  return 'mp-weixin'
  // #endif
  
  // #ifdef APP-PLUS
  return 'app'
  // #endif
  
  return 'unknown'
}

/**
 * 页面跳转（封装 uni.navigateTo）
 */
export function navigateTo(url, params = {}) {
  if (!url) return
  
  // 添加参数
  if (Object.keys(params).length > 0) {
    const queryString = objectToUrlParams(params)
    url += (url.includes('?') ? '&' : '?') + queryString
  }
  
  uni.navigateTo({ url })
}

/**
 * 页面重定向（封装 uni.redirectTo）
 */
export function redirectTo(url, params = {}) {
  if (!url) return
  
  // 添加参数
  if (Object.keys(params).length > 0) {
    const queryString = objectToUrlParams(params)
    url += (url.includes('?') ? '&' : '?') + queryString
  }
  
  uni.redirectTo({ url })
}

/**
 * 页面返回
 */
export function navigateBack(delta = 1) {
  uni.navigateBack({ delta })
}

/**
 * 复制到剪贴板
 */
export function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    uni.setClipboardData({
      data: text,
      success: () => {
        uni.showToast({ title: '复制成功', icon: 'success' })
        resolve()
      },
      fail: reject
    })
  })
}

/**
 * 拨打电话
 */
export function makePhoneCall(phoneNumber) {
  return new Promise((resolve, reject) => {
    uni.makePhoneCall({
      phoneNumber,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 预览图片
 */
export function previewImage(urls, current = 0) {
  if (!Array.isArray(urls)) {
    urls = [urls]
  }
  
  uni.previewImage({
    urls,
    current: typeof current === 'number' ? urls[current] : current
  })
}

export {
  storage,
  validator,
  date,
  request,
  get,
  post,
  put,
  del,
  upload,
  download
}

export default {
  storage,
  validator,
  date,
  request,
  get,
  post,
  put,
  del,
  upload,
  download,
  debounce,
  throttle,
  deepClone,
  generateId,
  formatPrice,
  formatNumber,
  hidePhone,
  hideIdCard,
  getFileExt,
  getFileSizeDesc,
  parseUrlParams,
  objectToUrlParams,
  getPlatform,
  navigateTo,
  redirectTo,
  navigateBack,
  copyToClipboard,
  makePhoneCall,
  previewImage
}

