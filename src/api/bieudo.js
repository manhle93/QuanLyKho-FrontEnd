import request from '@/utils/request'

export function topSanPham(params) {
    return request({
        url: 'sanphambanchay',
        method: 'get',
        params
    })
}

export function getDoanhThu(params) {
  return request({
      url: 'doanhthu',
      method: 'get',
      params
  })
}

export function dashboard(params) {
  return request({
      url: 'dashboard',
      method: 'get',
      params
  })
}