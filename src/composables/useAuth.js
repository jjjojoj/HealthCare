/**
 * 认证相关的 Composable
 * 统一管理用户登录、登出、token 等
 */

import { ref, computed } from 'vue'
import config from '@/config'
import { setStorage, getStorage, removeStorage } from '@/utils/storage'

// 全局状态
const token = ref(getStorage(config.storageKeys.token, ''))
const userInfo = ref(getStorage(config.storageKeys.userInfo, null))
const isLogin = ref(!!token.value)

/**
 * 生成简单的 token（演示用）
 * 实际项目应该由后端生成
 */
function generateToken(username) {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `${username}_${timestamp}_${random}`
}

export function useAuth() {
  /**
   * 登录
   */
  const login = async (username, password) => {
    // 这里应该调用真实的 API，目前使用 Mock 数据
    if (username === 'demo' && password === 'demo') {
      // 生成 token
      const mockToken = generateToken(username)

      // 模拟用户信息（实际应该从 API 返回）
      const mockUserInfo = {
        id: 1,
        name: '张三',
        dob: '1990-01-01',
        gender: 'male',
        phone: '13800138000',
        role: 'patient',
        emergency_contact: {
          name: '李四',
          relation: '配偶',
          phone: '13900139000'
        }
      }

      // 保存到状态和本地存储
      token.value = mockToken
      userInfo.value = mockUserInfo
      isLogin.value = true

      setStorage(config.storageKeys.token, mockToken)
      setStorage(config.storageKeys.userInfo, mockUserInfo)
      setStorage('isLogin', true)

      return {
        success: true,
        data: {
          token: mockToken,
          userInfo: mockUserInfo
        }
      }
    } else {
      return {
        success: false,
        message: '用户名或密码错误'
      }
    }
  }

  /**
   * 登出
   */
  const logout = () => {
    token.value = ''
    userInfo.value = null
    isLogin.value = false

    removeStorage(config.storageKeys.token)
    removeStorage(config.storageKeys.userInfo)
    removeStorage('isLogin')

    // 跳转到登录页
    uni.reLaunch({
      url: config.pages.login
    })
  }

  /**
   * 检查登录状态
   */
  const checkAuth = () => {
    const storedToken = getStorage(config.storageKeys.token)
    const storedUserInfo = getStorage(config.storageKeys.userInfo)

    if (storedToken && storedUserInfo) {
      token.value = storedToken
      userInfo.value = storedUserInfo
      isLogin.value = true
      return true
    } else {
      isLogin.value = false
      return false
    }
  }

  /**
   * 更新用户信息
   */
  const updateUserInfo = (newUserInfo) => {
    userInfo.value = { ...userInfo.value, ...newUserInfo }
    setStorage(config.storageKeys.userInfo, userInfo.value)
  }

  /**
   * 获取 token
   */
  const getToken = () => {
    return token.value
  }

  /**
   * 计算属性：用户名
   */
  const userName = computed(() => {
    return userInfo.value?.name || '用户'
  })

  /**
   * 计算属性：用户角色
   */
  const userRole = computed(() => {
    return userInfo.value?.role || 'patient'
  })

  /**
   * 计算属性：是否是医生
   */
  const isClinician = computed(() => {
    return userInfo.value?.role === 'clinician'
  })

  return {
    // 状态
    token,
    userInfo,
    isLogin,
    userName,
    userRole,
    isClinician,

    // 方法
    login,
    logout,
    checkAuth,
    updateUserInfo,
    getToken
  }
}
