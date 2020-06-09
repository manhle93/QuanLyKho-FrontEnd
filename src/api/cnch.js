import request from '@/utils/request'

export function showcnch(id) {
    return request({
        url: '/cuunancuuho/' + id,
        method: 'get',
    })
}
export function updatecnch(id, data) {
    return request({
        url: '/cuunancuuho/' + id,
        method: 'put',
        data
    })
}
export function themcnch(data) {
    return request({
        url: '/cuunancuuho',
        method: 'post',
        data
    })
}
export function getcnch(params) {
    return request({
        url: '/cuunancuuho',
        method: 'get',
        params
    })
}
export function xoaCNCH(id) {
    return request({
        url: '/cuunancuuho/' + id,
        method: 'delete',
        id
    })
}
