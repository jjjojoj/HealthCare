/**
 * 数据验证工具类
 */

/**
 * 验证手机号
 */
export function validatePhone(phone) {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

/**
 * 验证身份证号
 */
export function validateIdCard(idCard) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(idCard)
}

/**
 * 验证邮箱
 */
export function validateEmail(email) {
  const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(email)
}

/**
 * 验证密码强度（至少包含数字和字母，长度6-20）
 */
export function validatePassword(password) {
  const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/
  return reg.test(password)
}

/**
 * 验证是否为空
 */
export function isEmpty(value) {
  if (value === null || value === undefined) {
    return true
  }
  if (typeof value === 'string') {
    return value.trim() === ''
  }
  if (Array.isArray(value)) {
    return value.length === 0
  }
  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }
  return false
}

/**
 * 验证年龄范围
 */
export function validateAge(age, min = 0, max = 150) {
  const ageNum = parseInt(age)
  return !isNaN(ageNum) && ageNum >= min && ageNum <= max
}

/**
 * 验证 URL
 */
export function validateUrl(url) {
  const reg = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  return reg.test(url)
}

export default {
  phone: validatePhone,
  idCard: validateIdCard,
  email: validateEmail,
  password: validatePassword,
  isEmpty,
  age: validateAge,
  url: validateUrl
}

