<template>
  <view class="container">
    <view class="card">
      <view class="title">血压趋势</view>
      <view id="bp-chart" style="width: 100%; height: 300px;"></view>
    </view>

    <view class="card">
      <view class="title">心率趋势</view>
      <view id="hr-chart" style="width: 100%; height: 300px;"></view>
    </view>

    <view class="card">
      <view class="title">血糖趋势</view>
      <view id="bs-chart" style="width: 100%; height: 300px;"></view>
    </view>
  </view>
</template>

<script setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import metricsData from '@/static/mock/metrics.json'

onMounted(() => {
  // 血压图表
  const bpChart = echarts.init(document.getElementById('bp-chart'))
  bpChart.setOption({
    xAxis: {
      type: 'category',
      data: metricsData.bloodPressure.map(item => item.date.slice(5))
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '收缩压',
        data: metricsData.bloodPressure.map(item => item.systolic),
        type: 'line',
        smooth: true
      },
      {
        name: '舒张压',
        data: metricsData.bloodPressure.map(item => item.diastolic),
        type: 'line',
        smooth: true
      }
    ],
    legend: { data: ['收缩压', '舒张压'] }
  })

  // 心率图表
  const hrChart = echarts.init(document.getElementById('hr-chart'))
  hrChart.setOption({
    xAxis: {
      type: 'category',
      data: metricsData.heartRate.map(item => item.date.slice(5))
    },
    yAxis: { type: 'value' },
    series: [{
      data: metricsData.heartRate.map(item => item.value),
      type: 'line',
      smooth: true,
      itemStyle: { color: '#5ac725' }
    }]
  })

  // 血糖图表
  const bsChart = echarts.init(document.getElementById('bs-chart'))
  bsChart.setOption({
    xAxis: {
      type: 'category',
      data: metricsData.bloodSugar.map(item => item.date.slice(5))
    },
    yAxis: { type: 'value' },
    series: [{
      data: metricsData.bloodSugar.map(item => item.value),
      type: 'line',
      smooth: true,
      itemStyle: { color: '#ff6b6b' }
    }]
  })
})
</script>
