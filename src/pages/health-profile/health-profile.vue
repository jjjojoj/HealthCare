<template>
  <view class="page">
    <AppHeader title="个人健康档案" :show-back="true" />

    <scroll-view scroll-y class="content">
      <!-- 基本信息 -->
      <view class="section">
        <view class="section-title">基本信息</view>
        <view class="card">
          <view class="form-row">
            <view class="form-item half">
              <view class="form-label">身高 (cm)</view>
              <input class="form-input" type="number" v-model="form.height" placeholder="请输入身高" />
            </view>
            <view class="form-item half">
              <view class="form-label">体重 (kg)</view>
              <input class="form-input" type="number" v-model="form.weight" placeholder="请输入体重" />
            </view>
          </view>
          <view class="form-row">
            <view class="form-item half">
              <view class="form-label">血型</view>
              <picker @change="onBloodTypeChange" :value="bloodTypeIndex" :range="bloodTypes">
                <view class="form-input picker-value">
                  <text>{{ bloodTypes[bloodTypeIndex] || '请选择' }}</text>
                  <text class="picker-arrow">/</text>
                </view>
              </picker>
            </view>
            <view class="form-item half">
              <view class="form-label">出生日期</view>
              <picker mode="date" @change="onBirthdayChange" :value="form.birthday">
                <view class="form-input picker-value">
                  <text>{{ form.birthday || '请选择' }}</text>
                  <text class="picker-arrow">/</text>
                </view>
              </picker>
            </view>
          </view>
        </view>
      </view>

      <!-- 过敏史 -->
      <view class="section">
        <view class="section-title">过敏史</view>
        <view class="card">
          <view class="tag-list" v-if="form.allergies.length > 0">
            <view class="tag" v-for="(item, index) in form.allergies" :key="index">
              <text class="tag-text">{{ item }}</text>
              <text class="tag-remove" @click="removeTag('allergies', index)">x</text>
            </view>
          </view>
          <view class="tag-input-row">
            <input class="tag-input" v-model="newAllergy" placeholder="输入过敏源，回车添加" @confirm="addTag('allergies', newAllergy, 'newAllergy')" />
          </view>
        </view>
      </view>

      <!-- 既往病史 -->
      <view class="section">
        <view class="section-title">既往病史</view>
        <view class="card">
          <view class="tag-list" v-if="form.pastDiseases.length > 0">
            <view class="tag tag-orange" v-for="(item, index) in form.pastDiseases" :key="index">
              <text class="tag-text">{{ item }}</text>
              <text class="tag-remove" @click="removeTag('pastDiseases', index)">x</text>
            </view>
          </view>
          <view class="tag-input-row">
            <input class="tag-input" v-model="newDisease" placeholder="输入病史，回车添加" @confirm="addTag('pastDiseases', newDisease, 'newDisease')" />
          </view>
        </view>
      </view>

      <!-- 家族病史 -->
      <view class="section">
        <view class="section-title">家族病史</view>
        <view class="card">
          <view class="family-item" v-for="(item, index) in form.familyHistory" :key="index">
            <view class="family-left">
              <picker @change="onRelationChange($event, index)" :value="item.relationIndex" :range="relations">
                <view class="relation-btn">
                  <text>{{ relations[item.relationIndex] }}</text>
                  <text class="picker-arrow">/</text>
                </view>
              </picker>
              <text class="family-disease">{{ item.disease }}</text>
            </view>
            <text class="tag-remove" @click="removeFamily(index)">x</text>
          </view>
          <view class="tag-input-row">
            <picker @change="onNewRelationChange" :value="newRelationIndex" :range="relations">
              <view class="tag-input half-input">
                <text>{{ relations[newRelationIndex] || '选择关系' }}</text>
              </view>
            </picker>
            <input class="tag-input half-input" v-model="newFamilyDisease" placeholder="疾病名称" @confirm="addFamilyHistory()" />
          </view>
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="submit-section">
        <view class="submit-btn" @click="saveProfile">
          <text class="submit-btn-text">保存档案</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const bloodTypes = ['A型', 'B型', 'O型', 'AB型', 'Rh阳性', 'Rh阴性', '不详']
const bloodTypeIndex = ref(0)
const relations = ['父亲', '母亲', '兄弟姐妹', '祖父', '祖母', '其他']
const newRelationIndex = ref(0)

const form = ref({
  height: '175',
  weight: '70',
  bloodType: 'A型',
  birthday: '1990-01-01',
  allergies: ['青霉素', '花粉'],
  pastDiseases: [],
  familyHistory: [
    { relationIndex: 1, relation: '母亲', disease: '高血压' }
  ]
})

const newAllergy = ref('')
const newDisease = ref('')
const newFamilyDisease = ref('')

onMounted(() => {
  const saved = uni.getStorageSync('healthcare_health_profile')
  if (saved) {
    form.value = { ...form.value, ...JSON.parse(saved) }
  }
})

function onBloodTypeChange(e) {
  bloodTypeIndex.value = e.detail.value
  form.value.bloodType = bloodTypes[e.detail.value]
}

function onBirthdayChange(e) {
  form.value.birthday = e.detail.value
}

function addTag(field, value, refKey) {
  if (!value || !value.trim()) return
  if (!form.value[field].includes(value.trim())) {
    form.value[field].push(value.trim())
  }
  if (refKey === 'newAllergy') newAllergy.value = ''
  if (refKey === 'newDisease') newDisease.value = ''
}

function removeTag(field, index) {
  form.value[field].splice(index, 1)
}

function onRelationChange(e, index) {
  form.value.familyHistory[index].relationIndex = e.detail.value
  form.value.familyHistory[index].relation = relations[e.detail.value]
}

function onNewRelationChange(e) {
  newRelationIndex.value = e.detail.value
}

function addFamilyHistory() {
  if (!newFamilyDisease.value.trim()) return
  form.value.familyHistory.push({
    relationIndex: newRelationIndex.value,
    relation: relations[newRelationIndex.value],
    disease: newFamilyDisease.value.trim()
  })
  newFamilyDisease.value = ''
}

function removeFamily(index) {
  form.value.familyHistory.splice(index, 1)
}

function saveProfile() {
  uni.setStorageSync('healthcare_health_profile', JSON.stringify(form.value))
  uni.showToast({ title: '保存成功', icon: 'success' })
  setTimeout(() => uni.navigateBack(), 1000)
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #F5F5F5;
}

.content {
  padding: 24rpx 32rpx;
  padding-bottom: 160rpx;
}

.section {
  margin-bottom: 32rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16rpx;
  padding-left: 8rpx;
}

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx;
}

.form-row {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;

  &:last-child { margin-bottom: 0; }
}

.form-item {
  flex: 1;

  &.half { flex: 1; }
}

.form-label {
  font-size: 26rpx;
  color: #8C8C8C;
  margin-bottom: 12rpx;
}

.form-input {
  height: 76rpx;
  background: #F5F5F5;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: #262626;
  display: flex;
  align-items: center;
}

.picker-value {
  justify-content: space-between;
}

.picker-arrow {
  color: #C0C0C0;
  font-size: 28rpx;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.tag {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 10rpx 20rpx;
  background: #E8F8EF;
  border-radius: 24rpx;

  &.tag-orange {
    background: #FFF4E6;
  }
}

.tag-text {
  font-size: 26rpx;
  color: #262626;
}

.tag-remove {
  font-size: 24rpx;
  color: #C0C0C0;
  padding: 4rpx;
}

.tag-input-row {
  display: flex;
  gap: 16rpx;
}

.tag-input {
  flex: 1;
  height: 72rpx;
  background: #F5F5F5;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 26rpx;
  color: #262626;

  &.half-input { flex: 1; }
}

.family-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #F0F0F0;

  &:last-child { border-bottom: none; }
}

.family-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.relation-btn {
  padding: 8rpx 20rpx;
  background: #E8F8EF;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #37CD87;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.family-disease {
  font-size: 28rpx;
  color: #262626;
}

.submit-section {
  padding: 24rpx 0;
}

.submit-btn {
  height: 96rpx;
  background: linear-gradient(135deg, #37CD87, #2DB873);
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(55, 205, 135, 0.3);
}

.submit-btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
  letter-spacing: 4rpx;
}
</style>
