# 🎨 Vant Weapp 组件使用示例

> HealthCare 项目中使用 Vant Weapp 的最佳实践和代码示例

**创建日期：** 2025-10-08  
**目标：** 提供完整的 Vant 组件使用指南

---

## 📋 目录

- [一、基础组件](#一基础组件)
- [二、表单组件](#二表单组件)
- [三、反馈组件](#三反馈组件)
- [四、展示组件](#四展示组件)
- [五、导航组件](#五导航组件)
- [六、业务场景示例](#六业务场景示例)

---

## 一、基础组件

### 1.1 Button 按钮

#### 基础用法

```vue
<template>
  <!-- 主要按钮 -->
  <van-button type="primary" block round>主要按钮</van-button>
  
  <!-- 成功按钮 -->
  <van-button type="success" round>成功按钮</van-button>
  
  <!-- 警告按钮 -->
  <van-button type="warning" round>警告按钮</van-button>
  
  <!-- 危险按钮 -->
  <van-button type="danger" round>危险按钮</van-button>
  
  <!-- 默认按钮 -->
  <van-button round>默认按钮</van-button>
  
  <!-- 朴素按钮 -->
  <van-button type="primary" plain round>朴素按钮</van-button>
</template>
```

#### 加载状态

```vue
<template>
  <van-button 
    type="primary" 
    :loading="loading"
    loading-text="加载中..."
    @click="handleClick"
  >
    提交
  </van-button>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)

const handleClick = async () => {
  loading.value = true
  try {
    // 模拟异步请求
    await new Promise(resolve => setTimeout(resolve, 2000))
    uni.showToast({ title: '提交成功', icon: 'success' })
  } finally {
    loading.value = false
  }
}
</script>
```

#### 图标按钮

```vue
<template>
  <!-- 使用 Vant Icon -->
  <van-button type="primary" icon="plus" round>
    添加病历
  </van-button>
  
  <!-- 只有图标 -->
  <van-button type="primary" icon="search" round />
</template>
```

---

### 1.2 Cell 单元格

#### 基础列表

```vue
<template>
  <van-cell-group>
    <van-cell title="姓名" value="张三" />
    <van-cell title="性别" value="男" />
    <van-cell title="年龄" value="35岁" />
    <van-cell title="电话" value="138****8888" />
  </van-cell-group>
</template>
```

#### 可点击的列表

```vue
<template>
  <van-cell-group>
    <van-cell 
      title="病历管理" 
      is-link 
      @click="goToRecords"
    />
    <van-cell 
      title="电子处方" 
      is-link 
      @click="goToPrescriptions"
    />
    <van-cell 
      title="健康趋势" 
      is-link 
      @click="goToTrends"
    />
  </van-cell-group>
</template>

<script setup>
const goToRecords = () => {
  uni.navigateTo({ url: '/pages/records/list' })
}

const goToPrescriptions = () => {
  uni.navigateTo({ url: '/pages/prescription/prescription' })
}

const goToTrends = () => {
  uni.navigateTo({ url: '/pages/trends/trends' })
}
</script>
```

#### 带图标和标签

```vue
<template>
  <van-cell-group>
    <van-cell title="血压检测" label="2024-10-08 09:30">
      <template #icon>
        <van-icon name="chart-trending-o" class="cell-icon" />
      </template>
      <template #right-icon>
        <van-tag type="success">正常</van-tag>
      </template>
    </van-cell>
    
    <van-cell title="心率监测" label="2024-10-08 09:35">
      <template #icon>
        <van-icon name="like-o" class="cell-icon" />
      </template>
      <template #right-icon>
        <van-tag type="warning">偏高</van-tag>
      </template>
    </van-cell>
  </van-cell-group>
</template>

<style scoped>
.cell-icon {
  margin-right: 16rpx;
  color: #3A8BD4;
  font-size: 32rpx;
}
</style>
```

---

### 1.3 Card 卡片

#### 商品卡片（改造为病历卡片）

```vue
<template>
  <van-card
    :thumb="record.image"
    :title="record.title"
    :desc="record.description"
    :price="record.date"
    currency=""
  >
    <template #tags>
      <van-tag type="primary" v-if="record.isNew">新</van-tag>
      <van-tag :type="getStatusType(record.status)">
        {{ record.status }}
      </van-tag>
    </template>
    
    <template #footer>
      <van-button size="small" round>查看详情</van-button>
      <van-button size="small" type="primary" round>
        下载报告
      </van-button>
    </template>
  </van-card>
</template>

<script setup>
defineProps({
  record: {
    type: Object,
    required: true
  }
})

const getStatusType = (status) => {
  const map = {
    '已完成': 'success',
    '进行中': 'primary',
    '待处理': 'warning'
  }
  return map[status] || 'default'
}
</script>
```

---

## 二、表单组件

### 2.1 Field 输入框

#### 登录表单

```vue
<template>
  <view class="login-form">
    <van-cell-group>
      <van-field
        v-model="formData.username"
        label="用户名"
        placeholder="请输入用户名"
        :border="false"
        clearable
        :rules="[{ required: true, message: '请输入用户名' }]"
      >
        <template #left-icon>
          <van-icon name="manager-o" />
        </template>
      </van-field>
      
      <van-field
        v-model="formData.password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        :border="false"
        clearable
        :rules="[{ required: true, message: '请输入密码' }]"
      >
        <template #left-icon>
          <van-icon name="lock" />
        </template>
      </van-field>
    </van-cell-group>
    
    <view class="login-actions">
      <van-button 
        type="primary" 
        block 
        round
        :loading="loading"
        @click="handleLogin"
      >
        登录
      </van-button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  username: '',
  password: ''
})

const loading = ref(false)

const handleLogin = async () => {
  if (!formData.value.username || !formData.value.password) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }
  
  loading.value = true
  try {
    // 模拟登录
    await new Promise(resolve => setTimeout(resolve, 1500))
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/home/home' })
    }, 1000)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-form {
  padding: 32rpx;
}

.login-actions {
  margin-top: 48rpx;
}
</style>
```

#### 搜索框

```vue
<template>
  <van-search
    v-model="searchText"
    placeholder="搜索病历、处方..."
    show-action
    @search="onSearch"
  >
    <template #action>
      <view @click="onSearch">搜索</view>
    </template>
  </van-search>
</template>

<script setup>
import { ref } from 'vue'

const searchText = ref('')

const onSearch = () => {
  console.log('搜索:', searchText.value)
  // 执行搜索逻辑
}
</script>
```

---

### 2.2 Checkbox & Radio

#### 复选框组

```vue
<template>
  <view class="symptom-selector">
    <view class="section-title">请选择症状</view>
    <van-checkbox-group v-model="selectedSymptoms">
      <van-cell-group>
        <van-cell
          v-for="symptom in symptoms"
          :key="symptom"
          clickable
          @click="toggle(symptom)"
        >
          <template #title>
            <van-checkbox :name="symptom" ref="checkboxes">
              {{ symptom }}
            </van-checkbox>
          </template>
        </van-cell>
      </van-cell-group>
    </van-checkbox-group>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const symptoms = ['头痛', '发热', '咳嗽', '乏力', '胸闷', '恶心']
const selectedSymptoms = ref(['头痛'])
const checkboxes = ref([])

const toggle = (name) => {
  const checkbox = checkboxes.value.find(item => item.name === name)
  if (checkbox) {
    checkbox.toggle()
  }
}
</script>
```

#### 单选框组

```vue
<template>
  <view class="gender-selector">
    <view class="section-title">性别</view>
    <van-radio-group v-model="gender">
      <van-cell-group>
        <van-cell title="男" clickable @click="gender = 'male'">
          <template #right-icon>
            <van-radio name="male" />
          </template>
        </van-cell>
        <van-cell title="女" clickable @click="gender = 'female'">
          <template #right-icon>
            <van-radio name="female" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const gender = ref('male')
</script>
```

---

## 三、反馈组件

### 3.1 Toast 轻提示

```vue
<script setup>
// 成功提示
const showSuccess = () => {
  uni.showToast({
    title: '操作成功',
    icon: 'success',
    duration: 2000
  })
}

// 失败提示
const showError = () => {
  uni.showToast({
    title: '操作失败',
    icon: 'error',
    duration: 2000
  })
}

// 加载提示
const showLoading = () => {
  uni.showLoading({
    title: '加载中...',
    mask: true
  })
  
  setTimeout(() => {
    uni.hideLoading()
  }, 2000)
}

// 纯文本提示
const showText = () => {
  uni.showToast({
    title: '这是一条提示信息',
    icon: 'none',
    duration: 2000
  })
}
</script>
```

### 3.2 Dialog 对话框

```vue
<template>
  <van-button type="primary" @click="showDialog">删除病历</van-button>
</template>

<script setup>
const showDialog = () => {
  uni.showModal({
    title: '确认删除',
    content: '删除后数据将无法恢复，确定要删除这条病历吗？',
    confirmText: '删除',
    confirmColor: '#FF4D4F',
    success: (res) => {
      if (res.confirm) {
        // 执行删除操作
        deleteRecord()
      }
    }
  })
}

const deleteRecord = () => {
  uni.showToast({ title: '删除成功', icon: 'success' })
}
</script>
```

### 3.3 ActionSheet 动作面板

```vue
<template>
  <van-button @click="showActionSheet">更多操作</van-button>
  
  <van-action-sheet
    v-model:show="show"
    :actions="actions"
    @select="onSelect"
    cancel-text="取消"
  />
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
const actions = [
  { name: '查看详情', color: '#3A8BD4' },
  { name: '下载报告' },
  { name: '分享给医生' },
  { name: '删除', color: '#FF4D4F' }
]

const showActionSheet = () => {
  show.value = true
}

const onSelect = (action) => {
  console.log('选择了:', action.name)
  show.value = false
}
</script>
```

---

## 四、展示组件

### 4.1 Tag 标签

```vue
<template>
  <view class="tags">
    <!-- 不同类型 -->
    <van-tag type="primary">主要</van-tag>
    <van-tag type="success">成功</van-tag>
    <van-tag type="warning">警告</van-tag>
    <van-tag type="danger">危险</van-tag>
    
    <!-- 朴素标签 -->
    <van-tag plain type="primary">朴素标签</van-tag>
    
    <!-- 圆角标签 -->
    <van-tag round type="primary">圆角标签</van-tag>
    
    <!-- 标记标签 -->
    <van-tag mark type="primary">标记</van-tag>
    
    <!-- 可关闭标签 -->
    <van-tag closeable type="primary" @close="onClose">
      可关闭
    </van-tag>
  </view>
</template>

<script setup>
const onClose = () => {
  console.log('标签已关闭')
}
</script>

<style scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 32rpx;
}
</style>
```

### 4.2 Progress 进度条

```vue
<template>
  <view class="progress-demo">
    <view class="item">
      <text class="label">健康评分</text>
      <van-progress 
        :percentage="85" 
        stroke-width="8"
        color="#3A8BD4"
      />
    </view>
    
    <view class="item">
      <text class="label">用药依从性</text>
      <van-progress 
        :percentage="92" 
        stroke-width="8"
        color="#52C41A"
      />
    </view>
    
    <view class="item">
      <text class="label">运动目标</text>
      <van-progress 
        :percentage="65" 
        stroke-width="8"
        color="#FAAD14"
      />
    </view>
  </view>
</template>

<style scoped>
.progress-demo {
  padding: 32rpx;
}

.item {
  margin-bottom: 32rpx;
}

.label {
  display: block;
  margin-bottom: 16rpx;
  color: #666666;
  font-size: 28rpx;
}
</style>
```

### 4.3 Badge 徽标

```vue
<template>
  <view class="badge-demo">
    <!-- 数字徽标 -->
    <van-badge :content="5">
      <van-button size="small">消息</van-button>
    </van-badge>
    
    <!-- 圆点徽标 -->
    <van-badge dot>
      <van-button size="small">通知</van-button>
    </van-badge>
    
    <!-- 最大值 -->
    <van-badge :content="100" max="99">
      <van-button size="small">待办</van-button>
    </van-badge>
  </view>
</template>

<style scoped>
.badge-demo {
  display: flex;
  gap: 32rpx;
  padding: 32rpx;
}
</style>
```

---

## 五、导航组件

### 5.1 Tabbar 底部导航栏

```vue
<template>
  <van-tabbar v-model="active" :fixed="false" :placeholder="false">
    <van-tabbar-item icon="wap-home-o" to="/pages/home/home">
      首页
    </van-tabbar-item>
    <van-tabbar-item icon="records" to="/pages/records/list">
      病历
    </van-tabbar-item>
    <van-tabbar-item icon="chat-o" to="/pages/chatbot/chat">
      咨询
    </van-tabbar-item>
    <van-tabbar-item icon="user-o" to="/pages/my/my">
      我的
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref } from 'vue'

const active = ref(0)
</script>
```

### 5.2 Tab 标签页

```vue
<template>
  <van-tabs v-model:active="activeTab" color="#3A8BD4">
    <van-tab title="全部病历">
      <view class="tab-content">全部病历内容</view>
    </van-tab>
    <van-tab title="待处理">
      <view class="tab-content">待处理内容</view>
    </van-tab>
    <van-tab title="已完成">
      <view class="tab-content">已完成内容</view>
    </van-tab>
  </van-tabs>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref(0)
</script>

<style scoped>
.tab-content {
  padding: 32rpx;
  min-height: 400rpx;
}
</style>
```

---

## 六、业务场景示例

### 6.1 病历列表页

```vue
<template>
  <view class="records-page">
    <!-- 搜索栏 -->
    <van-search
      v-model="searchText"
      placeholder="搜索病历"
      @search="onSearch"
    />
    
    <!-- Tab 切换 -->
    <van-tabs v-model:active="activeTab" color="#3A8BD4">
      <van-tab title="全部" />
      <van-tab title="待处理" />
      <van-tab title="已完成" />
    </van-tabs>
    
    <!-- 病历列表 -->
    <van-cell-group>
      <van-cell
        v-for="record in filteredRecords"
        :key="record.id"
        :title="record.title"
        :label="record.date"
        is-link
        @click="goToDetail(record.id)"
      >
        <template #icon>
          <van-icon name="description" class="record-icon" />
        </template>
        <template #right-icon>
          <van-tag :type="getTagType(record.status)">
            {{ record.status }}
          </van-tag>
        </template>
      </van-cell>
    </van-cell-group>
    
    <!-- 空状态 -->
    <van-empty
      v-if="filteredRecords.length === 0"
      description="暂无病历记录"
    />
    
    <!-- 添加按钮 -->
    <view class="add-btn">
      <van-button 
        type="primary" 
        icon="plus" 
        round 
        block
        @click="addRecord"
      >
        添加病历
      </van-button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchText = ref('')
const activeTab = ref(0)
const records = ref([
  { id: 1, title: '常规体检', date: '2024-10-01', status: '已完成' },
  { id: 2, title: '血压检测', date: '2024-10-05', status: '待处理' },
  { id: 3, title: '心电图检查', date: '2024-10-08', status: '进行中' }
])

const filteredRecords = computed(() => {
  let result = records.value
  
  // 根据搜索文本筛选
  if (searchText.value) {
    result = result.filter(r => 
      r.title.includes(searchText.value)
    )
  }
  
  // 根据 Tab 筛选
  if (activeTab.value === 1) {
    result = result.filter(r => r.status === '待处理')
  } else if (activeTab.value === 2) {
    result = result.filter(r => r.status === '已完成')
  }
  
  return result
})

const getTagType = (status) => {
  const map = {
    '已完成': 'success',
    '进行中': 'primary',
    '待处理': 'warning'
  }
  return map[status] || 'default'
}

const onSearch = () => {
  console.log('搜索:', searchText.value)
}

const goToDetail = (id) => {
  uni.navigateTo({ url: `/pages/records/detail?id=${id}` })
}

const addRecord = () => {
  uni.navigateTo({ url: '/pages/upload/upload' })
}
</script>

<style scoped>
.records-page {
  min-height: 100vh;
  background: #F8F9FA;
}

.record-icon {
  margin-right: 16rpx;
  color: #3A8BD4;
  font-size: 32rpx;
}

.add-btn {
  position: fixed;
  bottom: 32rpx;
  left: 32rpx;
  right: 32rpx;
}
</style>
```

### 6.2 个人中心页

```vue
<template>
  <view class="my-page">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <van-cell-group>
        <van-cell center>
          <template #icon>
            <image 
              class="avatar" 
              src="/static/avatar.png" 
              mode="aspectFill"
            />
          </template>
          <template #title>
            <view class="user-info">
              <text class="username">张三</text>
              <van-tag type="primary" size="small">患者</van-tag>
            </view>
          </template>
          <template #label>
            <text class="user-id">ID: 123456</text>
          </template>
        </van-cell>
      </van-cell-group>
    </view>
    
    <!-- 功能列表 -->
    <van-cell-group title="我的服务">
      <van-cell 
        title="我的病历" 
        is-link 
        icon="records"
        @click="navigate('/pages/records/list')"
      />
      <van-cell 
        title="电子处方" 
        is-link 
        icon="description"
        @click="navigate('/pages/prescription/prescription')"
      />
      <van-cell 
        title="健康趋势" 
        is-link 
        icon="chart-trending-o"
        @click="navigate('/pages/trends/trends')"
      />
    </van-cell-group>
    
    <van-cell-group title="设置">
      <van-cell 
        title="个人信息" 
        is-link 
        icon="manager-o"
      />
      <van-cell 
        title="隐私设置" 
        is-link 
        icon="lock"
      />
      <van-cell 
        title="关于我们" 
        is-link 
        icon="info-o"
      />
    </van-cell-group>
    
    <!-- 退出登录 -->
    <view class="logout-btn">
      <van-button 
        type="danger" 
        plain 
        round 
        block
        @click="logout"
      >
        退出登录
      </van-button>
    </view>
  </view>
</template>

<script setup>
const navigate = (url) => {
  uni.navigateTo({ url })
}

const logout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.reLaunch({ url: '/pages/login/login' })
      }
    }
  })
}
</script>

<style scoped>
.my-page {
  min-height: 100vh;
  background: #F8F9FA;
  padding-bottom: 32rpx;
}

.user-card {
  margin-bottom: 24rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 24rpx;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.username {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.user-id {
  font-size: 24rpx;
  color: #999999;
}

.logout-btn {
  margin: 48rpx 32rpx 32rpx;
}
</style>
```

---

## 📚 参考资源

- [Vant Weapp 官方文档](https://vant.pro/vant-weapp/)
- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [HealthCare 项目 UI 设计指南](./UI_DESIGN_GUIDE.md)

---

**最后更新：** 2025-10-08  
**文档版本：** v1.0  
**维护者：** HealthCare Team


