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