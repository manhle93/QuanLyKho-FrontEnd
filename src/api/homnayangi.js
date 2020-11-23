import request from '@/utils/request'

export function getMonAn(params) {
    return request({
        url: '/homnayangi',
        method: 'get',
        params
    })
}
export function addMonAn(data) {
  return request({
      url: '/homnayangi',
      method: 'post',
      data
  })
}
export function editMonAn(data) {
  return request({
      url: '/homnayangi',
      method: 'put',
      data
  })
}
export function xoaMonAn(id) {
  return request({
      url: '/homnayangi/' + id,
      method: 'delete',
  })
}
export function hienThiTT(data) {
  return request({
      url: '/hienthitrangchu',
      method: 'put',
      data
  })
}