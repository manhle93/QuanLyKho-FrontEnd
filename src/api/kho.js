import request from '@/utils/request'

export function getKho() {
  return request({
    url: "kho",
    methods: 'get',
  })
}


export function editKho(id, data) {
  return request({
      url: '/kho/' + id,
      method: 'put',
      data
  })
}

export function xoaKho(id) {
  return request({
      url: '/kho/' + id,
      method: 'delete',
  })
}

export function addKho(data) {
  return request({
      url: 'kho',
      method: 'post',
      data
  })
}

export function getSanPhamTonKho(params) {
  return request({
      url: 'sanphamtonkho',
      method: 'get',
      params
  })
}

export function addKiemKho(data) {
  return request({
      url: 'kiemkho',
      method: 'post',
      data
  })
}

export function getKiemKho(params) {
  return request({
      url: 'kiemkho',
      method: 'get',
      params
  })
}

export function getChiTiet(id) {
  return request({
      url: 'kiemkho/' + id,
      method: 'get',
  })
}
