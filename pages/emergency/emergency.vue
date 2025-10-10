<template>
  <view class="container">
    <view class="card">
      <view class="title">紧急联系人</view>
      <view v-for="(contact, index) in contacts" :key="index" class="list-item">
        <view style="display: flex; justify-content: space-between; align-items: center;">
          <view>
            <view style="font-weight: bold; font-size: 32rpx;">{{ contact.name }}</view>
            <view style="color: #666; font-size: 28rpx; margin-top: 5rpx;">{{ contact.relation }}</view>
            <view style="color: #666; font-size: 28rpx; margin-top: 5rpx;">{{ contact.phone }}</view>
          </view>
          <button @click="callContact(contact.phone)" size="mini" type="primary">拨打</button>
        </view>
      </view>
      <button class="btn btn-secondary" style="margin-top: 30rpx;" @click="addContact">添加联系人</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const contacts = ref([
  { name: '李四', relation: '配偶', phone: '13900139000' },
  { name: '王五', relation: '子女', phone: '13900139001' }
])

const callContact = (phone) => {
  uni.makePhoneCall({ phoneNumber: phone })
}

const addContact = () => {
  uni.showToast({ title: '添加联系人功能演示', icon: 'none' })
}
</script>
