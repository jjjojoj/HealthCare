<template>
  <view class="page">
    <AppHeader title="智能医疗咨询" />

    <view class="chat-container">
      <!-- 聊天记录区域 -->
      <scroll-view 
        scroll-y 
        class="chat-content" 
        :scroll-top="scrollTop" 
        :scroll-into-view="scrollIntoView"
        scroll-with-animation
      >
        <!-- 欢迎消息 -->
        <view class="welcome-msg" v-if="messages.length === 0">
          <view class="welcome-icon">🤖</view>
          <view class="welcome-title">智能医疗助手</view>
          <view class="welcome-desc">您好！我可以帮您解答健康问题、分析病历信息</view>
          <view class="quick-actions">
            <view 
              v-for="(action, index) in quickActions" 
              :key="index"
              class="quick-btn"
              @click="sendQuickMessage(action.text)"
            >
              {{ action.icon }} {{ action.text }}
            </view>
          </view>
        </view>

        <!-- 消息列表 -->
        <view 
          v-for="(msg, index) in messages" 
          :key="index"
          :id="'msg-' + index"
          class="message-wrapper"
        >
          <!-- 用户消息 -->
          <view v-if="msg.type === 'user'" class="msg-row msg-user">
            <view class="msg-bubble user-bubble">
              <text class="msg-text">{{ msg.content }}</text>
            </view>
            <view class="msg-avatar user-avatar">👤</view>
          </view>

          <!-- 机器人消息 -->
          <view v-else class="msg-row msg-bot">
            <view class="msg-avatar bot-avatar">🤖</view>
            <view class="msg-content-wrapper">
              <view class="msg-bubble bot-bubble">
                <text class="msg-text">{{ msg.content }}</text>
              </view>
              
              <!-- 诊断卡片 -->
              <view v-if="msg.diagnosisCard" class="diagnosis-card">
                <view class="card-header">
                  <view class="card-icon">📋</view>
                  <text class="card-title">诊断分析</text>
                </view>
                
                <view class="card-section">
                  <view class="section-label">简要总结</view>
                  <text class="section-text">{{ msg.diagnosisCard.brief_summary }}</text>
                </view>

                <view class="card-section" v-if="msg.diagnosisCard.possible_conditions && msg.diagnosisCard.possible_conditions.length > 0">
                  <view class="section-label">可能病症</view>
                  <view 
                    v-for="(condition, idx) in msg.diagnosisCard.possible_conditions" 
                    :key="idx"
                    class="condition-item"
                  >
                    <view class="condition-header">
                      <text class="condition-name">{{ condition.name }}</text>
                      <view class="confidence-badge" :class="getConfidenceClass(condition.confidence)">
                        {{ (condition.confidence * 100).toFixed(0) }}%
                      </view>
                    </view>
                    <text class="condition-desc">{{ condition.description }}</text>
                  </view>
                </view>

                <view class="card-section" v-if="msg.diagnosisCard.recommended_next_steps && msg.diagnosisCard.recommended_next_steps.length > 0">
                  <view class="section-label">建议措施</view>
                  <view 
                    v-for="(step, idx) in msg.diagnosisCard.recommended_next_steps" 
                    :key="idx"
                    class="step-item"
                  >
                    <view class="step-number">{{ idx + 1 }}</view>
                    <text class="step-text">{{ step }}</text>
                  </view>
                </view>

                <view class="card-section" v-if="msg.diagnosisCard.tags && msg.diagnosisCard.tags.length > 0">
                  <view class="section-label">相关标签</view>
                  <view class="tags-container">
                    <view 
                      v-for="(tag, idx) in msg.diagnosisCard.tags" 
                      :key="idx"
                      class="tag-item"
                    >
                      {{ tag }}
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 时间戳 -->
          <view v-if="msg.timestamp" class="msg-time">
            {{ formatTime(msg.timestamp) }}
          </view>
        </view>

        <!-- 输入中提示 -->
        <view v-if="isTyping" class="msg-row msg-bot">
          <view class="msg-avatar bot-avatar">🤖</view>
          <view class="typing-indicator">
            <view class="typing-dot"></view>
            <view class="typing-dot"></view>
            <view class="typing-dot"></view>
          </view>
        </view>
      </scroll-view>

      <!-- AI免责声明 -->
      <view class="ai-disclaimer">
        <text class="disclaimer-text">🤖 AI助手仅供演示参考，不构成医疗建议</text>
      </view>

      <!-- 输入区域 -->
      <view class="chat-input">
        <view 
          class="voice-btn" 
          :class="{ recording: isRecording }"
          @click="toggleVoiceInput"
        >
          {{ isRecording ? '🔴' : '🎤' }}
        </view>
        <input 
          v-model="inputText" 
          class="input-field"
          placeholder="输入您的问题..." 
          @confirm="sendMessage"
          :disabled="isRecording"
        />
        <view 
          class="send-btn" 
          :class="{ active: inputText.trim() }"
          @click="sendMessage"
        >
          发送
        </view>
      </view>
    </view>

    <BottomNav />
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import recordsData from '@/static/mock/records.json'
import { useAuthGuard } from '@/composables/useAuthGuard'

useAuthGuard()

// 状态管理
const messages = ref([])
const inputText = ref('')
const scrollTop = ref(0)
const scrollIntoView = ref('')
const isTyping = ref(false)
const isRecording = ref(false)
const recognition = ref(null)

// 快捷操作
const quickActions = ref([
  { icon: '🩺', text: '查看我的病历' },
  { icon: '💊', text: '用药咨询' },
  { icon: '📊', text: '健康指标分析' },
  { icon: '🆘', text: '紧急情况处理' }
])

// 初始化
onMounted(() => {
  loadChatHistory()
  initSpeechRecognition()
})

// 加载聊天历史
const loadChatHistory = () => {
  try {
    const history = uni.getStorageSync('chatHistory')
    if (history && Array.isArray(history)) {
      messages.value = history
    }
  } catch (e) {
    console.error('加载聊天历史失败', e)
  }
}

// 保存聊天历史
const saveChatHistory = () => {
  try {
    uni.setStorageSync('chatHistory', messages.value)
  } catch (e) {
    console.error('保存聊天历史失败', e)
  }
}

// 初始化语音识别
const initSpeechRecognition = () => {
  // #ifdef H5
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition.value = new SpeechRecognition()
    recognition.value.lang = 'zh-CN'
    recognition.value.continuous = false
    recognition.value.interimResults = false

    recognition.value.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      inputText.value = transcript
      isRecording.value = false
      
      // 自动发送识别结果
      setTimeout(() => {
        sendMessage()
      }, 300)
    }

    recognition.value.onerror = (event) => {
      console.error('语音识别错误', event.error)
      isRecording.value = false
      uni.showToast({ 
        title: '语音识别失败，请重试', 
        icon: 'none' 
      })
    }

    recognition.value.onend = () => {
      isRecording.value = false
    }
  }
  // #endif
}

// 切换语音输入
const toggleVoiceInput = () => {
  // #ifdef H5
  if (!recognition.value) {
    uni.showToast({ 
      title: '您的浏览器不支持语音识别', 
      icon: 'none' 
    })
    return
  }

  if (isRecording.value) {
    recognition.value.stop()
    isRecording.value = false
  } else {
    try {
      recognition.value.start()
      isRecording.value = true
      uni.showToast({ 
        title: '请开始说话...', 
        icon: 'none' 
      })
    } catch (e) {
      console.error('启动语音识别失败', e)
      uni.showToast({ 
        title: '语音识别启动失败', 
        icon: 'none' 
      })
    }
  }
  // #endif

  // #ifndef H5
  uni.showToast({ 
    title: '语音识别仅在浏览器端可用', 
    icon: 'none' 
  })
  // #endif
}

// 快捷消息
const sendQuickMessage = (text) => {
  inputText.value = text
  sendMessage()
}

// 发送消息
const sendMessage = () => {
  const text = inputText.value.trim()
  if (!text) return

  // 添加用户消息
  const userMsg = {
    type: 'user',
    content: text,
    timestamp: new Date().toISOString()
  }
  messages.value.push(userMsg)
  inputText.value = ''

  // 显示输入中
  isTyping.value = true
  scrollToBottom()

  // 模拟延迟回复
  setTimeout(() => {
    const botResponse = generateResponse(text)
    messages.value.push(botResponse)
    isTyping.value = false
    
    saveChatHistory()
    scrollToBottom()
  }, 800 + Math.random() * 700)
}

// 生成回复（基于关键词的规则匹配）
const generateResponse = (userInput) => {
  const input = userInput.toLowerCase()
  
  // AI免责声明
  const disclaimer = '（本回复由AI生成，仅供演示参考，不构成任何医疗诊断或治疗建议，请以专业医生意见为准。）'
  
  // 病历相关
  if (input.includes('病历') || input.includes('记录') || input.includes('检查') || input.includes('化验')) {
    const record = recordsData.records[0] // 使用第一条病历
    return {
      type: 'bot',
      content: '我查看了您最近的病历记录。以下是详细分析：\n' + disclaimer,
      timestamp: new Date().toISOString(),
      diagnosisCard: {
        brief_summary: record.summary_text,
        possible_conditions: [
          {
            name: record.image_analysis.tags[0] || '需进一步检查',
            description: record.image_analysis.notes,
            confidence: record.image_analysis.confidence
          }
        ],
        recommended_next_steps: [
          '继续观察症状变化',
          '如症状加重，及时就医',
          '保持良好生活习惯',
          '定期复查相关指标'
        ],
        tags: record.image_analysis.tags
      }
    }
  }
  
  // 皮肤/过敏问题
  if (input.includes('皮肤') || input.includes('痒') || input.includes('过敏') || input.includes('荨麻疹')) {
    const skinRecord = recordsData.records.find(r => r.id === 1)
    if (skinRecord) {
      return {
        type: 'bot',
        content: '根据您的皮肤症状描述和之前的检查记录，我为您做出以下分析：\n' + disclaimer,
        timestamp: new Date().toISOString(),
        diagnosisCard: {
          brief_summary: skinRecord.summary_text,
          possible_conditions: [
            {
              name: '接触性皮炎',
              description: '皮肤接触过敏源后产生的炎症反应，常见症状包括红斑、瘙痒、水疱等',
              confidence: 0.89
            },
            {
              name: '过敏性皮疹',
              description: '由过敏反应引起的皮肤病变，可能与食物、药物或环境因素有关',
              confidence: 0.72
            }
          ],
          recommended_next_steps: [
            '避免接触已知过敏源',
            '使用抗过敏药物（如医生处方）',
            '保持患处清洁干燥',
            '如症状持续或加重，请就医进行过敏原测试'
          ],
          tags: skinRecord.image_analysis.tags
        }
      }
    }
  }
  
  // 肺部/胸部/感冒/流感问题
  if (input.includes('肺') || input.includes('胸') || input.includes('咳嗽') || input.includes('呼吸') ||
      input.includes('感冒') || input.includes('流感') || input.includes('鼻塞')) {
    const xrayRecord = recordsData.records.find(r => r.id === 2)
    if (xrayRecord) {
      return {
        type: 'bot',
        content: '根据您的症状和X光检查结果，我为您做出以下分析：\n' + disclaimer,
        timestamp: new Date().toISOString(),
        diagnosisCard: {
          brief_summary: xrayRecord.summary_text,
          possible_conditions: [
            {
              name: '上呼吸道感染',
              description: '由病毒引起的鼻腔、咽部或喉部感染，常见症状包括鼻塞、咳嗽、咽痛等',
              confidence: 0.87
            },
            {
              name: '急性支气管炎',
              description: '支气管黏膜的急性炎症，常伴随咳嗽、咳痰等症状',
              confidence: 0.76
            }
          ],
          recommended_next_steps: [
            '多饮温水，注意休息',
            '保持室内空气流通',
            '可服用对症缓解药物（如退烧、止咳药）',
            '如持续高热超过3天或呼吸困难，请及时就医',
            '避免吸烟和二手烟'
          ],
          tags: xrayRecord.image_analysis.tags
        }
      }
    }
  }
  
  // 头痛/头疼
  if (input.includes('头痛') || input.includes('头疼')) {
    return {
      type: 'bot',
      content: '关于您的头痛症状，我为您做以下分析：\n' + disclaimer,
      timestamp: new Date().toISOString(),
      diagnosisCard: {
        brief_summary: '头痛是常见症状，可能由多种原因引起。根据描述，需进一步明确头痛的类型和伴随症状。',
        possible_conditions: [
          {
            name: '紧张性头痛',
            description: '最常见的头痛类型，常表现为头部两侧持续性压迫感或紧缩感，与精神紧张、疲劳有关',
            confidence: 0.82
          },
          {
            name: '偏头痛',
            description: '反复发作的单侧搏动性头痛，可伴恶心、呕吐、畏光畏声，发作前可有视觉先兆',
            confidence: 0.68
          }
        ],
        recommended_next_steps: [
          '记录头痛发作时间、部位和持续时间',
          '保证充足睡眠，避免过度疲劳',
          '减少屏幕使用时间，注意用眼卫生',
          '适当放松，缓解精神压力',
          '如头痛剧烈、突然发作或伴随神经系统症状，请立即就医'
        ],
        tags: ['头痛', '紧张性头痛', '偏头痛', '神经系统']
      }
    }
  }
  
  // 失眠/睡眠问题
  if (input.includes('失眠') || input.includes('睡不好') || input.includes('睡眠')) {
    return {
      type: 'bot',
      content: '关于您的睡眠问题，我为您做以下分析：\n' + disclaimer,
      timestamp: new Date().toISOString(),
      diagnosisCard: {
        brief_summary: '睡眠质量下降可能由多种因素引起，包括心理压力、生活习惯、环境因素等。',
        possible_conditions: [
          {
            name: '失眠症',
            description: '以入睡困难、睡眠维持困难或早醒为主要表现的睡眠障碍，持续超过3个月为慢性失眠',
            confidence: 0.85
          },
          {
            name: '睡眠呼吸暂停综合征',
            description: '睡眠期间反复出现呼吸暂停，导致睡眠片段化，白天嗜睡乏力',
            confidence: 0.62
          }
        ],
        recommended_next_steps: [
          '建立规律的作息时间，每天固定时间上床和起床',
          '睡前避免使用电子设备和刺激性饮品（咖啡、浓茶）',
          '营造安静、黑暗、舒适的睡眠环境',
          '适当运动，但避免睡前2小时内剧烈运动',
          '如失眠持续超过1个月，建议就医进行睡眠评估'
        ],
        tags: ['失眠', '睡眠障碍', '入睡困难', '睡眠质量']
      }
    }
  }
  
  // 胃肠问题
  if (input.includes('胃痛') || input.includes('腹泻') || input.includes('拉肚子') || input.includes('恶心') || input.includes('胃')) {
    return {
      type: 'bot',
      content: '关于您的胃肠症状，我为您做以下分析：\n' + disclaimer,
      timestamp: new Date().toISOString(),
      diagnosisCard: {
        brief_summary: '消化系统症状较常见，可能与饮食不当、感染、功能紊乱等因素有关。',
        possible_conditions: [
          {
            name: '急性胃肠炎',
            description: '由细菌、病毒或不洁食物引起的胃肠道急性炎症，表现为恶心、呕吐、腹痛、腹泻等',
            confidence: 0.83
          },
          {
            name: '功能性消化不良',
            description: '无器质性病变的消化系统症状群，常表现为上腹部不适、早饱、恶心等',
            confidence: 0.75
          }
        ],
        recommended_next_steps: [
          '清淡饮食，避免辛辣油腻食物',
          '少量多餐，细嚼慢咽',
          '注意饮食卫生，避免食用不洁食物',
          '补充足够水分，防止脱水',
          '如出现血便、持续高热或剧烈腹痛，请立即就医'
        ],
        tags: ['胃肠炎', '胃痛', '腹泻', '消化系统']
      }
    }
  }
  
  // 血糖/糖尿病
  if (input.includes('血糖') || input.includes('糖尿病')) {
    return {
      type: 'bot',
      content: '关于血糖管理和糖尿病相关问题，我为您提供以下建议：\n' + disclaimer,
      timestamp: new Date().toISOString(),
      diagnosisCard: {
        brief_summary: '血糖管理是糖尿病预防和控制的核心，需要综合饮食、运动和药物干预。',
        possible_conditions: [
          {
            name: '2型糖尿病',
            description: '最常见的糖尿病类型，以胰岛素抵抗和相对胰岛素分泌不足为特征，多见于中老年',
            confidence: 0.78
          },
          {
            name: '糖耐量异常',
            description: '介于正常血糖和糖尿病之间的代谢状态，是糖尿病的重要预警信号',
            confidence: 0.84
          }
        ],
        recommended_next_steps: [
          '每日监测空腹和餐后血糖',
          '控制碳水化合物摄入，选择低GI食物',
          '坚持规律运动，每周至少150分钟中等强度有氧运动',
          '定期检查糖化血红蛋白（HbA1c）',
          '遵医嘱用药，不可擅自停药或调量'
        ],
        tags: ['血糖管理', '糖尿病', '糖化血红蛋白', '代谢综合征']
      }
    }
  }
  
  // 血液/感染/发烧
  if (input.includes('血') || input.includes('感染') || input.includes('发烧') || input.includes('白细胞') || input.includes('体温')) {
    const bloodRecord = recordsData.records.find(r => r.id === 3)
    if (bloodRecord) {
      return {
        type: 'bot',
        content: '您的血液检查报告显示以下情况：\n' + disclaimer,
        timestamp: new Date().toISOString(),
        diagnosisCard: {
          brief_summary: bloodRecord.summary_text,
          possible_conditions: [
            {
              name: '轻度感染',
              description: '白细胞计数略高，提示可能存在轻微的感染或炎症反应',
              confidence: 0.82
            }
          ],
          recommended_next_steps: [
            '注意休息，避免过度劳累',
            '多喝水，促进代谢',
            '如医生开具抗生素，请按时服用',
            '一周后复查血常规',
            '如出现高热、寒战等症状，立即就医'
          ],
          tags: bloodRecord.image_analysis.tags
        }
      }
    }
  }
  
  // 心脏相关
  if (input.includes('心') || input.includes('心电图') || input.includes('心跳') || input.includes('心率')) {
    const ecgRecord = recordsData.records.find(r => r.id === 4)
    if (ecgRecord) {
      return {
        type: 'bot',
        content: '您的心电图检查结果显示：\n' + disclaimer,
        timestamp: new Date().toISOString(),
        diagnosisCard: {
          brief_summary: ecgRecord.summary_text,
          possible_conditions: [
            {
              name: '心律正常',
              description: '窦性心律，心率正常，各项指标在正常范围内',
              confidence: 0.88
            }
          ],
          recommended_next_steps: [
            '保持良好的作息规律',
            '适度运动，增强心肺功能',
            '避免过度紧张和压力',
            '定期进行心脏健康检查'
          ],
          tags: ecgRecord.image_analysis.tags
        }
      }
    }
  }
  
  // 用药咨询
  if (input.includes('用药') || input.includes('吃药') || input.includes('药物') || input.includes('服药')) {
    return {
      type: 'bot',
      content: '关于用药方面，我为您提供以下建议：\n' + disclaimer,
      timestamp: new Date().toISOString(),
      diagnosisCard: {
        brief_summary: '用药需要严格遵循医嘱，不可擅自增减剂量或停药',
        possible_conditions: [],
        recommended_next_steps: [
          '严格按照医生处方用药',
          '注意药物的服用时间和剂量',
          '了解可能的副作用和注意事项',
          '如有不适，及时咨询医生',
          '不要与其他药物随意搭配',
          '药品需存放在阴凉干燥处，注意有效期'
        ],
        tags: ['用药安全', '遵医嘱', '按时服药', '药物相互作用']
      }
    }
  }
  
  // 预约/挂号/看病
  if (input.includes('预约') || input.includes('挂号') || input.includes('看病') || input.includes('就诊')) {
    return {
      type: 'bot',
      content: '关于预约挂号和就诊，我为您提供以下信息：\n' + disclaimer,
      timestamp: new Date().toISOString(),
      diagnosisCard: {
        brief_summary: '合理规划就诊流程，准备好相关资料，可以提高就诊效率。',
        possible_conditions: [],
        recommended_next_steps: [
          '通过医院官方渠道进行预约挂号',
          '就诊前准备好既往病历、检查报告和用药清单',
          '提前整理要向医生描述的症状和问题',
          '就诊时如实告知医生过敏史和用药史',
          '就诊后妥善保管处方和医嘱',
          '按时复诊，遵医嘱进行后续治疗'
        ],
        tags: ['预约挂号', '就诊流程', '门诊', '医嘱']
      }
    }
  }
  
  // 体检
  if (input.includes('体检') || input.includes('化验')) {
    return {
      type: 'bot',
      content: '关于健康体检，我为您提供以下建议：\n' + disclaimer,
      timestamp: new Date().toISOString(),
      diagnosisCard: {
        brief_summary: '定期体检是健康管理的重要组成部分，有助于早期发现潜在健康问题。',
        possible_conditions: [],
        recommended_next_steps: [
          '建议每年进行一次全面体检',
          '体检前保持正常饮食和作息，避免饮酒',
          '体检当天空腹（8-12小时）进行抽血检查',
          '根据年龄和家族史选择针对性检查项目',
          '妥善保管体检报告，便于对比分析'
        ],
        tags: ['健康体检', '定期检查', '预防医学', '健康管理']
      }
    }
  }
  
  // 运动/锻炼/健身
  if (input.includes('运动') || input.includes('锻炼') || input.includes('健身')) {
    return {
      type: 'bot',
      content: '关于运动锻炼与健康的关系，我为您提供以下建议：\n' + disclaimer,
      timestamp: new Date().toISOString(),
      diagnosisCard: {
        brief_summary: '适量运动有助于改善心血管健康、控制体重、增强免疫力，但需根据个人身体状况选择合适的运动方式。',
        possible_conditions: [],
        recommended_next_steps: [
          '每周进行至少150分钟中等强度有氧运动（如快走、游泳）',
          '运动前做好热身，运动后进行拉伸放松',
          '循序渐进增加运动强度，避免突然剧烈运动',
          '有慢性病的患者运动前需咨询医生',
          '注意运动时的心率和身体反应，避免过度运动'
        ],
        tags: ['运动处方', '有氧运动', '体能训练', '运动安全']
      }
    }
  }
  
  // 饮食/营养/减肥
  if (input.includes('饮食') || input.includes('营养') || input.includes('减肥') || input.includes('体重')) {
    return {
      type: 'bot',
      content: '关于饮食营养和体重管理，我为您提供以下建议：\n' + disclaimer,
      timestamp: new Date().toISOString(),
      diagnosisCard: {
        brief_summary: '均衡饮食是维持健康的基础，合理的营养搭配有助于预防慢性病和管理体重。',
        possible_conditions: [],
        recommended_next_steps: [
          '遵循中国居民膳食指南，保证食物多样化',
          '每日摄入足够的蔬菜水果（500g以上）',
          '控制盐、糖、油的摄入量',
          '规律进餐，避免暴饮暴食',
          '如有特殊疾病（如糖尿病、肾病），请遵医嘱调整饮食'
        ],
        tags: ['营养均衡', '膳食指南', '体重管理', '健康饮食']
      }
    }
  }
  
  // 心理/焦虑/压力
  if (input.includes('心理') || input.includes('焦虑') || input.includes('压力') || input.includes('抑郁') || input.includes('情绪')) {
    return {
      type: 'bot',
      content: '关于心理健康问题，我为您提供以下分析和建议：\n' + disclaimer,
      timestamp: new Date().toISOString(),
      diagnosisCard: {
        brief_summary: '心理健康与身体健康密切相关，长期的精神压力和焦虑情绪可能引发多种躯体症状。',
        possible_conditions: [
          {
            name: '广泛性焦虑障碍',
            description: '过度、持续地担忧日常事务，伴随紧张不安、注意力难以集中、睡眠障碍等症状',
            confidence: 0.80
          },
          {
            name: '适应障碍',
            description: '面对生活变化或压力事件时出现的情绪和行为反应，通常在事件发生后3个月内出现',
            confidence: 0.77
          }
        ],
        recommended_next_steps: [
          '学习放松技巧，如深呼吸、冥想、渐进式肌肉放松',
          '保持规律的作息和适度的体育锻炼',
          '与家人朋友倾诉，建立良好的社会支持系统',
          '减少咖啡因和酒精的摄入',
          '如焦虑或低落情绪持续超过2周，建议寻求专业心理咨询'
        ],
        tags: ['心理健康', '焦虑', '压力管理', '心理咨询']
      }
    }
  }
  
  // 血压
  if (input.includes('血压')) {
    return {
      type: 'bot',
      content: '关于血压管理和高血压相关问题，我为您提供以下建议：\n' + disclaimer,
      timestamp: new Date().toISOString(),
      diagnosisCard: {
        brief_summary: '血压管理是心血管健康的重要指标，正常血压范围为收缩压<120mmHg，舒张压<80mmHg。',
        possible_conditions: [
          {
            name: '原发性高血压',
            description: '以血压持续升高为主要表现的慢性疾病，是心脑血管疾病的重要危险因素',
            confidence: 0.86
          }
        ],
        recommended_next_steps: [
          '每日定时测量血压并记录',
          '低盐饮食（每日钠摄入<5g）',
          '规律运动，控制体重',
          '戒烟限酒',
          '遵医嘱服用降压药物，不可擅自停药',
          '定期复查，监测血压变化趋势'
        ],
        tags: ['血压管理', '高血压', '心血管健康', '降压治疗']
      }
    }
  }
  
  // 紧急情况
  if (input.includes('紧急') || input.includes('急救') || input.includes('危险') || input.includes('严重')) {
    return {
      type: 'bot',
      content: '⚠️ 如果您遇到紧急医疗情况，请立即采取行动：\n' + disclaimer,
      timestamp: new Date().toISOString(),
      diagnosisCard: {
        brief_summary: '紧急情况需要专业医疗救助，请不要延误',
        possible_conditions: [],
        recommended_next_steps: [
          '立即拨打急救电话 120',
          '保持冷静，说明具体情况和位置',
          '在等待救援时，确保患者安全',
          '如有需要，进行基础急救措施',
          '准备好相关病历和药物信息'
        ],
        tags: ['紧急', '急救', '120']
      }
    }
  }
  
  // 健康指标（通用）
  if (input.includes('指标') || input.includes('健康')) {
    return {
      type: 'bot',
      content: '关于健康指标监测，我为您提供以下建议：\n' + disclaimer,
      timestamp: new Date().toISOString(),
      diagnosisCard: {
        brief_summary: '定期监测健康指标有助于及早发现健康问题',
        possible_conditions: [],
        recommended_next_steps: [
          '每天定时测量血压和血糖',
          '记录测量结果，观察变化趋势',
          '保持健康的生活方式',
          '定期体检，全面了解身体状况',
          '如指标异常，及时咨询医生'
        ],
        tags: ['健康监测', '血压', '血糖', '定期体检']
      }
    }
  }
  
  // 默认回复
  return {
    type: 'bot',
    content: '感谢您的咨询。作为AI医疗助手，我可以为您提供健康建议和病历分析。您可以询问关于病历、症状、用药等方面的问题。如需专业诊断，请咨询医生。\n' + disclaimer,
    timestamp: new Date().toISOString(),
    diagnosisCard: {
      brief_summary: '我可以帮您解答各类健康问题',
      possible_conditions: [],
      recommended_next_steps: [
        '详细描述您的症状或问题',
        '提供相关的检查报告信息',
        '如有紧急情况，请立即就医',
        '定期进行健康检查'
      ],
      tags: ['智能咨询', '健康助手', '医疗建议']
    }
  }
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messages.value.length > 0) {
      scrollIntoView.value = 'msg-' + (messages.value.length - 1)
      scrollTop.value = 999999
    }
  })
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// 获取置信度样式
const getConfidenceClass = (confidence) => {
  if (confidence >= 0.8) return 'high'
  if (confidence >= 0.6) return 'medium'
  return 'low'
}
</script>

<style scoped>
@import '@/styles/platform-import.scss';

.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #F0F4F8 0%, #FAFBFC 100%);
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 100rpx;
}

.chat-content {
  flex: 1;
  padding: 24rpx;
  overflow-y: auto;
}

/* 欢迎消息 */
.welcome-msg {
  text-align: center;
  padding: 80rpx 40rpx;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.welcome-icon {
  font-size: 120rpx;
  margin-bottom: 24rpx;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10rpx); }
}

.welcome-title {
  font-size: var(--font-2xl);
  font-weight: var(--weight-bold);
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16rpx;
}

.welcome-desc {
  font-size: var(--font-md);
  color: var(--color-text-secondary);
  margin-bottom: 48rpx;
  line-height: 1.6;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  justify-content: center;
}

.quick-btn {
  background: white;
  padding: 24rpx 36rpx;
  border-radius: var(--radius-full);
  font-size: var(--font-sm);
  color: #37CD87;
  box-shadow: var(--shadow-md);
  transition: all var(--duration-base) var(--ease-smooth);
  border: 2rpx solid rgba(55, 205, 135, 0.2);
  font-weight: var(--weight-medium);
}

.quick-btn:active {
  transform: translateY(-2rpx) scale(0.98);
  box-shadow: var(--shadow-lg);
  border-color: rgba(55, 205, 135, 0.4);
}

/* 消息行 */
.message-wrapper {
  margin-bottom: 24rpx;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.msg-row {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 8rpx;
}

.msg-user {
  flex-direction: row-reverse;
}

.msg-bot {
  flex-direction: row;
}

.msg-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  flex-shrink: 0;
}

.user-avatar {
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  box-shadow: 0 4rpx 12rpx rgba(55, 205, 135, 0.3);
}

.bot-avatar {
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  box-shadow: 0 4rpx 12rpx rgba(55, 205, 135, 0.3);
}

.msg-content-wrapper {
  flex: 1;
  max-width: 75%;
}

.msg-bubble {
  padding: 28rpx 32rpx;
  border-radius: var(--radius-xl);
  font-size: var(--font-md);
  line-height: 1.7;
  word-wrap: break-word;
  max-width: 100%;
  position: relative;
}

.user-bubble {
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  color: white;
  border-bottom-right-radius: 8rpx;
  box-shadow: 0 8rpx 24rpx rgba(55, 205, 135, 0.3);
  margin-left: auto;
  max-width: 75%;
}

.user-bubble::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%);
  pointer-events: none;
}

.bot-bubble {
  background: white;
  color: var(--color-text-primary);
  border-bottom-left-radius: 8rpx;
  box-shadow: var(--shadow-md);
  border: 2rpx solid rgba(55, 205, 135, 0.08);
}

.msg-text {
  display: block;
}

/* 诊断卡片 - 高级医疗卡片设计 */
.diagnosis-card {
  background: white;
  border-radius: var(--radius-2xl);
  padding: 32rpx;
  margin-top: 20rpx;
  box-shadow: var(--shadow-lg);
  border: 2rpx solid rgba(55, 205, 135, 0.15);
  position: relative;
  overflow: hidden;
}

.diagnosis-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6rpx;
  background: linear-gradient(90deg, #37CD87 0%, #2DB873 100%);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.card-icon {
  font-size: 36rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #37CD87;
}

.card-section {
  margin-bottom: 24rpx;
}

.card-section:last-child {
  margin-bottom: 0;
}

.section-label {
  font-size: 26rpx;
  color: #8c8c8c;
  margin-bottom: 12rpx;
  font-weight: 500;
}

.section-text {
  font-size: 28rpx;
  color: #595959;
  line-height: 1.6;
  display: block;
}

/* 可能病症 */
.condition-item {
  background: #f0f7ff;
  padding: 20rpx;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
  border-left: 4rpx solid #37CD87;
}

.condition-item:last-child {
  margin-bottom: 0;
}

.condition-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.condition-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;
}

.confidence-badge {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 600;
}

.confidence-badge.high {
  background: #52c41a;
  color: white;
}

.confidence-badge.medium {
  background: #faad14;
  color: white;
}

.confidence-badge.low {
  background: #ff4d4f;
  color: white;
}

.condition-desc {
  font-size: 26rpx;
  color: #595959;
  line-height: 1.5;
  display: block;
}

/* 建议措施 */
.step-item {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.step-item:last-child {
  margin-bottom: 0;
}

.step-number {
  width: 40rpx;
  height: 40rpx;
  background: #37CD87;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  font-weight: 600;
  flex-shrink: 0;
}

.step-text {
  flex: 1;
  font-size: 26rpx;
  color: #595959;
  line-height: 1.6;
  padding-top: 4rpx;
}

/* 标签 */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.tag-item {
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  color: white;
  padding: 8rpx 20rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(55, 205, 135, 0.2);
}

/* 时间戳 */
.msg-time {
  text-align: center;
  font-size: 22rpx;
  color: #bfbfbf;
  margin: 8rpx 0 16rpx;
}

/* 输入中动画 */
.typing-indicator {
  background: white;
  padding: 20rpx 28rpx;
  border-radius: 20rpx;
  border-bottom-left-radius: 4rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 8rpx;
  align-items: center;
}

.typing-dot {
  width: 12rpx;
  height: 12rpx;
  background: #37CD87;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-10rpx); opacity: 1; }
}

/* 输入区域 */
.ai-disclaimer {
  padding: 12rpx 20rpx;
  background: #f5f5f5;
  text-align: center;
  border-top: 2rpx solid #eeeeee;
}

.disclaimer-text {
  font-size: 22rpx;
  color: #999999;
  line-height: 1.5;
}

.chat-input {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  background: white;
  border-top: 2rpx solid #f0f0f0;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.voice-btn {
  width: 72rpx;
  height: 72rpx;
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 12rpx rgba(55, 205, 135, 0.3);
}

.voice-btn.recording {
  background: linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 4rpx 12rpx rgba(255, 77, 79, 0.3); }
  50% { transform: scale(1.05); box-shadow: 0 8rpx 24rpx rgba(255, 77, 79, 0.5); }
}

.voice-btn:active {
  transform: scale(0.95);
}

.input-field {
  flex: 1;
  height: 72rpx;
  background: #f5f5f5;
  border: 2rpx solid #e0e0e0;
  border-radius: 36rpx;
  padding: 0 28rpx;
  font-size: 28rpx;
  transition: all 0.3s ease;
}

.input-field:focus {
  background: white;
  border-color: #37CD87;
  box-shadow: 0 0 0 4rpx rgba(55, 205, 135, 0.1);
}

.send-btn {
  padding: 20rpx 36rpx;
  background: #f0f0f0;
  color: #bfbfbf;
  border-radius: 36rpx;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.3s ease;
}

.send-btn.active {
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(55, 205, 135, 0.3);
}

.send-btn.active:active {
  transform: scale(0.95);
}
</style>