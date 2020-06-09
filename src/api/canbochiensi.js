import request from '@/utils/request'

export function addCanBoChienSi(data) {
    return request({
        url: 'themcanbochiensi',
        method: 'post',
        data
    })
}

export function danhSachCanBoChienSi(params) {
    return request({
        url: 'danhsachcanbochiensi',
        method: 'get',
        params
    })
}

export function updateCanBoChienSi(id, data) {
    return request({
        url: 'editcanbochiensi/' + id,
        method: 'put',
        data
    })
}

export function xoaNhanSu(id, data) {
    return request({
        url: 'xoacanbochiensi/' + id,
        method: 'delete',
        data
    })
}

export function uploadNhanSu(data){
    return request({
        url: 'uploadnhansu',
        method: 'post',
        data
    })
}