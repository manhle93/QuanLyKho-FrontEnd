import request from '@/utils/request'

export function getBangGia() {
  return request({
    url: "banggia",
    methods: 'get',
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