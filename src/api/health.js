/**
 * 健康档案相关 API
 */

import { get, post, put, del } from '@/utils/request'

/**
 * 获取健康档案
 */
export function getHealthRecord() {
  return get('/health/record')
}

/**
 * 更新健康档案
 */
export function updateHealthRecord(data) {
  return put('/health/record', data)
}

/**
 * 添加体检记录
 */
export function addPhysicalExam(data) {
  return post('/health/physical-exam', data)
}

/**
 * 获取体检记录列表
 */
export function getPhysicalExamList(params) {
  return get('/health/physical-exam/list', params)
}

/**
 * 添加用药记录
 */
export function addMedication(data) {
  return post('/health/medication', data)
}

/**
 * 获取用药记录列表
 */
export function getMedicationList(params) {
  return get('/health/medication/list', params)
}

/**
 * 删除用药记录
 */
export function deleteMedication(id) {
  return del(`/health/medication/${id}`)
}

/**
 * 添加过敏史
 */
export function addAllergy(data) {
  return post('/health/allergy', data)
}

/**
 * 获取过敏史列表
 */
export function getAllergyList() {
  return get('/health/allergy/list')
}

/**
 * 删除过敏史
 */
export function deleteAllergy(id) {
  return del(`/health/allergy/${id}`)
}

/**
 * 添加家族病史
 */
export function addFamilyHistory(data) {
  return post('/health/family-history', data)
}

/**
 * 获取家族病史列表
 */
export function getFamilyHistoryList() {
  return get('/health/family-history/list')
}

/**
 * 添加健康数据（血压、血糖等）
 */
export function addHealthData(data) {
  return post('/health/data', data)
}

/**
 * 获取健康数据列表
 */
export function getHealthDataList(params) {
  return get('/health/data/list', params)
}

/**
 * 获取健康数据统计
 */
export function getHealthDataStats(params) {
  return get('/health/data/stats', params)
}

