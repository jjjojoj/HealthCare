/**
 * 网络请求封装
 * 基于 uni.request 封装，添加拦截器、错误处理等功能
 */

import config from '@/config'
import { mockInterceptor, shouldUseMock } from './mock'

// 请求队列（用于取消重复请求）
const requestQueue = new Map()

/**
 * 生成请求唯一标识
 */
function getRequestKey(options) {
  const { url, method = 'GET', data } = options
  return `${method.toUpperCase()}_${url}_${JSON.stringify(data || {})}`
}

/**
 * 请求拦截器
 */
function requestInterceptor(options) {
  // 添加 token
  const token = uni.getStorageSync(config.storageKeys.token)
  if (token) {
    options.header = {
      ...options.header,
      'Authorization': `Bearer ${token}`
    }
  }
  
  // 添加公共请求头
  options.header = {
    'Content-Type': 'application/json',
    ...options.header
  }
  
  // 显示加载提示
  if (options.showLoading !== false) {
    uni.showLoading({
      title: options.loadingText || '加载中...',
      mask: true
    })
  }
  
  // 调试信息
  if (config.showDebug) {
    console.log('【请求】', options)
  }
  
  return options
}

/**
 * 响应拦截器
 */
function responseInterceptor(response, options) {
  // 隐藏加载提示
  if (options.showLoading !== false) {
    uni.hideLoading()
  }
  
  const { statusCode, data } = response
  
  // 调试信息
  if (config.showDebug) {
    console.log('【响应】', response)
  }
  
  // HTTP 状态码判断
  if (statusCode === 200) {
    // 业务状态码判断
    if (data.code === 0 || data.code === 200) {
      // 修复：只有当 data.data 不为 undefined 时才返回它，否则返回整个 data
      return data.data !== undefined ? data.data : data
    } else if (data.code === 401) {
      // token 过期，跳转到登录页
      handleTokenExpired()
      return Promise.reject(new Error(data.message || '登录已过期'))
    } else {
      // 业务错误
      const errorMsg = data.message || '请求失败'
      if (options.showError !== false) {
        uni.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 2000
        })
      }
      return Promise.reject(new Error(errorMsg))
    }
  } else {
    // HTTP 错误
    const errorMsg = getHttpErrorMsg(statusCode)
    if (options.showError !== false) {
      uni.showToast({
        title: errorMsg,
        icon: 'none',
        duration: 2000
      })
    }
    return Promise.reject(new Error(errorMsg))
  }
}

/**
 * 错误拦截器
 */
function errorInterceptor(error, options) {
  // 隐藏加载提示
  if (options.showLoading !== false) {
    uni.hideLoading()
  }
  
  // 调试信息
  if (config.showDebug) {
    console.error('【请求错误】', error)
  }
  
  // 网络错误处理
  let errorMsg = '网络连接失败，请检查网络设置'
  
  if (error.errMsg) {
    if (error.errMsg.includes('timeout')) {
      errorMsg = '请求超时，请稍后重试'
    } else if (error.errMsg.includes('fail')) {
      errorMsg = '网络异常，请检查网络连接'
    }
  }
  
  if (options.showError !== false) {
    uni.showToast({
      title: errorMsg,
      icon: 'none',
      duration: 2000
    })
  }
  
  return Promise.reject(new Error(errorMsg))
}

/**
 * 处理 token 过期
 */
function handleTokenExpired() {
  // 清除本地存储
  uni.removeStorageSync(config.storageKeys.token)
  uni.removeStorageSync(config.storageKeys.userInfo)
  
  // 跳转到登录页
  uni.reLaunch({
    url: config.pages.login
  })
}

/**
 * 获取 HTTP 错误信息
 */
function getHttpErrorMsg(statusCode) {
  const errorMap = {
    400: '请求参数错误',
    401: '未授权，请重新登录',
    403: '拒绝访问',
    404: '请求资源不存在',
    405: '请求方法不允许',
    408: '请求超时',
    500: '服务器内部错误',
    501: '服务未实现',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时',
    505: 'HTTP版本不受支持'
  }
  
  return errorMap[statusCode] || `连接错误(${statusCode})`
}

/**
 * 核心请求方法
 */
function request(options) {
  // 合并默认配置
  const defaultOptions = {
    timeout: config.apiTimeout,
    showLoading: true,
    showError: true
  }

  options = { ...defaultOptions, ...options }

  // 拼接完整 URL
  const originalUrl = options.url
  if (!options.url.startsWith('http')) {
    options.url = config.apiBaseUrl + options.url
  }

  // 检查是否使用 Mock 数据
  if (shouldUseMock(config)) {
    // 使用 Mock 拦截器
    if (options.showLoading !== false) {
      uni.showLoading({
        title: options.loadingText || '加载中...',
        mask: true
      })
    }

    return mockInterceptor(originalUrl, options.method || 'GET', options.data)
      .then(response => {
        if (options.showLoading !== false) {
          uni.hideLoading()
        }

        if (config.showDebug) {
          console.log('【Mock 响应】', response)
        }

        if (response.code === 0 || response.code === 200) {
          return response.data !== undefined ? response.data : response
        } else {
          const errorMsg = response.message || '请求失败'
          if (options.showError !== false) {
            uni.showToast({
              title: errorMsg,
              icon: 'none',
              duration: 2000
            })
          }
          return Promise.reject(new Error(errorMsg))
        }
      })
      .catch(error => {
        if (options.showLoading !== false) {
          uni.hideLoading()
        }

        if (options.showError !== false) {
          uni.showToast({
            title: error.message || '请求失败',
            icon: 'none',
            duration: 2000
          })
        }

        return Promise.reject(error)
      })
  }

  // 请求拦截
  options = requestInterceptor(options)

  // 检查是否有重复请求
  const requestKey = getRequestKey(options)
  if (requestQueue.has(requestKey)) {
    // 如果允许重复请求，则继续；否则返回已有的 Promise
    if (!options.allowDuplicate) {
      return requestQueue.get(requestKey)
    }
  }

  // 发起真实请求
  const requestPromise = new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success: (response) => {
        responseInterceptor(response, options)
          .then(resolve)
          .catch(reject)
      },
      fail: (error) => {
        errorInterceptor(error, options)
          .then(resolve)
          .catch(reject)
      },
      complete: () => {
        // 请求完成，从队列中移除
        requestQueue.delete(requestKey)
      }
    })
  })

  // 添加到请求队列
  requestQueue.set(requestKey, requestPromise)

  return requestPromise
}

/**
 * GET 请求
 */
export function get(url, params, options = {}) {
  return request({
    url,
    method: 'GET',
    data: params,
    ...options
  })
}

/**
 * POST 请求
 */
export function post(url, data, options = {}) {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  })
}

/**
 * PUT 请求
 */
export function put(url, data, options = {}) {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  })
}

/**
 * DELETE 请求
 */
export function del(url, data, options = {}) {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  })
}

/**
 * 验证文件
 */
function validateFile(filePath, options = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 默认 10MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf']
  } = options

  return new Promise((resolve, reject) => {
    // 获取文件信息
    uni.getFileInfo({
      filePath,
      success: (res) => {
        // 检查文件大小
        if (res.size > maxSize) {
          reject(new Error(`文件大小不能超过 ${(maxSize / 1024 / 1024).toFixed(2)}MB`))
          return
        }

        // 检查文件扩展名
        const extension = filePath.substring(filePath.lastIndexOf('.')).toLowerCase()
        if (!allowedExtensions.includes(extension)) {
          reject(new Error(`不支持的文件格式，仅支持: ${allowedExtensions.join(', ')}`))
          return
        }

        resolve(true)
      },
      fail: (error) => {
        reject(new Error('文件信息获取失败'))
      }
    })
  })
}

/**
 * 上传文件
 */
export function upload(url, filePath, formData = {}, options = {}) {
  const token = uni.getStorageSync(config.storageKeys.token)

  return new Promise(async (resolve, reject) => {
    try {
      // 文件校验
      await validateFile(filePath, options)

      // 显示上传进度
      if (options.showLoading !== false) {
        uni.showLoading({
          title: '上传中...',
          mask: true
        })
      }

      const uploadTask = uni.uploadFile({
        url: config.apiBaseUrl + url,
        filePath,
        name: options.fileName || 'file',
        formData,
        header: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        success: (response) => {
          if (options.showLoading !== false) {
            uni.hideLoading()
          }

          try {
            const data = JSON.parse(response.data)
            if (data.code === 0 || data.code === 200) {
              uni.showToast({
                title: '上传成功',
                icon: 'success'
              })
              resolve(data.data || data)
            } else {
              uni.showToast({
                title: data.message || '上传失败',
                icon: 'none'
              })
              reject(new Error(data.message || '上传失败'))
            }
          } catch (error) {
            if (options.showLoading !== false) {
              uni.hideLoading()
            }
            reject(new Error('数据解析失败'))
          }
        },
        fail: (error) => {
          if (options.showLoading !== false) {
            uni.hideLoading()
          }
          uni.showToast({
            title: '上传失败',
            icon: 'none'
          })
          reject(error)
        }
      })

      // 监听上传进度
      if (options.onProgress) {
        uploadTask.onProgressUpdate((res) => {
          options.onProgress(res.progress)
        })
      }
    } catch (error) {
      // 校验失败
      uni.showToast({
        title: error.message,
        icon: 'none',
        duration: 2500
      })
      reject(error)
    }
  })
}

/**
 * 下载文件
 */
export function download(url, options = {}) {
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url: config.apiBaseUrl + url,
      success: (response) => {
        if (response.statusCode === 200) {
          resolve(response.tempFilePath)
        } else {
          reject(new Error('下载失败'))
        }
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

export default request

