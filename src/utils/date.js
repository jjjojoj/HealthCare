/**
 * 日期时间工具类
 */

/**
 * 格式化日期
 * @param {Date|String|Number} date 日期对象、时间戳或日期字符串
 * @param {String} format 格式化模板，如 'YYYY-MM-DD HH:mm:ss'
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''
  
  // 转换为 Date 对象
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date)
  }
  
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return ''
  }
  
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  
  const formatObj = {
    'YYYY': year,
    'MM': padZero(month),
    'DD': padZero(day),
    'HH': padZero(hours),
    'mm': padZero(minutes),
    'ss': padZero(seconds),
    'M': month,
    'D': day,
    'H': hours,
    'm': minutes,
    's': seconds
  }
  
  return format.replace(/YYYY|MM|DD|HH|mm|ss|M|D|H|m|s/g, (match) => {
    return String(formatObj[match])
  })
}

/**
 * 补零
 */
function padZero(num) {
  return num < 10 ? '0' + num : num
}

/**
 * 获取相对时间描述（如：刚刚、5分钟前、昨天等）
 */
export function getRelativeTime(date) {
  if (!date) return ''
  
  // 转换为时间戳
  const timestamp = typeof date === 'number' ? date : new Date(date).getTime()
  const now = Date.now()
  const diff = now - timestamp
  
  // 未来时间
  if (diff < 0) {
    return formatDate(date, 'YYYY-MM-DD HH:mm')
  }
  
  // 1分钟内
  if (diff < 60 * 1000) {
    return '刚刚'
  }
  
  // 1小时内
  if (diff < 60 * 60 * 1000) {
    return Math.floor(diff / (60 * 1000)) + '分钟前'
  }
  
  // 今天
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (timestamp >= today.getTime()) {
    return formatDate(date, 'HH:mm')
  }
  
  // 昨天
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (timestamp >= yesterday.getTime()) {
    return '昨天 ' + formatDate(date, 'HH:mm')
  }
  
  // 前天
  const beforeYesterday = new Date(yesterday)
  beforeYesterday.setDate(beforeYesterday.getDate() - 1)
  if (timestamp >= beforeYesterday.getTime()) {
    return '前天 ' + formatDate(date, 'HH:mm')
  }
  
  // 今年内
  if (new Date(timestamp).getFullYear() === today.getFullYear()) {
    return formatDate(date, 'MM-DD HH:mm')
  }
  
  // 更早
  return formatDate(date, 'YYYY-MM-DD')
}

/**
 * 计算年龄
 */
export function calculateAge(birthday) {
  if (!birthday) return 0
  
  const birthDate = new Date(birthday)
  const today = new Date()
  
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

/**
 * 获取星期几
 */
export function getWeekDay(date, format = 'zh') {
  if (!date) date = new Date()
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date)
  }
  
  const day = date.getDay()
  
  const weekMap = {
    'zh': ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    'en': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    'full': ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  }
  
  return weekMap[format][day]
}

/**
 * 判断是否为今天
 */
export function isToday(date) {
  if (!date) return false
  
  const targetDate = new Date(date)
  const today = new Date()
  
  return targetDate.getFullYear() === today.getFullYear() &&
         targetDate.getMonth() === today.getMonth() &&
         targetDate.getDate() === today.getDate()
}

/**
 * 获取日期范围
 */
export function getDateRange(type = 'week') {
  const now = new Date()
  const start = new Date()
  const end = new Date()
  
  switch (type) {
    case 'today':
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      break
      
    case 'week':
      const day = now.getDay() || 7
      start.setDate(now.getDate() - day + 1)
      start.setHours(0, 0, 0, 0)
      end.setDate(start.getDate() + 6)
      end.setHours(23, 59, 59, 999)
      break
      
    case 'month':
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      end.setMonth(end.getMonth() + 1, 0)
      end.setHours(23, 59, 59, 999)
      break
      
    case 'year':
      start.setMonth(0, 1)
      start.setHours(0, 0, 0, 0)
      end.setMonth(11, 31)
      end.setHours(23, 59, 59, 999)
      break
  }
  
  return {
    start: start.getTime(),
    end: end.getTime(),
    startDate: formatDate(start, 'YYYY-MM-DD'),
    endDate: formatDate(end, 'YYYY-MM-DD')
  }
}

export default {
  format: formatDate,
  relative: getRelativeTime,
  calculateAge,
  getWeekDay,
  isToday,
  getDateRange
}

