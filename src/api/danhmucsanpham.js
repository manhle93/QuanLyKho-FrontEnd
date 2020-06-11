import request from '@/utils/request'

export function index(params) {
    return request({
        url: '/danhmuc',
        method: 'get',
        params
    })
}
export function addDanhMuc(data) {
    return request({
        url: '/danhmuc',
        method: 'post',
        data
    })
}
export function updateDanhMuc(data) {
    return request({
        url: '/danhmuc',
        method: 'put',
        data
    })
}
export function xoaDanhMuc(id) {
    return request({
        url: '/danhmuc/' + id,
        method: 'delete',
    })
}

export function upAnhDanhMuc(data) {
    return request({
      url: "anhdanhmuc",
      method: "post",
      headers: { "Content-Type": "multipart/form-data" },
      data
    });
  }
