/**
 * Mock 数据拦截器
 * 用于在开发环境模拟后端 API 响应
 */

import usersData from '@/static/mock/users.json'
import recordsData from '@/static/mock/records.json'
import prescriptionsData from '@/static/mock/prescriptions.json'

// Mock 延迟（毫秒）
const MOCK_DELAY = 500

/**
 * 延迟函数
 */
function delay(ms = MOCK_DELAY) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 统一响应格式
 */
function mockResponse(data, message = 'success', code = 200) {
  return {
    code,
    message,
    data
  }
}

/**
 * Mock 数据映射表
 */
const mockHandlers = {
  // 用户登录
  'POST /user/login': async (data) => {
    await delay()
    const { username, password } = data

    if (username === 'demo' && password === 'demo') {
      const user = usersData.users[0]
      const token = `mock_token_${Date.now()}_${Math.random().toString(36).substring(2)}`

      return mockResponse({
        token,
        userInfo: user
      })
    } else {
      return mockResponse(null, '用户名或密码错误', 401)
    }
  },

  // 获取用户信息
  'GET /user/info': async () => {
    await delay()
    const user = usersData.users[0]
    return mockResponse(user)
  },

  // 更新用户信息
  'PUT /user/info': async (data) => {
    await delay()
    return mockResponse(data, '更新成功')
  },

  // 获取病历列表
  'GET /records/list': async () => {
    await delay()
    return mockResponse({
      records: recordsData.records,
      total: recordsData.records.length
    })
  },

  // 获取病历详情
  'GET /records/detail': async (params) => {
    await delay()
    const { id } = params
    const record = recordsData.records.find(r => r.id === parseInt(id))

    if (record) {
      return mockResponse(record)
    } else {
      return mockResponse(null, '病历不存在', 404)
    }
  },

  // 上传文件
  'POST /upload/file': async () => {
    await delay()
    return mockResponse({
      url: '/static/mock/images/uploaded_file.jpg',
      fileId: `file_${Date.now()}`
    }, '上传成功')
  },

  // 获取处方列表
  'GET /prescription/list': async () => {
    await delay()
    return mockResponse({
      prescriptions: prescriptionsData.prescriptions || [],
      total: prescriptionsData.prescriptions?.length || 0
    })
  },

  // AI 咨询聊天
  'POST /chatbot/message': async (data) => {
    await delay(800)
    const { message } = data

    // 简单的关键词回复
    let reply = '我是您的健康助手，请问有什么可以帮助您的？'

    if (message.includes('头痛') || message.includes('疼痛')) {
      reply = '头痛可能由多种原因引起，如压力、缺乏睡眠、脱水等。建议您：\n1. 保持充足睡眠\n2. 多喝水\n3. 适当休息\n如果持续疼痛，请及时就医。'
    } else if (message.includes('发烧') || message.includes('感冒')) {
      reply = '发烧是身体对抗感染的正常反应。建议您：\n1. 多休息\n2. 多喝水\n3. 体温超过38.5°C可服用退烧药\n4. 如果持续3天以上，请就医检查。'
    } else if (message.includes('血压') || message.includes('高血压')) {
      reply = '控制血压很重要，建议您：\n1. 低盐饮食\n2. 适量运动\n3. 保持心情愉悦\n4. 定期监测血压\n5. 按医嘱服药'
    }

    return mockResponse({
      reply,
      timestamp: Date.now()
    })
  },

  // 获取健康趋势数据
  'GET /health/trends': async () => {
    await delay()
    return mockResponse({
      heartRate: [72, 75, 73, 78, 76, 74, 77],
      bloodPressure: {
        systolic: [120, 118, 122, 119, 121, 120, 118],
        diastolic: [80, 78, 82, 79, 81, 80, 78]
      },
      bloodSugar: [5.2, 5.4, 5.3, 5.5, 5.2, 5.4, 5.3],
      dates: ['12-04', '12-05', '12-06', '12-07', '12-08', '12-09', '12-10']
    })
  }
}

/**
 * Mock 拦截器
 * @param {string} url - 请求 URL
 * @param {string} method - 请求方法
 * @param {object} data - 请求数据或参数
 * @returns {Promise} Mock 响应
 */
export async function mockInterceptor(url, method, data) {
  // 移除 URL 中的基础路径
  const apiPath = url.replace(/^.*\/api/, '')

  // 构造处理器 key
  const handlerKey = `${method.toUpperCase()} ${apiPath}`

  // 查找对应的 Mock 处理器
  const handler = mockHandlers[handlerKey]

  if (handler) {
    try {
      const response = await handler(data)
      return response
    } catch (error) {
      console.error('Mock 处理器错误:', error)
      return mockResponse(null, '服务器错误', 500)
    }
  } else {
    // 未找到对应的 Mock 处理器
    console.warn(`未找到 Mock 处理器: ${handlerKey}`)
    return mockResponse(null, '接口未实现', 404)
  }
}

/**
 * 判断是否需要使用 Mock
 */
export function shouldUseMock(config) {
  // 从配置中读取是否启用 Mock
  return config.useMock === true
}
