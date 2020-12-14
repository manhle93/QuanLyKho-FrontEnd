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

export function addBaiViet(data) {
  return request({
      url: 'baiviet',
      method: 'post',
      data
  })
}

export function getBaiViet(params) {
  return request({
      url: 'baiviet',
      method: 'get',
      params
  })
}

export function xoaBaiViet(id) {
  return request({
      url: 'baiviet/' + id,
      method: 'delete',
  })
}
export function chiTietBaiViet(id) {
  return request({
      url: 'baiviet/' + id,
      method: 'get',
  })
}
export function editBaiViet(id, data) {
  return request({
      url: 'baiviet/' + id,
      method: 'put',
      data
  })
}

export function addMonBepNhaRuong(data) {
  return request({
      url: 'bepnharuong',
      method: 'post',
      data
  })
}

export function getMonBepNhaRuong() {
  return request({
      url: 'bepnharuong',
      method: 'get',
  })
}

export function getBanner() {
  return request({
      url: 'banner',
      method: 'get',
  })
}
export function updateBanner(data) {
  return request({
      url: 'updatebanner',
      method: 'post',
      data
  })
}