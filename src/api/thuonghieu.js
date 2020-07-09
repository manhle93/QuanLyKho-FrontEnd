import request from '@/utils/request'

export function getThuongHieu() {
  return request({
    url: "thuonghieu",
    methods: 'get',
  })
}


export function editThuongHieu(id, data) {
  return request({
      url: '/thuonghieu/' + id,
      method: 'put',
      data
  })
}

export function xoaThuongHieu(id) {
  return request({
      url: '/thuonghieu/' + id,
      method: 'delete',
  })
}

export function addThuongHieu(data) {
  return request({
      url: '/addthuonghieu',
      method: 'post',
      data
  })
}