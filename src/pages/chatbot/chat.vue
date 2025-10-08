<template>
  <view class="container" style="display: flex; flex-direction: column; height: calc(100vh - 88rpx);">
    <scroll-view scroll-y class="chat-content" :scroll-top="scrollTop" scroll-with-animation>
      <view v-for="(msg, index) in messages" :key="index"
            :class="msg.type === 'user' ? 'msg-user' : 'msg-bot'">
        <view class="msg-bubble">{{ msg.content }}</view>
      </view>
    </scroll-view>
    <view class="chat-input">
      <input v-model="inputText" placeholder="输入您的问题..." @confirm="sendMessage" />
      <button @click="sendMessage" size="mini">发送</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

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
  padding: 20rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
}

.msg-user .msg-bubble {
  background: #007aff;
  color: white;
}

.msg-bot .msg-bubble {
  background: white;
  color: #333;
}

.chat-input {
  display: flex;
  padding: 20rpx;
  background: white;
  border-top: 1px solid #eee;
}

.chat-input input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 10rpx 20rpx;
  margin-right: 20rpx;
}
</style>
