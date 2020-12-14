import request from '@/utils/request'

export function getKhachHang(params) {
  return request({
    url: "khachhang",
    methods: 'get',
    params
  })
}


export function editKhachHang(id, data) {
  return request({
      url: '/khachhang/' + id,
      method: 'put',
      data
  })
}

export function xoaKhachHang(id) {
  return request({
      url: '/khachhang/' + id,
      method: 'delete',
  })
}

export function addKhachHang(data) {
  return request({
      url: 'khachhang',
      method: 'post',
      data
  })
}

export function getNhaCungCap(params) {
  return request({
    url: "nhaccungcap",
    methods: 'get',
    params
  })
}


export function editNhaCungCap(id, data) {
  return request({
      url: '/nhaccungcap/' + id,
      method: 'put',
      data
  })
}

export function xoaNhaCungCap(id) {
  return request({
      url: '/nhaccungcap/' + id,
      method: 'delete',
  })
}

export function addNhaCungCap(data) {
  return request({
      url: 'nhaccungcap',
      method: 'post',
      data
  })
}


export function nopTien(data) {
  return request({
      url: 'noptien',
      method: 'post',
      data
  })
}

export function hoanTac(id) {
  return request({
      url: 'hoantac/'+ id,
      method: 'post',
  })
}

export function lichSu(params) {
  return request({
      url: 'noptien',
      method: 'get',
      params
  })
}

export function donHangConNo(params) {
  return request({
    url: "donhangconno",
    methods: 'get',
    params
  })
}

export function importKhachHang(data) {
  return request({
      url: 'importkhachhang',
      method: 'post',
      data
  })
}