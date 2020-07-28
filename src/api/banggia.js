import request from '@/utils/request'

export function getBangGia(params) {
  return request({
    url: "banggia",
    methods: 'get',
    params
  })
}


export function editBangGia(id, data) {
  return request({
      url: '/banggia/' + id,
      method: 'put',
      data
  })
}

export function xoaBangGia(id) {
  return request({
      url: '/banggia/' + id,
      method: 'delete',
  })
}

export function addBangGia(data) {
  return request({
      url: 'banggia',
      method: 'post',
      data
  })
}

export function addSanPhamBangGia(id, data) {
  return request({
      url: 'banggiasanpham/' + id,
      method: 'post',
      data
  })
}
export function getSanPhamBangGia(id) {
  return request({
      url: 'banggiasanpham/' + id,
      method: 'get',
  })
}

export function getSanPham(params) {
  return request({
      url: 'sanphambanggia',
      method: 'get',
      params
  })
}
export function saoChepBangGia(id) {
  return request({
      url: 'banggia/' + id,
      method: 'post',
  })
}