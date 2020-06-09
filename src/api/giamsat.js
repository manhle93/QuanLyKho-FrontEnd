import request from '@/utils/request'

export function getData(params) {
    return request({
        url: '/getData',
        method: 'get',
        params
    })
}

export function getDataPolygon(params) {
    return request({
        url: '/getdatapolygon',
        method: 'get',
        params
    })
}

export function getDiemChay(params) {
    return request({
        url: "diemchay",
        method: "get",
        params
    });
}

export function checkDiemChay(id) {
    return request({
        url: "check_diemchay/" + id,
        method: "get"
    });
}
export function getXe(id) {
    return request({
        url: "getXe/" + id,
        method: "get"
    });
}
export function getDonViHoTro(id) {
    return request({
        url: "diemchay/don-vi-ho-tro/" + id,
        method: "get",
    });
}
export function getPhuongTienPccc(id) {
    return request({
        url: "diemchay/phuong-tien-pccc/" + id,
        method: "get",
    });
}
export function updateDonViHoTro(id, params) {
    return request({
        url: "diemchay/don-vi-ho-tro/" + id,
        method: "post",
        params
    });
}
export function updatePhuongTienPccc(id, params) {
    return request({
        url: "diemchay/phuong-tien-pccc/" + id,
        method: "post",
        params
    });
}
export function getViTriPhuongTienPccc(imei) {
    return request({
        url: "phuong-tien-pccc/vi-tri/" + imei,
        method: "get",
    });
}