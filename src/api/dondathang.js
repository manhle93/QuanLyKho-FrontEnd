import request from '@/utils/request'

export function getBangGia(id) {
    return request({
        url: 'banggiasanpham/' + id,
        method: 'get',
    })
}

export function addDonDatHang(data) {
    return request({
        url: 'dondathang',
        method: 'post',
        data
    })
}

export function getDonDathang(params) {
    return request({
        url: 'dondathang',
        method: 'get',
        params
    })
}

export function xoaDonDathang(id) {
    return request({
        url: 'dondathang/' + id,
        method: 'delete',
    })
}
export function getChiTietDonDathang(id) {
    return request({
        url: 'dondathang/' + id,
        method: 'get',
    })
}

export function editDonDathang(id, data) {
    return request({
        url: 'dondathang/' + id,
        method: 'put',
        data
    })
}

export function huyDon(id) {
    return request({
        url: 'huydondathang/' + id,
        method: 'put',
    })
}
export function chuyenHoaDon(id,data) {
    return request({
        url: 'chuyenhoadon/' + id,
        method: 'put',
        data
    })
}

export function getShipper() {
    return request({
        url: 'shipper',
        method: 'get',
    })
}

export function thanhToanBoSung(data) {
    return request({
        url: 'thanhtoanbosung',
        method: 'post',
        data
    })
}