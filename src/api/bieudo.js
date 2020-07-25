import request from '@/utils/request'

export function topSanPham(params) {
    return request({
        url: 'sanphambanchay',
        method: 'get',
        params
    })
}

export function getDoanhThu() {
  return request({
      url: 'doanhthu',
      method: 'get',
  })
}

export function dashboard() {
  return request({
      url: 'dashboard',
      method: 'get',
  })
}