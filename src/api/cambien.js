import request from '@/utils/request'

export function index(params) {
    return request({
        url: '/cam-bien',
        method: 'get',
        params
    })
}
export function updateCamBien(id, data) {
    return request({
        url: '/cam-bien/' + id,
        method: 'put',
        data
    })
}
export function storeCamBien(data) {
    return request({
        url: '/cam-bien',
        method: 'post',
        data
    })
}

export function destroyCamBien(id) {
    return request({
        url: '/cam-bien/' + id,
        method: 'delete',
    })
}

