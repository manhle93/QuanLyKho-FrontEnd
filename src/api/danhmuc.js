import request from '@/utils/request'

export function index() {
    return request({
        url: '/danh-muc',
        method: 'get',
    })
}
export function updateDanhMuc(id, data) {
    return request({
        url: '/danh-muc/' + id,
        method: 'put',
        data
    })
}
export function storeDanhMuc(data) {
    return request({
        url: '/danh-muc',
        method: 'post',
        data
    })
}

export function destroyDanhMuc(id) {
    return request({
        url: '/danh-muc/' + id,
        method: 'delete',
    })
}
export function getDanhMucCon(params) {
    return request({
        url: '/danh-muc-con',
        method: 'get',
        params
    })
}
