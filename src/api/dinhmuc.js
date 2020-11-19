import request from '@/utils/request'

export function getSanPham(params) {
    return request({
        url: 'thanhpham',
        method: 'get',
        params
    })
}
export function getNguyenLieu(params) {
  return request({
      url: 'nguyenlieu',
      method: 'get',
      params
  })
}
export function taoDinhMuc(data) {
  return request({
      url: 'dinhmuc',
      method: 'post',
      data
  })
}

export function dsDinhMuc(params) {
  return request({
      url: 'dinhmuc',
      method: 'get',
      params
  })
}
export function editDinhMuc(data) {
  return request({
      url: 'dinhmuc',
      method: 'put',
      data
  })
}

export function xoaDinhMuc(params) {
  return request({
      url: 'dinhmuc',
      method: 'delete',
      params
  })
}