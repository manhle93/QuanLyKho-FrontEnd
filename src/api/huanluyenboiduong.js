import request from '@/utils/request'

export function addHuanLuyenBoiDuong(data) {
    return request({
        url: 'huanluyenboiduong',
        method: 'post',
        data
    })
}

export function getHuanLuyenBoiDuong(params) {
    return request({
        url: 'huanluyenboiduong',
        method: 'get',
        params
    })
}
export function showHuanLuyenBoiDuong(id) {
    return request({
        url: 'huanluyenboiduong/' + id,
        method: 'get',       
    })
}

export function updateHuanLuyenBoiDuong(id, data) {
    return request({
        url: 'huanluyenboiduong/' + id,
        method: 'put',      
        data 
    })
}

export function deleteHuanLuyenBoiDuong(id) {
    return request({
        url: 'huanluyenboiduong/' + id,
        method: 'delete',       
    })
}