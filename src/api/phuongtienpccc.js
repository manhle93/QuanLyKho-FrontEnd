import request from '@/utils/request'

export function index(params) {
    return request({
        url: '/phuong-tien-pccc',
        method: 'get',
        params
    })
}
export function updatePhuongTienPccc(id, data) {
    return request({
        url: '/phuong-tien-pccc/' + id,
        method: 'put',
        data
    })
}
export function storePhuongTienPccc(data) {
    return request({
        url: '/phuong-tien-pccc',
        method: 'post',
        data
    })
}

export function destroyPhuongTienPccc(id) {
    return request({
        url: '/phuong-tien-pccc/' + id,
        method: 'delete',
    })
}

export function getDonViPccc() {
    return request({
        url: '/phuong-tien-pccc/don-vi-pccc',
        method: 'get',
    })
}
export function getAllDonViPccc(params) {
    return request({
        url: "donvipccc",
        method: "get",
        params
    });
}

export function uploadPhuongTien(data) {
    return request({
        url: "uploadphuongtien",
        method: "post",
        data
    });
}