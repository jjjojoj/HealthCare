<template>
    <view class="container">
      <!-- 页面头部 -->
      <AppHeader title="视频会诊" :show-back="true" />
      
      <!-- 演示模式横幅 -->
      <view class="demo-banner">
        <text class="demo-banner-text">⚠️ 演示模式：视频会诊功能仅为演示，不支持真实音视频通话。</text>
      </view>

      <!-- 主要内容 -->
    <view class="content">
      <!-- WebRTC 技术说明卡片 -->
      <view class="info-card">
        <view class="info-title">
          <text class="info-icon">ℹ️</text>
          <text>WebRTC 技术说明</text>
        </view>
        <view class="info-content">
          <text class="info-text">真实的视频会诊系统需要以下技术支持：</text>
          <view class="tech-list">
            <text class="tech-item">• STUN/TURN 服务器：用于 NAT 穿透和中继</text>
            <text class="tech-item">• SFU (Selective Forwarding Unit)：多方通话支持</text>
            <text class="tech-item">• 用户身份验证和权限管理</text>
            <text class="tech-item">• 录制功能需要用户明确同意</text>
            <text class="tech-item">• 端到端加密保护隐私数据</text>
          </view>
        </view>
      </view>

      <!-- 会诊功能卡片 -->
      <view class="function-card">
        <view class="card-title">视频会诊服务</view>
        
        <!-- 当前用户信息 -->
        <view class="user-info" v-if="currentUser">
          <text class="user-label">当前用户：</text>
          <text class="user-name">{{ currentUser.name }}</text>
          <text class="user-role" :class="currentUser.role === 'clinician' ? 'role-doctor' : 'role-patient'">
            {{ currentUser.role === 'clinician' ? '医生' : '患者' }}
          </text>
        </view>

        <!-- 功能按钮 -->
        <view class="button-group">
          <button 
            class="action-btn primary-btn" 
            @click="handleCreateRoom"
          >
            <text class="btn-icon">📹</text>
            <text>发起会诊</text>
          </button>
          
          <button 
            class="action-btn secondary-btn" 
            @click="handleJoinRoom"
          >
            <text class="btn-icon">🔗</text>
            <text>加入会诊</text>
          </button>
        </view>

        <!-- 演示提示 -->
        <view class="permission-notice demo-notice">
          <text class="notice-icon">💡</text>
          <text class="notice-text">演示模式下所有用户均可体验发起会诊功能，不会产生真实通话</text>
        </view>

        <!-- 房间信息展示 -->
        <view class="room-info" v-if="roomInfo.id">
          <view class="room-header">
            <text class="room-title">会诊房间已创建</text>
            <text class="room-demo-badge">演示</text>
            <text class="room-status">● 等待中</text>
          </view>
          
          <view class="room-details">
            <view class="room-item">
              <text class="room-label">房间ID：</text>
              <text class="room-value">{{ roomInfo.id }}</text>
            </view>
            
            <view class="room-item">
              <text class="room-label">创建时间：</text>
              <text class="room-value">{{ roomInfo.createTime }}</text>
            </view>
            
            <view class="room-item">
              <text class="room-label">房间链接：</text>
              <view class="link-container">
                <text class="room-link">{{ roomInfo.link }}</text>
                <button class="copy-btn" @click="copyRoomLink">
                  <text class="copy-icon">📋</text>
                  <text>复制</text>
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 会诊历史 -->
      <view class="history-card" v-if="consultationHistory.length > 0">
        <view class="card-title">最近会诊记录</view>
        <view class="history-list">
          <view 
            class="history-item" 
            v-for="item in consultationHistory" 
            :key="item.id"
          >
            <view class="history-info">
              <text class="history-title">{{ item.title }}</text>
              <text class="history-time">{{ item.time }}</text>
            </view>
            <text class="history-status" :class="item.status">
              {{ getStatusText(item.status) }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 加入会诊对话框 -->
    <view class="modal-overlay" v-if="showJoinModal" @click="closeJoinModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">加入会诊</text>
          <text class="modal-close" @click="closeJoinModal">✕</text>
        </view>
        
        <view class="modal-body">
          <view class="input-group">
            <text class="input-label">请输入房间ID或链接：</text>
            <input 
              class="room-input" 
              v-model="joinRoomId" 
              placeholder="输入房间ID（如：ROOM-ABC123）"
              maxlength="20"
            />
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="modal-btn cancel-btn" @click="closeJoinModal">取消</button>
          <button class="modal-btn confirm-btn" @click="confirmJoinRoom">加入</button>
        </view>
      </view>
    </view>

    <!-- 底部导航 -->
    <BottomNav />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import { useAuthGuard } from '@/composables/useAuthGuard'

useAuthGuard()

// 响应式数据
const currentUser = ref(null)
const showJoinModal = ref(false)
const joinRoomId = ref('')
const roomInfo = ref({
  id: '',
  createTime: '',
  link: ''
})

// 模拟会诊历史数据
const consultationHistory = ref([
  {
    id: 1,
    title: '心内科会诊 - 张三',
    time: '2025-10-07 15:30',
    status: 'completed'
  },
  {
    id: 2,
    title: '内分泌科会诊 - 李四',
    time: '2025-10-06 10:15',
    status: 'cancelled'
  }
])

// 计算属性
const canCreateRoom = computed(() => {
  return currentUser.value && currentUser.value.role === 'clinician'
})

// 生成房间ID
const generateRoomId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'ROOM-'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 格式化时间
const formatTime = (date) => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'completed': '已完成',
    'cancelled': '已取消',
    'ongoing': '进行中',
    'waiting': '等待中'
  }
  return statusMap[status] || '未知'
}

// 发起会诊
const handleCreateRoom = () => {
  // 生成房间信息（演示模式，所有用户都可以创建）
  const roomId = generateRoomId()
  const createTime = formatTime(new Date())
  const link = `https://healthcare.example.com/video/join?room=${roomId}`

  roomInfo.value = {
    id: roomId,
    createTime: createTime,
    link: link,
    isDemo: true
  }

  // 模拟添加到历史记录
  consultationHistory.value.unshift({
    id: Date.now(),
    title: `新建会诊 - ${currentUser.value ? currentUser.value.name : '演示用户'}`,
    time: createTime,
    status: 'waiting'
  })

  uni.showModal({
    title: '🎬 演示会诊已创建',
    content: `演示会诊已创建，实际功能开发中。\n\n房间ID：${roomId}\n\n此为演示模拟，不会建立真实音视频连接。`,
    showCancel: false,
    confirmText: '我知道了',
    confirmColor: '#37CD87'
  })
}

// 加入会诊
const handleJoinRoom = () => {
  showJoinModal.value = true
}

// 关闭加入对话框
const closeJoinModal = () => {
  showJoinModal.value = false
  joinRoomId.value = ''
}

// 确认加入房间
const confirmJoinRoom = () => {
  if (!joinRoomId.value.trim()) {
    uni.showToast({
      title: '请输入房间ID',
      icon: 'none',
      duration: 2000
    })
    return
  }

  // 模拟加入房间逻辑
  uni.showToast({
    title: `正在加入房间 ${joinRoomId.value}`,
    icon: 'loading',
    duration: 2000
  })

  setTimeout(() => {
    uni.showToast({
      title: '加入成功（模拟）',
      icon: 'success',
      duration: 2000
    })
    closeJoinModal()
  }, 2000)
}

// 复制房间链接
const copyRoomLink = () => {
  // 在真实环境中，这里会使用 uni.setClipboardData
  // 但在演示中我们只显示提示
  uni.showToast({
    title: '链接已复制到剪贴板',
    icon: 'success',
    duration: 2000
  })
  
  // 模拟复制到剪贴板（实际项目中取消注释）
  // uni.setClipboardData({
  //   data: roomInfo.value.link,
  //   success: () => {
  //     uni.showToast({
  //       title: '链接已复制',
  //       icon: 'success'
  //     })
  //   }
  // })
}

// 加载用户数据
const loadUserData = async () => {
  try {
    // 获取当前登录用户ID
    const currentUserId = uni.getStorageSync('currentUserId') || 1
    
    // 加载用户数据
    const response = await uni.request({
      url: '/static/mock/users.json',
      method: 'GET'
    })
    
    if (response.data && response.data.users) {
      const user = response.data.users.find(u => u.id === currentUserId)
      if (user) {
        currentUser.value = user
      }
    }
  } catch (error) {
    console.error('加载用户数据失败:', error)
    uni.showToast({
      title: '加载用户数据失败',
      icon: 'none'
    })
  }
}

// 页面加载时初始化
onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
}

.demo-banner {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  padding: 20rpx 32rpx;
  margin: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(243, 156, 18, 0.4);
}

.demo-banner-text {
  font-size: 26rpx;
  color: #ffffff;
  text-align: center;
  line-height: 1.6;
  font-weight: 600;
}

.content {
  padding: 20rpx;
  padding-bottom: 120rpx;
}

/* 信息卡片样式 */
.info-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.info-title {
  display: flex;
  align-items: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.info-icon {
  font-size: 36rpx;
  margin-right: 15rpx;
}

.info-content {
  color: #666;
}

.info-text {
  font-size: 28rpx;
  line-height: 1.6;
  margin-bottom: 20rpx;
  display: block;
}

.tech-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.tech-item {
  font-size: 26rpx;
  line-height: 1.5;
  color: #555;
  padding-left: 20rpx;
}

/* 功能卡片样式 */
.function-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  text-align: center;
}

/* 用户信息样式 */
.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
  padding: 20rpx;
  background: #f8f9ff;
  border-radius: 15rpx;
}

.user-label {
  font-size: 28rpx;
  color: #666;
  margin-right: 10rpx;
}

.user-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-right: 15rpx;
}

.user-role {
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  color: white;
}

.role-doctor {
  background: linear-gradient(45deg, #4CAF50, #45a049);
}

.role-patient {
  background: linear-gradient(45deg, #2196F3, #1976D2);
}

/* 按钮组样式 */
.button-group {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.action-btn {
  flex: 1;
  height: 100rpx;
  border-radius: 15rpx;
  border: none;
  font-size: 30rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  transition: all 0.3s ease;
}

.primary-btn {
  background: linear-gradient(45deg, #37CD87, #2DB873);
  color: white;
}

.primary-btn:not(:disabled):active {
  transform: scale(0.98);
  opacity: 0.9;
}

.primary-btn:disabled {
  background: #ccc;
  color: #999;
}

.secondary-btn {
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
}

.secondary-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.btn-icon {
  font-size: 32rpx;
}

/* 权限提示样式 */
.permission-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  background: #fff3cd;
  border: 2rpx solid #ffeaa7;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
}

.notice-icon {
  font-size: 32rpx;
  margin-right: 10rpx;
}

.notice-text {
  font-size: 28rpx;
  color: #856404;
}

.demo-notice {
  background: #e8f8f0;
  border-color: #b7ebde;
}

.demo-notice .notice-text {
  color: #389e0d;
}

/* 房间信息样式 */
.room-info {
  background: #f0f8ff;
  border-radius: 15rpx;
  padding: 25rpx;
  border: 2rpx solid #e3f2fd;
}

.room-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.room-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1976D2;
}

.room-status {
  font-size: 24rpx;
  color: #4CAF50;
}

.room-demo-badge {
  font-size: 22rpx;
  color: #ffffff;
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  font-weight: 600;
}

.room-details {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.room-item {
  display: flex;
  align-items: center;
}

.room-label {
  font-size: 28rpx;
  color: #666;
  min-width: 140rpx;
}

.room-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.link-container {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 15rpx;
}

.room-link {
  font-size: 24rpx;
  color: #1976D2;
  flex: 1;
  word-break: break-all;
}

.copy-btn {
  padding: 10rpx 20rpx;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  gap: 5rpx;
}

.copy-icon {
  font-size: 26rpx;
}

/* 历史记录样式 */
.history-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 10rpx;
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.history-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.history-time {
  font-size: 24rpx;
  color: #999;
}

.history-status {
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  color: white;
}

.history-status.completed {
  background: #4CAF50;
}

.history-status.cancelled {
  background: #f44336;
}

.history-status.ongoing {
  background: #FF9800;
}

.history-status.waiting {
  background: #2196F3;
}

/* 模态框样式 */
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
}

.modal-content {
  background: white;
  border-radius: 20rpx;
  width: 90%;
  max-width: 600rpx;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 2rpx solid #eee;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.modal-close {
  font-size: 36rpx;
  color: #999;
  cursor: pointer;
}

.modal-body {
  padding: 30rpx;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.input-label {
  font-size: 28rpx;
  color: #333;
}

.room-input {
  padding: 20rpx;
  border: 2rpx solid #ddd;
  border-radius: 10rpx;
  font-size: 28rpx;
  background: #f9f9f9;
}

.room-input:focus {
  border-color: #37CD87;
  background: white;
}

.modal-footer {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 2rpx solid #eee;
}

.modal-btn {
  flex: 1;
  height: 80rpx;
  border: none;
  border-radius: 10rpx;
  font-size: 28rpx;
  font-weight: bold;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.confirm-btn {
  background: linear-gradient(45deg, #37CD87, #2DB873);
  color: white;
}

.modal-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}
</style>