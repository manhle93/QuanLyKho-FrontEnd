import request from '@/utils/request'

export function index(params) {
    return request({
        url: '/thiet-bi',
        method: 'get',
        params
    })
}
export function updateThietBi(id, data) {
    return request({
        url: '/thiet-bi/' + id,
        method: 'put',
        data
    })
}
export function storeThietBi(data) {
    return request({
        url: '/thiet-bi',
        method: 'post',
        data
    })
}
export function getCamBien(id) {
    return request({
        url: '/thiet-bi/cam-bien/' + id,
        method: 'get',
    })
}
export function getToaNha() {
    return request({
        url: '/thiet-bi/toa-nha',
        method: 'get',
    })
}
export function destroyThietBi(id) {
    return request({
        url: '/thiet-bi/' + id,
        method: 'delete',
    })
}
export function addCamBien(id, data) {
    return request({
        url: '/thiet-bi/them-cam-bien/' + id,
        method: 'post',
        data
    })
}
export function exportExcel(params) {
    return request({
        url: '/thiet-bi/excel',
        method: 'get',
        params,
        responseType: "blob"
    })
}

export function uploadThietBi(data) {
    return request({
        url: '/uploadthietbi',
        method: 'post',
        data
    })
}
