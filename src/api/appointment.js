/**
 * 预约相关 API
 */

import { get, post, put, del } from '@/utils/request'

/**
 * 获取医生列表
 */
export function getDoctorList(params) {
  return get('/appointment/doctors', params)
}

/**
 * 获取医生详情
 */
export function getDoctorDetail(id) {
  return get(`/appointment/doctor/${id}`)
}

/**
 * 获取医生排班
 */
export function getDoctorSchedule(doctorId, params) {
  return get(`/appointment/schedule/${doctorId}`, params)
}

/**
 * 创建预约
 */
export function createAppointment(data) {
  return post('/appointment/create', data)
}

/**
 * 取消预约
 */
export function cancelAppointment(id) {
  return put(`/appointment/cancel/${id}`)
}

/**
 * 获取预约列表
 */
export function getAppointmentList(params) {
  return get('/appointment/list', params)
}

/**
 * 获取预约详情
 */
export function getAppointmentDetail(id) {
  return get(`/appointment/detail/${id}`)
}

/**
 * 评价医生
 */
export function rateDoctor(data) {
  return post('/appointment/rate', data)
}

/**
 * 获取科室列表
 */
export function getDepartmentList() {
  return get('/appointment/departments')
}

