import request from '@/utils/request'

export function getThietbiTinhThanh() {
    return request({
        url: 'sothietbitinhthanh',
        method: 'get',
    })
}

export function getTrangThaiThietBi() {
    return request({
        url: 'trangthaithietbi',
        method: 'get',
    })
}

export function getDataBieuDoThietBi() {
    return request({
        url: 'databieudothietbi',
        method: 'get',
    })
} 
export function getDataBieuDoVuChay() {
    return request({
        url: 'databieudovuchay',
        method: 'get',
    })
}
export function getDataBieuDoThietHai() {
    return request({
        url: 'databieudothiethai',
        method: 'get',
    })
}
export function getSoThietBi(params) {
    return request({
        url: 'sothietbionline',
        method: 'get',
        params
    })
}

export function getThongBao(params) {
    return request({
        url: 'danhsachthongbao',
        method: 'get',
        params
    })
}
export function docThongBao() {
    return request({
        url: 'docthongbao',
        method: 'get',
    })
}

export function diemChay(params) {
    return request({
        url: 'danhsachvuchay',
        method: 'get',
        params
    })
}

export function donVi(params) {
    return request({
        url: 'danhsachdonvi',
        method: 'get',
        params
    })
}

export function getToaNha(params) {
    return request({
        url: 'danhsachcongtrinh',
        method: 'get',
        params
    })
}

export function dangChay(params) {
    return request({
        url: 'diemdangchay',
        method: 'get',
        params
    })
}

export function getPolygol(params) {
    return request({
        url: 'polygoltinhthanh',
        method: 'get',
        params
    })
}