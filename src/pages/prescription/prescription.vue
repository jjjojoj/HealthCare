<template>
  <view class="container">
    <AppHeader title="电子处方" :show-back="true" />
    
    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <view class="loading-text">加载中...</view>
    </view>
    
    <!-- 错误状态 -->
    <view v-else-if="error" class="error">
      <view class="error-text">{{ error }}</view>
      <button class="btn-secondary" @click="goBack">返回</button>
    </view>
    
    <!-- 处方详情 -->
    <view v-else-if="prescription" class="prescription-detail">
      <!-- 处方头部信息 -->
    <view class="card">
        <view class="prescription-header">
          <view class="hospital-name">{{ prescription.hospital_name }}</view>
          <view class="prescription-title">电子处方</view>
          <view class="prescription-number">处方编号：{{ prescription.prescription_number }}</view>
        </view>
        
        <!-- 医生信息 -->
        <view class="doctor-info">
          <view class="info-row">
            <view class="label">开方医生：</view>
            <view class="value">{{ prescription.doctor_name }} {{ prescription.doctor_title }}</view>
          </view>
          <view class="info-row">
            <view class="label">科室：</view>
            <view class="value">{{ prescription.doctor_department }}</view>
          </view>
          <view class="info-row">
            <view class="label">开方日期：</view>
            <view class="value">{{ prescription.date }}</view>
          </view>
          <view class="info-row">
            <view class="label">诊断：</view>
            <view class="value">{{ prescription.diagnosis }}</view>
          </view>
        </view>
      </view>
      
      <!-- 药品清单 -->
      <view class="card">
        <view class="section-title">药品清单</view>
        <view class="medications-list">
          <view v-for="(med, index) in prescription.medications" :key="index" class="medication-item">
            <view class="med-header">
              <view class="med-name">{{ med.name }}</view>
              <view class="med-spec">{{ med.specification }}</view>
            </view>
            <view class="med-details">
              <view class="detail-row">
                <text class="detail-label">用法用量：</text>
                <text class="detail-value">{{ med.dosage }}，{{ med.frequency }}</text>
              </view>
              <view class="detail-row">
                <text class="detail-label">数量：</text>
                <text class="detail-value">{{ med.quantity }}{{ med.unit }}</text>
              </view>
              <view class="detail-row">
                <text class="detail-label">疗程：</text>
                <text class="detail-value">{{ med.duration }}</text>
              </view>
              <view class="detail-row">
                <text class="detail-label">服用方法：</text>
                <text class="detail-value">{{ med.usage }}</text>
              </view>
              <view v-if="med.notes" class="detail-row">
                <text class="detail-label">备注：</text>
                <text class="detail-value notes">{{ med.notes }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 医嘱和注意事项 -->
      <view class="card">
        <view class="section-title">医嘱</view>
        <view class="instructions">{{ prescription.instructions }}</view>
        <view v-if="prescription.follow_up" class="follow-up">
          <text class="follow-up-label">复诊安排：</text>
          <text>{{ prescription.follow_up }}</text>
        </view>
      </view>
      
      <!-- 医生签名 -->
      <view class="card">
        <view class="signature-section">
          <view class="signature-label">医生签名：</view>
          <view class="signature">{{ prescription.doctor_signature }}</view>
          <view class="signature-date">{{ prescription.date }}</view>
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view class="actions">
        <button class="btn-secondary" @click="goBack">返回</button>
        <button class="btn-primary" @click="exportToPDF" :disabled="exporting">
          {{ exporting ? '导出中...' : '导出PDF' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import jsPDF from 'jspdf'
import AppHeader from '@/components/AppHeader.vue'

// 响应式数据
const loading = ref(true)
const error = ref('')
const prescription = ref(null)
const patient = ref(null)
const exporting = ref(false)

// 获取URL参数
const getPrescriptionId = () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return currentPage.options.id || currentPage.options.prescription_id || '1'
}

// 加载处方数据
const loadPrescriptionData = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const prescriptionId = getPrescriptionId()
    
    // 加载处方数据
    const prescriptionResponse = await uni.request({
      url: '/static/mock/prescriptions.json',
      method: 'GET'
    })
    
    if (prescriptionResponse.statusCode !== 200) {
      throw new Error('无法加载处方数据')
    }
    
    const prescriptionData = prescriptionResponse.data.prescriptions.find(
      p => p.id.toString() === prescriptionId
    )
    
    if (!prescriptionData) {
      throw new Error('未找到指定的处方')
    }
    
    prescription.value = prescriptionData
    
    // 加载患者数据
    const userResponse = await uni.request({
      url: '/static/mock/users.json',
      method: 'GET'
    })
    
    if (userResponse.statusCode === 200) {
      patient.value = userResponse.data.users.find(
        u => u.id === prescriptionData.patient_id
      )
    }
    
  } catch (err) {
    console.error('加载处方数据失败:', err)
    error.value = err.message || '加载失败，请重试'
  } finally {
    loading.value = false
  }
}

// 导出PDF
const exportToPDF = async () => {
  if (!prescription.value || !patient.value) return
  
  try {
    exporting.value = true
    
    // 创建PDF文档
    const doc = new jsPDF()
    
    // 设置中文字体（这里使用默认字体，实际项目中可能需要加载中文字体）
    doc.setFont('helvetica')
    
    let yPosition = 20
    
    // 标题
    doc.setFontSize(20)
    doc.text('电子处方', 105, yPosition, { align: 'center' })
    yPosition += 15
    
    // 医院名称
    doc.setFontSize(16)
    doc.text(prescription.value.hospital_name, 105, yPosition, { align: 'center' })
    yPosition += 20
    
    // 处方信息
    doc.setFontSize(12)
    doc.text(`处方编号: ${prescription.value.prescription_number}`, 20, yPosition)
    yPosition += 8
    doc.text(`患者姓名: ${patient.value.name}`, 20, yPosition)
    yPosition += 8
    doc.text(`开方医生: ${prescription.value.doctor_name} ${prescription.value.doctor_title}`, 20, yPosition)
    yPosition += 8
    doc.text(`科室: ${prescription.value.doctor_department}`, 20, yPosition)
    yPosition += 8
    doc.text(`开方日期: ${prescription.value.date}`, 20, yPosition)
    yPosition += 8
    doc.text(`诊断: ${prescription.value.diagnosis}`, 20, yPosition)
    yPosition += 15
    
    // 药品清单标题
    doc.setFontSize(14)
    doc.text('药品清单:', 20, yPosition)
    yPosition += 10
    
    // 药品列表
    doc.setFontSize(10)
    prescription.value.medications.forEach((med, index) => {
      doc.text(`${index + 1}. ${med.name} ${med.specification}`, 25, yPosition)
      yPosition += 6
      doc.text(`   用法用量: ${med.dosage}, ${med.frequency}`, 25, yPosition)
      yPosition += 6
      doc.text(`   数量: ${med.quantity}${med.unit}, 疗程: ${med.duration}`, 25, yPosition)
      yPosition += 6
      doc.text(`   服用方法: ${med.usage}`, 25, yPosition)
      if (med.notes) {
        yPosition += 6
        doc.text(`   备注: ${med.notes}`, 25, yPosition)
      }
      yPosition += 10
    })
    
    // 医嘱
    yPosition += 5
    doc.setFontSize(12)
    doc.text('医嘱:', 20, yPosition)
    yPosition += 8
    doc.setFontSize(10)
    
    // 处理长文本换行
    const instructionsLines = doc.splitTextToSize(prescription.value.instructions, 170)
    instructionsLines.forEach(line => {
      doc.text(line, 25, yPosition)
      yPosition += 6
    })
    
    if (prescription.value.follow_up) {
      yPosition += 5
      doc.text(`复诊安排: ${prescription.value.follow_up}`, 25, yPosition)
      yPosition += 10
    }
    
    // 医生签名
    yPosition += 10
    doc.text(`医生签名: ${prescription.value.doctor_signature}`, 120, yPosition)
    yPosition += 8
    doc.text(`日期: ${prescription.value.date}`, 120, yPosition)
    
    // 生成文件名
    const fileName = `处方_${patient.value.name}_${prescription.value.date}.pdf`
    
    // 保存PDF
    doc.save(fileName)
    
    uni.showToast({
      title: 'PDF导出成功',
      icon: 'success'
    })
    
  } catch (err) {
    console.error('PDF导出失败:', err)
    uni.showToast({
      title: 'PDF导出失败',
      icon: 'error'
    })
  } finally {
    exporting.value = false
  }
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 页面加载时获取数据
onMounted(() => {
  loadPrescriptionData()
})
</script>

<style scoped>
@import '@/styles/platform-import.scss';

.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0F4F8 0%, #FAFBFC 100%);
  padding: 24rpx;
}

/* 加载和错误状态 */
.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.loading-text, .error-text {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 40rpx;
}

/* 卡片样式 - 专业医疗设计 */
.card {
  background: white;
  border-radius: var(--radius-2xl);
  padding: 40rpx;
  margin-bottom: 24rpx;
  box-shadow: var(--shadow-lg);
  border: 2rpx solid rgba(55, 205, 135, 0.08);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: linear-gradient(90deg, #37CD87 0%, #2DB873 100%);
}

/* 处方头部 - 更庄重的设计 */
.prescription-header {
  text-align: center;
  border-bottom: 3rpx solid rgba(55, 205, 135, 0.1);
  padding-bottom: 32rpx;
  margin-bottom: 32rpx;
  position: relative;
}

.prescription-header::after {
  content: '';
  position: absolute;
  bottom: -3rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 100rpx;
  height: 3rpx;
  background: linear-gradient(90deg, #37CD87 0%, #2DB873 100%);
  border-radius: var(--radius-sm);
}

.hospital-name {
  font-size: var(--font-xl);
  font-weight: var(--weight-bold);
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12rpx;
  letter-spacing: 2rpx;
}

.prescription-title {
  font-size: var(--font-3xl);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  margin-bottom: 20rpx;
  letter-spacing: 4rpx;
}

.prescription-number {
  font-size: var(--font-sm);
  color: var(--color-text-tertiary);
  font-weight: var(--weight-medium);
}

/* 医生信息 - 专业排版 */
.doctor-info {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 16rpx 20rpx;
  background: linear-gradient(135deg, rgba(55, 205, 135, 0.02) 0%, rgba(0, 80, 179, 0.02) 100%);
  border-radius: var(--radius-lg);
  border-left: 4rpx solid rgba(55, 205, 135, 0.3);
}

.info-row .label {
  font-size: var(--font-md);
  color: var(--color-text-secondary);
  min-width: 160rpx;
  font-weight: var(--weight-medium);
}

.info-row .value {
  font-size: var(--font-md);
  color: var(--color-text-primary);
  font-weight: var(--weight-semibold);
  flex: 1;
}

/* 章节标题 - 医疗风格 */
.section-title {
  font-size: var(--font-xl);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  margin-bottom: 28rpx;
  padding-bottom: 20rpx;
  border-bottom: 3rpx solid rgba(55, 205, 135, 0.1);
  position: relative;
  letter-spacing: 1rpx;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -3rpx;
  left: 0;
  width: 80rpx;
  height: 3rpx;
  background: linear-gradient(90deg, #37CD87 0%, #2DB873 100%);
  border-radius: var(--radius-sm);
}

/* 药品列表 - 高级药物展示 */
.medications-list {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.medication-item {
  background: linear-gradient(135deg, rgba(55, 205, 135, 0.03) 0%, rgba(0, 80, 179, 0.03) 100%);
  border-radius: var(--radius-xl);
  padding: 32rpx;
  border-left: 6rpx solid #37CD87;
  box-shadow: var(--shadow-xs);
  transition: all var(--duration-base) var(--ease-smooth);
}

.medication-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateX(4rpx);
}

.med-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid rgba(55, 205, 135, 0.1);
}

.med-name {
  font-size: var(--font-lg);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  letter-spacing: 0.5rpx;
}

.med-spec {
  font-size: var(--font-sm);
  color: #37CD87;
  background: rgba(55, 205, 135, 0.1);
  padding: 10rpx 20rpx;
  border-radius: var(--radius-full);
  font-weight: var(--weight-medium);
  border: 2rpx solid rgba(55, 205, 135, 0.2);
}

.med-details {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  padding: 8rpx 0;
}

.detail-label {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  min-width: 140rpx;
  flex-shrink: 0;
  font-weight: var(--weight-medium);
}

.detail-value {
  font-size: var(--font-sm);
  color: var(--color-text-primary);
  flex: 1;
  line-height: 1.6;
  font-weight: var(--weight-regular);
}

.detail-value.notes {
  color: #e67e22;
  font-style: italic;
  background: rgba(230, 126, 34, 0.08);
  padding: 8rpx 12rpx;
  border-radius: var(--radius-md);
  border-left: 3rpx solid #e67e22;
}

/* 医嘱 - 重要提示设计 */
.instructions {
  font-size: var(--font-md);
  color: var(--color-text-primary);
  line-height: 1.8;
  margin-bottom: 24rpx;
  padding: 20rpx;
  background: linear-gradient(135deg, rgba(55, 205, 135, 0.03) 0%, rgba(0, 80, 179, 0.03) 100%);
  border-radius: var(--radius-lg);
  border-left: 4rpx solid rgba(55, 205, 135, 0.5);
}

.follow-up {
  background: linear-gradient(135deg, rgba(55, 205, 135, 0.08) 0%, rgba(0, 80, 179, 0.08) 100%);
  padding: 24rpx;
  border-radius: var(--radius-lg);
  border-left: 4rpx solid #37CD87;
  box-shadow: var(--shadow-xs);
}

.follow-up-label {
  font-weight: var(--weight-bold);
  color: #37CD87;
  margin-right: 12rpx;
  font-size: var(--font-md);
}

/* 医生签名 - 专业认证设计 */
.signature-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 20rpx;
  padding: 24rpx;
  background: linear-gradient(135deg, rgba(55, 205, 135, 0.02) 0%, rgba(0, 80, 179, 0.02) 100%);
  border-radius: var(--radius-lg);
}

.signature-label {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  font-weight: var(--weight-medium);
}

.signature {
  font-size: var(--font-xl);
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  padding: 20rpx 40rpx;
  border: 3rpx solid rgba(55, 205, 135, 0.3);
  border-radius: var(--radius-lg);
  background: white;
  box-shadow: var(--shadow-sm);
  font-family: 'STKaiti', 'KaiTi', serif;
  letter-spacing: 2rpx;
}

.signature-date {
  font-size: var(--font-sm);
  color: var(--color-text-tertiary);
  font-weight: var(--weight-medium);
}

/* 操作按钮 - 现代医疗按钮设计 */
.actions {
  display: flex;
  gap: 24rpx;
  padding: 32rpx 0;
  margin-top: 24rpx;
}

.btn-primary, .btn-secondary {
  flex: 1;
  height: 96rpx;
  border-radius: var(--radius-full);
  font-size: var(--font-lg);
  font-weight: var(--weight-semibold);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-base) var(--ease-smooth);
  letter-spacing: 1rpx;
}

.btn-primary {
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  color: white;
  box-shadow: var(--shadow-colored);
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  opacity: 0;
  transition: opacity var(--duration-base) var(--ease-smooth);
}

.btn-primary:active::before {
  opacity: 1;
}

.btn-primary:disabled {
  background: var(--color-bg-tertiary);
  color: var(--color-text-placeholder);
  box-shadow: none;
}

.btn-secondary {
  background: white;
  color: var(--color-text-secondary);
  border: 3rpx solid rgba(55, 205, 135, 0.2);
  box-shadow: var(--shadow-sm);
}

.btn-primary:active {
  transform: translateY(-2rpx) scale(0.98);
  box-shadow: var(--shadow-lg);
}

.btn-secondary:active {
  transform: translateY(-2rpx) scale(0.98);
  background: rgba(55, 205, 135, 0.05);
  border-color: rgba(55, 205, 135, 0.4);
}
</style>
