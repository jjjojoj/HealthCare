<template>
  <view class="page">
    <AppHeader title="药品管理" :show-back="true" />

    <scroll-view scroll-y class="content">
      <!-- 当前处方区域 -->
      <view class="prescription-section" v-if="currentPrescription.length > 0">
        <view class="section-header">
          <view class="section-title">
            <view class="icon">💊</view>
            <text class="title-text">当前处方</text>
            <view class="badge">{{ currentPrescription.length }}</view>
          </view>
          <view class="clear-btn" @click="clearPrescription">
            <text class="clear-text">清空</text>
          </view>
        </view>

        <view class="prescription-list">
          <view 
            v-for="(item, index) in currentPrescription" 
            :key="item.id"
            class="prescription-item"
          >
            <view class="item-content">
              <view class="item-header">
                <text class="item-name">{{ item.name }}</text>
                <view class="remove-btn" @click="removeMedFromPrescription(index)">
                  <text class="remove-icon">×</text>
                </view>
              </view>
              <view class="item-code">ATC: {{ item.atc_code }}</view>
              <view class="reminder-info">
                <view class="reminder-item">
                  <text class="reminder-icon">⏰</text>
                  <text class="reminder-text">{{ item.reminder.times.join(', ') }}</text>
                </view>
                <view class="reminder-item">
                  <text class="reminder-icon">📅</text>
                  <text class="reminder-text">{{ item.reminder.frequency }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 搜索区域 -->
      <view class="search-section">
        <view class="search-box">
          <view class="search-icon">🔍</view>
          <input 
            class="search-input" 
            v-model="searchKeyword"
            placeholder="搜索药品名称..."
            @input="handleSearch"
          />
          <view v-if="searchKeyword" class="clear-search" @click="clearSearch">
            <text class="clear-icon">×</text>
          </view>
        </view>
      </view>

      <!-- 药品列表 -->
      <view class="meds-section">
        <view class="section-header">
          <view class="section-title">
            <view class="icon">📋</view>
            <text class="title-text">药品库</text>
            <view class="count-badge">{{ filteredMedications.length }}</view>
          </view>
        </view>

        <view class="meds-list">
          <view 
            v-for="med in filteredMedications" 
            :key="med.id"
            class="med-card"
            @click="showMedDetail(med)"
          >
            <view class="med-header">
              <view class="med-name">{{ med.name }}</view>
              <view class="add-btn" @click.stop="addToPrescription(med)">
                <text class="add-icon">+</text>
              </view>
            </view>
            <view class="med-code">ATC: {{ med.atc_code }}</view>
            <view class="med-notes">{{ med.notes.slice(0, 50) }}...</view>
            <view class="interaction-badge" v-if="med.interactions.length > 0">
              <text class="badge-text">⚠️ {{ med.interactions.length }} 个相互作用</text>
            </view>
          </view>

          <view v-if="filteredMedications.length === 0" class="empty-state">
            <text class="empty-icon">🔍</text>
            <text class="empty-text">未找到相关药品</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 药品详情弹窗 -->
    <view v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">药品详情</text>
          <view class="modal-close" @click="closeDetailModal">
            <text class="close-icon">×</text>
          </view>
        </view>

        <view class="modal-body" v-if="selectedMed">
          <view class="detail-item">
            <view class="detail-label">药品名称</view>
            <view class="detail-value">{{ selectedMed.name }}</view>
          </view>

          <view class="detail-item">
            <view class="detail-label">ATC 编码</view>
            <view class="detail-value">{{ selectedMed.atc_code }}</view>
          </view>

          <view class="detail-item">
            <view class="detail-label">说明</view>
            <view class="detail-value notes">{{ selectedMed.notes }}</view>
          </view>

          <view class="detail-item" v-if="selectedMed.interactions.length > 0">
            <view class="detail-label">药物相互作用</view>
            <view class="interaction-list">
              <view 
                v-for="interactionId in selectedMed.interactions" 
                :key="interactionId"
                class="interaction-item"
              >
                <text class="interaction-name">{{ getMedNameById(interactionId) }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="modal-footer">
          <button class="modal-btn cancel-btn" @click="closeDetailModal">关闭</button>
          <button class="modal-btn confirm-btn" @click="addToPrescriptionFromDetail">
            加入处方
          </button>
        </view>
      </view>
    </view>

    <!-- 药物相互作用警告弹窗 -->
    <view v-if="showInteractionWarning" class="modal-overlay warning-overlay" @click="closeInteractionWarning">
      <view class="modal-content warning-modal" @click.stop>
        <view class="warning-header">
          <view class="warning-icon">⚠️</view>
          <text class="warning-title">药物相互作用警告</text>
        </view>

        <view class="warning-body">
          <view class="warning-message">
            <text class="warning-med">{{ interactionWarning.newMed }}</text>
            <text> 与处方中的 </text>
            <text class="warning-med">{{ interactionWarning.existingMed }}</text>
            <text> 存在相互作用风险</text>
          </view>

          <view class="severity-badge" :class="'severity-' + interactionWarning.severity">
            <text class="severity-text">{{ getSeverityText(interactionWarning.severity) }}</text>
          </view>

          <view class="warning-description">
            {{ interactionWarning.description }}
          </view>

          <!-- 替代药物建议 -->
          <view class="alternatives-section" v-if="alternativeMeds.length > 0">
            <view class="alternatives-title">💡 推荐替代药物</view>
            <view class="alternatives-list">
              <view 
                v-for="alt in alternativeMeds" 
                :key="alt.id"
                class="alternative-item"
                @click="selectAlternative(alt)"
              >
                <view class="alt-name">{{ alt.name }}</view>
                <view class="alt-code">ATC: {{ alt.atc_code }}</view>
                <view class="alt-select">选择</view>
              </view>
            </view>
          </view>
        </view>

        <view class="warning-footer">
          <button class="warning-btn cancel-btn" @click="closeInteractionWarning">取消添加</button>
          <button class="warning-btn confirm-btn" @click="forceAddToPrescription">仍然添加</button>
        </view>
      </view>
    </view>

    <!-- 用药提醒设置弹窗 -->
    <view v-if="showReminderModal" class="modal-overlay" @click="closeReminderModal">
      <view class="modal-content reminder-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">设置用药提醒</text>
          <view class="modal-close" @click="closeReminderModal">
            <text class="close-icon">×</text>
          </view>
        </view>

        <view class="modal-body">
          <view class="reminder-setting">
            <view class="setting-label">用药频次</view>
            <picker 
              mode="selector" 
              :range="frequencyOptions" 
              :value="reminderConfig.frequencyIndex"
              @change="onFrequencyChange"
            >
              <view class="picker-value">{{ frequencyOptions[reminderConfig.frequencyIndex] }}</view>
            </picker>
          </view>

          <view class="reminder-setting">
            <view class="setting-label">用药时间</view>
            <view class="time-slots">
              <view 
                v-for="(time, index) in reminderConfig.times" 
                :key="index"
                class="time-slot"
              >
                <picker 
                  mode="time" 
                  :value="time"
                  @change="e => onTimeChange(index, e)"
                >
                  <view class="time-value">{{ time }}</view>
                </picker>
                <view class="remove-time" @click="removeTimeSlot(index)" v-if="reminderConfig.times.length > 1">
                  <text>×</text>
                </view>
              </view>
              <view class="add-time-btn" @click="addTimeSlot" v-if="reminderConfig.times.length < 5">
                <text>+ 添加时间</text>
              </view>
            </view>
          </view>
        </view>

        <view class="modal-footer">
          <button class="modal-btn cancel-btn" @click="closeReminderModal">取消</button>
          <button class="modal-btn confirm-btn" @click="confirmReminder">确认添加</button>
        </view>
      </view>
    </view>

    <BottomNav />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import medsData from '@/static/mock/meds.json'

// 数据
const allMedications = ref(medsData.medications)
const currentPrescription = ref([])
const searchKeyword = ref('')

// 弹窗状态
const showDetailModal = ref(false)
const showInteractionWarning = ref(false)
const showReminderModal = ref(false)

// 选中的药品
const selectedMed = ref(null)
const pendingMed = ref(null) // 待添加的药品（等待提醒设置）

// 相互作用警告信息
const interactionWarning = ref({
  newMed: '',
  existingMed: '',
  severity: 'moderate',
  description: ''
})

// 替代药物列表
const alternativeMeds = ref([])

// 用药提醒配置
const frequencyOptions = ['每日一次', '每日两次', '每日三次', '每日四次', '按需服用']
const reminderConfig = ref({
  frequencyIndex: 0,
  times: ['08:00']
})

// 搜索过滤
const filteredMedications = computed(() => {
  if (!searchKeyword.value.trim()) {
    return allMedications.value
  }
  
  const keyword = searchKeyword.value.toLowerCase().trim()
  return allMedications.value.filter(med => 
    med.name.toLowerCase().includes(keyword) ||
    med.atc_code.toLowerCase().includes(keyword) ||
    med.notes.toLowerCase().includes(keyword)
  )
})

// 搜索处理
const handleSearch = () => {
  // 搜索逻辑已通过 computed 实现
}

const clearSearch = () => {
  searchKeyword.value = ''
}

// 显示药品详情
const showMedDetail = (med) => {
  selectedMed.value = med
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedMed.value = null
}

// 从详情弹窗添加到处方
const addToPrescriptionFromDetail = () => {
  if (selectedMed.value) {
    addToPrescription(selectedMed.value)
    closeDetailModal()
  }
}

// 添加药品到处方
const addToPrescription = (med) => {
  // 检查是否已在处方中
  const exists = currentPrescription.value.some(item => item.id === med.id)
  if (exists) {
    // #ifdef H5
    alert('该药品已在处方中')
    // #endif
    // #ifndef H5
    uni.showToast({
      title: '该药品已在处方中',
      icon: 'none'
    })
    // #endif
    return
  }

  // 检查药物相互作用
  const interaction = checkInteraction(med)
  if (interaction) {
    // 显示警告弹窗
    pendingMed.value = med
    interactionWarning.value = {
      newMed: med.name,
      existingMed: interaction.existingMed.name,
      severity: interaction.severity,
      description: getInteractionDescription(med, interaction.existingMed)
    }
    
    // 查找替代药物
    alternativeMeds.value = findAlternativeMeds(med)
    
    showInteractionWarning.value = true
    return
  }

  // 无相互作用，显示提醒设置弹窗
  pendingMed.value = med
  resetReminderConfig()
  showReminderModal.value = true
}

// 检查药物相互作用
const checkInteraction = (newMed) => {
  for (const prescribedMed of currentPrescription.value) {
    // 检查新药是否与已有药品冲突
    if (newMed.interactions.includes(prescribedMed.id)) {
      return {
        existingMed: prescribedMed,
        severity: calculateSeverity(newMed, prescribedMed)
      }
    }
    
    // 检查已有药品是否与新药冲突
    if (prescribedMed.interactions.includes(newMed.id)) {
      return {
        existingMed: prescribedMed,
        severity: calculateSeverity(newMed, prescribedMed)
      }
    }
  }
  
  return null
}

// 计算相互作用严重程度（简单算法）
const calculateSeverity = (med1, med2) => {
  // 基于 ATC 编码前缀判断严重程度
  const prefix1 = med1.atc_code.charAt(0)
  const prefix2 = med2.atc_code.charAt(0)
  
  // 如果都是影响同一系统的药物，可能更严重
  if (prefix1 === prefix2) {
    return 'severe'
  }
  
  // CYP3A4 相关的相互作用（酮康唑）
  if (med1.id === 3 || med2.id === 3) {
    return 'severe'
  }
  
  // 抗凝血药相关
  if (med1.id === 8 || med2.id === 8) {
    return 'severe'
  }
  
  // 其他情况
  return 'moderate'
}

// 获取严重程度文本
const getSeverityText = (severity) => {
  const severityMap = {
    severe: '严重',
    moderate: '中等',
    mild: '轻微'
  }
  return severityMap[severity] || '未知'
}

// 获取相互作用描述
const getInteractionDescription = (med1, med2) => {
  const descriptions = {
    '1-3': '酮康唑可抑制氯雷他定代谢，导致血药浓度升高，可能增加心脏毒性风险。建议监测心电图或选择替代药物。',
    '3-1': '酮康唑可抑制氯雷他定代谢，导致血药浓度升高，可能增加心脏毒性风险。建议监测心电图或选择替代药物。',
    '2-5': '丙磺舒可减少阿莫西林的肾排泄，延长其半衰期，可能需要调整阿莫西林剂量。',
    '5-2': '丙磺舒可减少阿莫西林的肾排泄，延长其半衰期，可能需要调整阿莫西林剂量。',
    '3-7': '酮康唑抑制CYP3A4酶，可显著增加辛伐他汀血药浓度，增加肌病和横纹肌溶解风险。强烈建议避免合用。',
    '7-3': '酮康唑抑制CYP3A4酶，可显著增加辛伐他汀血药浓度，增加肌病和横纹肌溶解风险。强烈建议避免合用。',
    '4-8': '布洛芬与华法林合用可能增加出血风险，需密切监测INR值和凝血功能。',
    '8-4': '布洛芬与华法林合用可能增加出血风险，需密切监测INR值和凝血功能。'
  }
  
  const key1 = `${med1.id}-${med2.id}`
  const key2 = `${med2.id}-${med1.id}`
  
  return descriptions[key1] || descriptions[key2] || '这两种药物可能存在相互作用，请咨询医生或药师。'
}

// 查找替代药物
const findAlternativeMeds = (med) => {
  // 获取当前处方中所有药品的 ID
  const prescriptionIds = currentPrescription.value.map(item => item.id)
  
  // 查找与当前处方中所有药品都不冲突的药物
  const alternatives = allMedications.value.filter(altMed => {
    // 排除当前要添加的药品
    if (altMed.id === med.id) return false
    
    // 排除已在处方中的药品
    if (prescriptionIds.includes(altMed.id)) return false
    
    // 检查是否与处方中的药品有冲突
    for (const prescribedMed of currentPrescription.value) {
      if (altMed.interactions.includes(prescribedMed.id) || 
          prescribedMed.interactions.includes(altMed.id)) {
        return false
      }
    }
    
    return true
  })
  
  // 返回最多 3 个替代药物
  return alternatives.slice(0, 3)
}

// 选择替代药物
const selectAlternative = (altMed) => {
  closeInteractionWarning()
  addToPrescription(altMed)
}

// 强制添加（忽略警告）
const forceAddToPrescription = () => {
  if (pendingMed.value) {
    closeInteractionWarning()
    resetReminderConfig()
    showReminderModal.value = true
  }
}

// 关闭相互作用警告
const closeInteractionWarning = () => {
  showInteractionWarning.value = false
  pendingMed.value = null
  alternativeMeds.value = []
}

// 用药提醒设置
const resetReminderConfig = () => {
  reminderConfig.value = {
    frequencyIndex: 0,
    times: ['08:00']
  }
}

const onFrequencyChange = (e) => {
  const index = e.detail.value
  reminderConfig.value.frequencyIndex = index
  
  // 根据频次自动调整时间
  const timesMap = {
    0: ['08:00'], // 每日一次
    1: ['08:00', '20:00'], // 每日两次
    2: ['08:00', '14:00', '20:00'], // 每日三次
    3: ['08:00', '12:00', '16:00', '20:00'], // 每日四次
    4: ['08:00'] // 按需服用
  }
  
  reminderConfig.value.times = timesMap[index] || ['08:00']
}

const onTimeChange = (index, e) => {
  reminderConfig.value.times[index] = e.detail.value
}

const addTimeSlot = () => {
  if (reminderConfig.value.times.length < 5) {
    reminderConfig.value.times.push('12:00')
  }
}

const removeTimeSlot = (index) => {
  if (reminderConfig.value.times.length > 1) {
    reminderConfig.value.times.splice(index, 1)
  }
}

// 确认添加到处方
const confirmReminder = () => {
  if (pendingMed.value) {
    const medWithReminder = {
      ...pendingMed.value,
      reminder: {
        frequency: frequencyOptions[reminderConfig.value.frequencyIndex],
        times: [...reminderConfig.value.times]
      }
    }
    
    currentPrescription.value.push(medWithReminder)
    
    // 模拟设置本地通知
    scheduleLocalNotification(medWithReminder)
    
    // #ifdef H5
    alert(`已添加 ${medWithReminder.name} 到处方`)
    // #endif
    // #ifndef H5
    uni.showToast({
      title: '已添加到处方',
      icon: 'success'
    })
    // #endif
    
    closeReminderModal()
  }
}

const closeReminderModal = () => {
  showReminderModal.value = false
  pendingMed.value = null
}

// 模拟设置本地通知
const scheduleLocalNotification = (med) => {
  console.log('设置用药提醒:', {
    medication: med.name,
    frequency: med.reminder.frequency,
    times: med.reminder.times
  })
  
  // 在实际应用中，这里应该调用系统通知 API
  // #ifndef H5
  // uni.scheduleNotification({...})
  // #endif
}

// 从处方中移除药品
const removeMedFromPrescription = (index) => {
  const med = currentPrescription.value[index]
  currentPrescription.value.splice(index, 1)
  
  // #ifdef H5
  console.log('已移除:', med.name)
  // #endif
  // #ifndef H5
  uni.showToast({
    title: '已移除',
    icon: 'success'
  })
  // #endif
}

// 清空处方
const clearPrescription = () => {
  // #ifdef H5
  if (confirm('确定要清空当前处方吗？')) {
    currentPrescription.value = []
  }
  // #endif
  // #ifndef H5
  uni.showModal({
    title: '确认',
    content: '确定要清空当前处方吗？',
    success: (res) => {
      if (res.confirm) {
        currentPrescription.value = []
      }
    }
  })
  // #endif
}

// 根据 ID 获取药品名称
const getMedNameById = (id) => {
  const med = allMedications.value.find(m => m.id === id)
  return med ? med.name : '未知药品'
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f7ff 0%, #f5f5f5 100%);
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 20rpx;
  padding-bottom: 120rpx;
}

/* 当前处方区域 */
.prescription-section {
  margin-bottom: 24rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.icon {
  font-size: 36rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #262626;
}

.badge {
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  color: white;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 600;
}

.count-badge {
  background: #f0f0f0;
  color: #666;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 600;
}

.clear-btn {
  padding: 8rpx 20rpx;
  background: #fff1f0;
  border-radius: 20rpx;
}

.clear-text {
  font-size: 26rpx;
  color: #ff4d4f;
  font-weight: 500;
}

.prescription-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.prescription-item {
  background: white;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #262626;
}

.remove-btn {
  width: 48rpx;
  height: 48rpx;
  background: #fff1f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-icon {
  font-size: 40rpx;
  color: #ff4d4f;
  line-height: 1;
}

.item-code {
  font-size: 24rpx;
  color: #8c8c8c;
}

.reminder-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-top: 8rpx;
  padding: 16rpx;
  background: #f8f9ff;
  border-radius: 12rpx;
}

.reminder-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.reminder-icon {
  font-size: 24rpx;
}

.reminder-text {
  font-size: 26rpx;
  color: #595959;
}

/* 搜索区域 */
.search-section {
  margin-bottom: 24rpx;
}

.search-box {
  background: white;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.search-icon {
  font-size: 32rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #262626;
}

.clear-search {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 50%;
}

.clear-icon {
  font-size: 32rpx;
  color: #8c8c8c;
  line-height: 1;
}

/* 药品列表 */
.meds-section {
  margin-bottom: 24rpx;
}

.meds-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.med-card {
  background: white;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
}

.med-card:active {
  transform: scale(0.98);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.med-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.med-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #262626;
  flex: 1;
}

.add-btn {
  width: 56rpx;
  height: 56rpx;
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(55, 205, 135, 0.3);
}

.add-icon {
  font-size: 36rpx;
  color: white;
  line-height: 1;
  font-weight: 600;
}

.med-code {
  font-size: 24rpx;
  color: #8c8c8c;
  margin-bottom: 8rpx;
}

.med-notes {
  font-size: 26rpx;
  color: #595959;
  line-height: 1.6;
  margin-bottom: 12rpx;
}

.interaction-badge {
  display: inline-block;
  padding: 6rpx 16rpx;
  background: #fff7e6;
  border-radius: 20rpx;
  border: 2rpx solid #ffd591;
}

.badge-text {
  font-size: 22rpx;
  color: #d48806;
  font-weight: 500;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 20rpx;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 20rpx;
  opacity: 0.3;
}

.empty-text {
  font-size: 28rpx;
  color: #8c8c8c;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 40rpx;
}

.modal-content {
  background: white;
  border-radius: 24rpx;
  width: 100%;
  max-width: 600rpx;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #262626;
}

.modal-close {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 50%;
}

.close-icon {
  font-size: 40rpx;
  color: #8c8c8c;
  line-height: 1;
}

.modal-body {
  flex: 1;
  padding: 32rpx;
  overflow-y: auto;
}

.detail-item {
  margin-bottom: 24rpx;
}

.detail-label {
  font-size: 24rpx;
  color: #8c8c8c;
  margin-bottom: 8rpx;
}

.detail-value {
  font-size: 28rpx;
  color: #262626;
}

.detail-value.notes {
  line-height: 1.6;
  color: #595959;
}

.interaction-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.interaction-item {
  padding: 12rpx 16rpx;
  background: #fff7e6;
  border-radius: 8rpx;
}

.interaction-name {
  font-size: 26rpx;
  color: #d48806;
}

.modal-footer {
  display: flex;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  border-top: 2rpx solid #f0f0f0;
}

.modal-btn {
  flex: 1;
  padding: 24rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
}

.cancel-btn {
  background: #f0f0f0;
  color: #595959;
}

.confirm-btn {
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  color: white;
}

/* 警告弹窗 */
.warning-overlay {
  background: rgba(0, 0, 0, 0.75);
}

.warning-modal {
  max-width: 640rpx;
}

.warning-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 32rpx 24rpx;
}

.warning-icon {
  font-size: 80rpx;
  margin-bottom: 16rpx;
}

.warning-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #ff4d4f;
}

.warning-body {
  padding: 24rpx 32rpx 32rpx;
}

.warning-message {
  font-size: 28rpx;
  color: #262626;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 16rpx;
}

.warning-med {
  font-weight: 600;
  color: #ff4d4f;
}

.severity-badge {
  display: inline-block;
  width: 100%;
  text-align: center;
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
}

.severity-severe {
  background: #fff1f0;
  border: 2rpx solid #ffccc7;
}

.severity-moderate {
  background: #fff7e6;
  border: 2rpx solid #ffd591;
}

.severity-mild {
  background: #e6fffb;
  border: 2rpx solid #87e8de;
}

.severity-text {
  font-size: 26rpx;
  font-weight: 600;
  color: #ff4d4f;
}

.severity-moderate .severity-text {
  color: #d48806;
}

.severity-mild .severity-text {
  color: #13c2c2;
}

.warning-description {
  font-size: 26rpx;
  color: #595959;
  line-height: 1.6;
  background: #fafafa;
  padding: 20rpx;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
}

.alternatives-section {
  margin-top: 24rpx;
}

.alternatives-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16rpx;
}

.alternatives-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.alternative-item {
  background: #f0f7ff;
  border: 2rpx solid #bae7ff;
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
}

.alternative-item:active {
  background: #e6f7ff;
  transform: scale(0.98);
}

.alt-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #37CD87;
  margin-bottom: 4rpx;
}

.alt-code {
  font-size: 22rpx;
  color: #8c8c8c;
}

.alt-select {
  padding: 8rpx 20rpx;
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  color: white;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: 600;
}

.warning-footer {
  display: flex;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  border-top: 2rpx solid #f0f0f0;
}

.warning-btn {
  flex: 1;
  padding: 24rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
}

.warning-btn.cancel-btn {
  background: #f0f0f0;
  color: #595959;
}

.warning-btn.confirm-btn {
  background: #ff4d4f;
  color: white;
}

/* 提醒设置弹窗 */
.reminder-modal {
  max-width: 600rpx;
}

.reminder-setting {
  margin-bottom: 32rpx;
}

.setting-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16rpx;
}

.picker-value,
.time-value {
  padding: 20rpx;
  background: #f8f9ff;
  border: 2rpx solid #e6f7ff;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #262626;
}

.time-slots {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.time-slot {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.time-slot picker {
  flex: 1;
}

.remove-time {
  width: 48rpx;
  height: 48rpx;
  background: #fff1f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #ff4d4f;
}

.add-time-btn {
  padding: 20rpx;
  background: #f0f7ff;
  border: 2rpx dashed #91d5ff;
  border-radius: 12rpx;
  text-align: center;
  font-size: 26rpx;
  color: #37CD87;
  font-weight: 500;
}
</style>
