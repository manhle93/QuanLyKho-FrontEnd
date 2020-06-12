import request from '@/utils/request'

export function listSanPham(params) {
    return request({
        url: '/sanpham',
        method: 'get',
        params
    })
}
export function addSanPham(data) {
    return request({
        url: '/sanpham',
        method: 'post',
        data
    })
}
export function xoaSanPham(id) {
  return request({
      url: '/sanpham/' + id,
      method: 'delete',
  })
}
export function chiTietSP(id) {
  return request({
      url: '/sanpham/' + id,
      method: 'get',
  })
}
export function xoaAnh(params) {
  return request({
      url: '/xoahinhanh',
      method: 'delete',
      params
  })
}

export function editSanPham(id, data) {
  return request({
      url: '/sanpham/'+id,
      method: 'put',
      data
  })
}
