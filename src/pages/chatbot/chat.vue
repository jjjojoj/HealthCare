<template>
  <view class="page">
    <AppHeader title="智能咨询" />

    <view class="chat-container">
      <scroll-view scroll-y class="chat-content" :scroll-top="scrollTop" scroll-with-animation>
        <view v-for="(msg, index) in messages" :key="index"
              :class="msg.type === 'user' ? 'msg-user' : 'msg-bot'">
          <view class="msg-bubble">{{ msg.content }}</view>
        </view>
      </scroll-view>

      <view class="chat-input">
        <input v-model="inputText" placeholder="输入您的问题..." @confirm="sendMessage" />
        <button @click="sendMessage" size="mini" class="send-btn">发送</button>
      </view>
    </view>

    <BottomNav />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'

const messages = ref([
  { type: 'bot', content: '您好，我是智能医疗助手，请问有什么可以帮您？' }
])
const inputText = ref('')
const scrollTop = ref(0)

const responses = [
  '根据您的症状，建议您注意休息，多喝水。',
  '这种情况建议您咨询专业医生。',
  '您可以查看病历记录了解详细信息。',
  '建议定期监测相关指标。'
]

const sendMessage = () => {
  if (!inputText.value.trim()) return

  messages.value.push({ type: 'user', content: inputText.value })
  const userMsg = inputText.value
  inputText.value = ''

  setTimeout(() => {
    const response = responses[Math.floor(Math.random() * responses.length)]
    messages.value.push({ type: 'bot', content: response })
    scrollTop.value = 9999
  }, 500)
}
</script>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
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
  padding: 20rpx;
}

.msg-user, .msg-bot {
  margin-bottom: 20rpx;
  display: flex;
}

.msg-user {
  justify-content: flex-end;
}

.msg-bot {
  justify-content: flex-start;
}

.msg-bubble {
  max-width: 70%;
  padding: 20rpx 25rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  line-height: 1.5;
}

.msg-user .msg-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4rpx;
}

.msg-bot .msg-bubble {
  background: white;
  color: #333;
  border-bottom-left-radius: 4rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.chat-input {
  display: flex;
  padding: 20rpx;
  background: white;
  border-top: 1px solid #eee;
  align-items: center;
}

.chat-input input {
  flex: 1;
  height: 70rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 35rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  margin-right: 20rpx;
}

.send-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  height: 70rpx;
  line-height: 70rpx;
  padding: 0 30rpx;
  border-radius: 35rpx;
  font-size: 28rpx;
}
</style>
