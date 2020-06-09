import request from '@/utils/request'

export function addPhuongAnThucTap(data) {
    return request({
        url: 'phuonganthuctapchuachay',
        method: 'post',
        data
    })
}

export function getPhuongAnThucTap(params) {
    return request({
        url: 'phuonganthuctapchuachay',
        method: 'get',
        params
    })
}

export function deletePhuongAnThucTap(id) {
    return request({
        url: 'phuonganthuctapchuachay/' + id,
        method: 'delete',
    })
}

export function showPhuongAnThucTap(id) {
    return request({
        url: 'phuonganthuctapchuachay/' + id,
        method: 'get',
    })
}

export function updatePhuongAnThucTap(id, data) {
    return request({
        url: 'phuonganthuctapchuachay/' + id,
        method: 'put',
        data
    })
}