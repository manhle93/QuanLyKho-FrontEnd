import request from '@/utils/request'

export function addSlider(data) {
  return request({
      url: 'slider',
      method: 'post',
      data
  })
}

export function updateSlider(data) {
  return request({
      url: 'slider',
      method: 'put',
      data
  })
}
export function getSlider() {
  return request({
      url: 'slider',
      method: 'get',
  })
}
export function xoaSlider(id) {
  return request({
      url: 'slider/' + id,
      method: 'delete',
  })
}

export function addMonNgon(data) {
  return request({
      url: 'monngonmoingay',
      method: 'post',
      data
  })
}

export function getMonNgon() {
  return request({
      url: 'idmonngonmoingay',
      method: 'get',
  })
}