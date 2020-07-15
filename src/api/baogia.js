import request from '@/utils/request'

export function addBaoGia(data) {
    return request({
        url: 'thembaogia',
        method: 'post',
        data
    })
}

export function getBaoGia(parmas) {
    return request({
        url: 'baogia',
        method: 'get',
        parmas
    })
}

export function getChiTietBaoGia(id) {
    return request({
        url: 'baogia/' + id,
        method: 'get',
    })
}

export function duyetBaoGia(id, data) {
    return request({
        url: 'baogia/' + id,
        method: 'put',
        data
    })
}

export function updateGiaBan(data) {
    return request({
        url: 'giabansanpham',
        method: 'put',
        data
    })
}