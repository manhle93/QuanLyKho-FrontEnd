import request from '@/utils/request'

export function getTinhThanh() {
    return request({
        url: 'qltinhthanh',
        method: 'get',
    })
}
export function getChiTietTinhThanh(params) {
    return request({
        url: 'chitiettinhthanh',
        method: 'get',
        params
    })
}

export function getPT(params) {
    return request({
        url: 'danhsachxe',
        method: 'get',
        params
    })
}
