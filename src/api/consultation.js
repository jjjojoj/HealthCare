/**
 * 在线问诊相关 API
 */

import { get, post, upload } from '@/utils/request'

/**
 * 创建问诊订单
 */
export function createConsultation(data) {
  return post('/consultation/create', data)
}

/**
 * 获取问诊列表
 */
export function getConsultationList(params) {
  return get('/consultation/list', params)
}

/**
 * 获取问诊详情
 */
export function getConsultationDetail(id) {
  return get(`/consultation/detail/${id}`)
}

/**
 * 获取聊天记录
 */
export function getChatMessages(consultationId, params) {
  return get(`/consultation/messages/${consultationId}`, params)
}

/**
 * 发送消息
 */
export function sendMessage(data) {
  return post('/consultation/message', data)
}

/**
 * 上传图片消息
 */
export function uploadImage(filePath, consultationId) {
  return upload('/consultation/upload-image', filePath, { consultationId })
}

/**
 * 结束问诊
 */
export function endConsultation(id) {
  return post(`/consultation/end/${id}`)
}

/**
 * 获取处方
 */
export function getPrescription(consultationId) {
  return get(`/consultation/prescription/${consultationId}`)
}

