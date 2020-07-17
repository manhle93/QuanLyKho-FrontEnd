import request from '@/utils/request'

export function getKhachHang() {
  return request({
    url: "khachhang",
    methods: 'get',
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

export function getNhaCungCap() {
  return request({
    url: "nhaccungcap",
    methods: 'get',
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