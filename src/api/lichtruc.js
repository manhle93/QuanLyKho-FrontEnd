import request from '@/utils/request'

export function showLichtruc(id) {
    return request({
        url: '/lichtruc/' + id,
        method: 'get',
    })
}
export function updateLichTruc(id, data) {
    return request({
        url: '/lichtruc/' + id,
        method: 'put',
        data
    })
}
export function themlichtruc(data) {
    return request({
        url: '/lichtruc',
        method: 'post',
        data
    })
}
export function getLichTruc(params) {
    return request({
        url: '/lichtruc',
        method: 'get',
        params
    })
}
export function xoaLichTruc(id) {
    return request({
        url: '/lichtruc/' + id,
        method: 'delete',
        id
    })
}
