/**
 * 用户相关 API
 */

import { get, post, put } from '@/utils/request'

/**
 * 用户登录
 */
export function login(data) {
  return post('/user/login', data)
}

/**
 * 微信登录
 */
export function weixinLogin(code) {
  return post('/user/weixin-login', { code })
}

/**
 * 用户注册
 */
export function register(data) {
  return post('/user/register', data)
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return get('/user/info')
}

/**
 * 更新用户信息
 */
export function updateUserInfo(data) {
  return put('/user/info', data)
}

/**
 * 修改密码
 */
export function updatePassword(data) {
  return put('/user/password', data)
}

/**
 * 获取验证码
 */
export function getVerifyCode(phone) {
  return post('/user/verify-code', { phone })
}

/**
 * 退出登录
 */
export function logout() {
  return post('/user/logout')
}

/**
 * 绑定手机号
 */
export function bindPhone(data) {
  return post('/user/bind-phone', data)
}

/**
 * 实名认证
 */
export function realNameAuth(data) {
  return post('/user/real-name-auth', data)
}

