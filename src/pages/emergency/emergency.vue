<template>
  <view class="emergency-container">
    <AppHeader title="紧急联系人" :show-back="true" />
    
    <!-- 演示模式横幅 -->
    <view class="demo-banner">
      <text class="demo-banner-text">⚠️ 演示模式：紧急通知功能仅为演示，不会发送真实消息。如遇紧急情况请拨打 120 急救电话。</text>
    </view>

    <!-- 页面标题 -->
    <view class="page-header">
      <text class="header-subtitle">紧急情况下快速联系您的家人朋友</text>
    </view>

    <!-- 紧急联系人信息卡片 -->
    <view class="contact-card">
      <view class="card-header">
        <view class="header-left">
          <text class="contact-icon">👤</text>
          <view class="header-text">
            <text class="contact-name">{{ emergencyContact.name }}</text>
            <text class="contact-relation">{{ emergencyContact.relation }}</text>
          </view>
        </view>
        <view class="edit-btn" @click="showEditForm">
          <text class="edit-icon">✏️</text>
          <text class="edit-text">编辑</text>
        </view>
      </view>
      
      <view class="contact-info">
        <view class="info-item">
          <text class="info-label">📱 电话</text>
          <text class="info-value">{{ emergencyContact.phone }}</text>
        </view>
      </view>

      <!-- 一键通知按钮 -->
      <view class="action-buttons">
        <button class="emergency-btn" @click="showNotificationConfirm">
          <text class="btn-icon">🚨</text>
          <text class="btn-text">一键通知</text>
        </button>
      </view>
    </view>

    <!-- 通知发送记录 -->
    <view class="notification-history" v-if="notificationHistory.length > 0">
      <view class="history-header">
        <text class="history-title">通知记录</text>
        <text class="history-count">{{ notificationHistory.length }}</text>
      </view>
      
      <view class="history-list">
        <view 
          v-for="(record, index) in notificationHistory" 
          :key="index" 
          class="history-item"
        >
          <view class="history-icon">📤</view>
          <view class="history-content">
            <view class="history-main">
              <text class="history-contact">{{ record.contactName }}</text>
              <text class="history-status">已发送</text>
            </view>
            <text class="history-message">{{ record.message }}</text>
            <text class="history-time">{{ record.timestamp }}</text>
          </view>
        </view>
      </view>

      <view class="clear-history-btn" @click="clearHistory">
        <text>清空记录</text>
      </view>
    </view>

    <!-- 空状态提示 -->
    <view class="empty-state" v-else>
      <text class="empty-icon">📋</text>
      <text class="empty-text">暂无通知记录</text>
    </view>

    <!-- 编辑联系人弹窗 -->
    <view class="modal-overlay" v-if="showEditModal" @click="closeEditForm">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">编辑紧急联系人</text>
          <view class="close-btn" @click="closeEditForm">×</view>
        </view>

        <view class="form-container">
          <view class="form-item">
            <text class="form-label">姓名</text>
            <input 
              class="form-input" 
              v-model="editForm.name" 
              placeholder="请输入联系人姓名"
            />
          </view>

          <view class="form-item">
            <text class="form-label">关系</text>
            <input 
              class="form-input" 
              v-model="editForm.relation" 
              placeholder="如：配偶、父母、子女等"
            />
          </view>

          <view class="form-item">
            <text class="form-label">电话</text>
            <input 
              class="form-input" 
              v-model="editForm.phone" 
              placeholder="请输入联系电话"
              type="number"
            />
          </view>
        </view>

        <view class="modal-footer">
          <button class="modal-btn cancel-btn" @click="closeEditForm">取消</button>
          <button class="modal-btn save-btn" @click="saveContact">保存</button>
        </view>
      </view>
    </view>

    <!-- 通知确认弹窗 -->
    <view class="modal-overlay" v-if="showConfirmModal" @click="closeConfirmModal">
      <view class="modal-content confirm-modal" @click.stop>
        <view class="confirm-header">
          <text class="confirm-icon">⚠️</text>
          <text class="confirm-title">确认发送紧急通知</text>
        </view>

        <view class="confirm-message">
          <text>即将向 <text class="highlight">{{ emergencyContact.name }}</text> ({{ emergencyContact.phone }}) 发送紧急通知消息：</text>
          <view class="message-preview">
            "紧急情况！我需要帮助，请尽快联系我！"
          </view>
        </view>

        <view class="modal-footer">
          <button class="modal-btn cancel-btn" @click="closeConfirmModal">取消</button>
          <button class="modal-btn confirm-btn" @click="sendNotification">确认发送</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import { useAuthGuard } from '@/composables/useAuthGuard'
import { validatePhone } from '@/utils/validator'

useAuthGuard()

// 紧急联系人信息
const emergencyContact = ref({
  name: '',
  relation: '',
  phone: ''
})

// 编辑表单
const editForm = ref({
  name: '',
  relation: '',
  phone: ''
})

// 通知历史记录
const notificationHistory = ref([])

// 弹窗显示状态
const showEditModal = ref(false)
const showConfirmModal = ref(false)

// 页面加载时初始化数据
onMounted(() => {
  loadEmergencyContact()
  loadNotificationHistory()
})

// 加载紧急联系人信息
const loadEmergencyContact = () => {
  // 先尝试从 localStorage 读取
  const savedContact = uni.getStorageSync('emergency_contact')
  
  if (savedContact) {
    emergencyContact.value = JSON.parse(savedContact)
  } else {
    // 如果没有保存的数据，从 users.json 读取默认数据
    // 在实际应用中，这里应该通过 API 获取
    emergencyContact.value = {
      name: '李四',
      relation: '配偶',
      phone: '13900139000'
    }
  }
}

// 加载通知历史记录
const loadNotificationHistory = () => {
  const savedHistory = uni.getStorageSync('notification_history')
  if (savedHistory) {
    notificationHistory.value = JSON.parse(savedHistory)
  }
}

// 显示编辑表单
const showEditForm = () => {
  // 将当前联系人信息复制到编辑表单
  editForm.value = {
    name: emergencyContact.value.name,
    relation: emergencyContact.value.relation,
    phone: emergencyContact.value.phone
  }
  showEditModal.value = true
}

// 关闭编辑表单
const closeEditForm = () => {
  showEditModal.value = false
}

// 保存联系人信息
const saveContact = () => {
  // 验证表单
  if (!editForm.value.name.trim()) {
    uni.showToast({
      title: '请输入联系人姓名',
      icon: 'none'
    })
    return
  }
  
  if (!editForm.value.phone.trim()) {
    uni.showToast({
      title: '请输入联系电话',
      icon: 'none'
    })
    return
  }
  
  // 验证手机号格式
  if (!validatePhone(editForm.value.phone)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    })
    return
  }
  
  // 更新联系人信息
  emergencyContact.value = {
    name: editForm.value.name,
    relation: editForm.value.relation,
    phone: editForm.value.phone
  }
  
  // 保存到 localStorage
  uni.setStorageSync('emergency_contact', JSON.stringify(emergencyContact.value))
  
  // 显示成功提示
  uni.showToast({
    title: '保存成功',
    icon: 'success'
  })
  
  // 关闭弹窗
  closeEditForm()
}

// 显示通知确认弹窗
const showNotificationConfirm = () => {
  showConfirmModal.value = true
}

// 关闭确认弹窗
const closeConfirmModal = () => {
  showConfirmModal.value = false
}

// 发送通知
const sendNotification = () => {
  // 创建通知记录
  const now = new Date()
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
  
  const record = {
    contactName: emergencyContact.value.name,
    contactPhone: emergencyContact.value.phone,
    message: '紧急情况！我需要帮助，请尽快联系我！',
    timestamp: timestamp
  }
  
  // 添加到历史记录（最新的在前面）
  notificationHistory.value.unshift(record)
  
  // 保存到 localStorage
  uni.setStorageSync('notification_history', JSON.stringify(notificationHistory.value))
  
  // 关闭确认弹窗
  closeConfirmModal()
  
  // 显示演示模式提醒
  uni.showModal({
    title: '⚠️ 演示模式提醒',
    content: '这是演示模式，通知未实际发送。如遇紧急情况请拨打 120。',
    showCancel: false,
    confirmText: '我知道了',
    confirmColor: '#f5576c'
  })
  
  // 模拟发送通知（在控制台输出）
  console.log('📤 紧急通知已发送:', record)
}

// 清空历史记录
const clearHistory = () => {
  uni.showModal({
    title: '确认清空',
    content: '确定要清空所有通知记录吗？',
    success: (res) => {
      if (res.confirm) {
        notificationHistory.value = []
        uni.removeStorageSync('notification_history')
        uni.showToast({
          title: '已清空',
          icon: 'success'
        })
      }
    }
  })
}
</script>

<style scoped>
.emergency-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  padding: 40rpx;
}

/* 演示模式横幅 */
.demo-banner {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  padding: 24rpx 32rpx;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(231, 76, 60, 0.4);
  animation: bannerPulse 3s ease-in-out infinite;
}

@keyframes bannerPulse {
  0%, 100% { box-shadow: 0 8rpx 24rpx rgba(231, 76, 60, 0.4); }
  50% { box-shadow: 0 8rpx 32rpx rgba(231, 76, 60, 0.6); }
}

.demo-banner-text {
  font-size: 28rpx;
  color: #ffffff;
  text-align: center;
  line-height: 1.6;
  font-weight: 600;
}

/* 页面标题 */
.page-header {
  margin-bottom: 40rpx;
}

.header-title {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10rpx;
}

.header-subtitle {
  display: block;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
}

/* 联系人卡片 */
.contact-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 30rpx;
  border-bottom: 2rpx solid #f0f0f0;
  margin-bottom: 30rpx;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.contact-icon {
  font-size: 80rpx;
  line-height: 1;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.contact-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
}

.contact-relation {
  font-size: 26rpx;
  color: #999999;
  background: #f5f5f5;
  padding: 6rpx 16rpx;
  border-radius: 12rpx;
  align-self: flex-start;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 24rpx;
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  border-radius: 20rpx;
  cursor: pointer;
  transition: transform 0.2s;
}

.edit-btn:active {
  transform: scale(0.95);
}

.edit-icon {
  font-size: 28rpx;
}

.edit-text {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}

/* 联系信息 */
.contact-info {
  margin-bottom: 30rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
}

.info-label {
  font-size: 28rpx;
  color: #666666;
}

.info-value {
  font-size: 30rpx;
  color: #333333;
  font-weight: 500;
}

/* 一键通知按钮 */
.action-buttons {
  display: flex;
  gap: 20rpx;
}

.emergency-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 28rpx;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 20rpx;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 4rpx 16rpx rgba(245, 87, 108, 0.3);
}

.emergency-btn:active {
  transform: scale(0.98);
}

.btn-icon {
  font-size: 32rpx;
}

.btn-text {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: bold;
}

/* 通知历史记录 */
.notification-history {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.history-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 30rpx;
}

.history-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.history-count {
  font-size: 24rpx;
  color: #ffffff;
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  padding: 4rpx 16rpx;
  border-radius: 12rpx;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.history-item {
  display: flex;
  gap: 20rpx;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  border-left: 6rpx solid #37CD87;
}

.history-icon {
  font-size: 40rpx;
  line-height: 1;
}

.history-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.history-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-contact {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
}

.history-status {
  font-size: 24rpx;
  color: #52c41a;
  background: #f6ffed;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.history-message {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.5;
}

.history-time {
  font-size: 24rpx;
  color: #999999;
}

.clear-history-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 16rpx;
  cursor: pointer;
  transition: background 0.2s;
}

.clear-history-btn:active {
  background: #e8e8e8;
}

.clear-history-btn text {
  font-size: 28rpx;
  color: #999999;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
  background: #ffffff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 100rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 40rpx;
}

.modal-content {
  background: #ffffff;
  border-radius: 24rpx;
  width: 100%;
  max-width: 600rpx;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.close-btn {
  font-size: 48rpx;
  color: #999999;
  cursor: pointer;
  line-height: 1;
  padding: 0 10rpx;
}

/* 表单样式 */
.form-container {
  padding: 40rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 16rpx;
}

.form-input {
  width: 100%;
  padding: 24rpx;
  font-size: 28rpx;
  color: #333333;
  background: #f8f9fa;
  border: 2rpx solid #e8e8e8;
  border-radius: 16rpx;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #37CD87;
  background: #ffffff;
}

/* 弹窗底部 */
.modal-footer {
  display: flex;
  gap: 20rpx;
  padding: 40rpx;
  border-top: 2rpx solid #f0f0f0;
}

.modal-btn {
  flex: 1;
  padding: 24rpx;
  font-size: 28rpx;
  border-radius: 16rpx;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}

.modal-btn:active {
  transform: scale(0.98);
}

.cancel-btn {
  background: #f5f5f5;
  color: #666666;
}

.save-btn {
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  color: #ffffff;
}

.confirm-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #ffffff;
}

/* 确认弹窗样式 */
.confirm-modal {
  max-width: 550rpx;
}

.confirm-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  padding: 40rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.confirm-icon {
  font-size: 80rpx;
}

.confirm-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.confirm-message {
  padding: 40rpx;
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
}

.highlight {
  color: #37CD87;
  font-weight: bold;
}

.message-preview {
  margin-top: 20rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  border-left: 6rpx solid #f5576c;
  font-size: 26rpx;
  color: #333333;
  line-height: 1.6;
}
</style>
