import request from '@/utils/request'

export function getPolygol() {
    return request({
        url: "getPolygon",
        method: "get"
    });
}
export function getTinhThanh(params) {
    return request({
        url: "tinhthanh",
        method: "get",
        params
    });
}
export function getAddressByLatLong(params) {
    return request({
        url: "getAddressByLatLong",
        method: "get",
        params
    });
}

export function getLatLongByAddressText(params) {
    return request({
        url: "getLatLongByAddressText",
        method: "get",
        params
    });
}
export function addTinhThanh(data) {
    return request({
        url: "tinhthanh",
        method: "post",
        data
    });
}
export function editTinhThanh(id, data) {
    return request({
        url: "tinhthanh/" + id,
        method: "put",
        data
    });
}
export function deleteTinhThanh(id, params) {
    return request({
        url: "tinhthanh/" + id,
        method: "delete",
        params
    });
}
export function getDonViPccc(id) {
    return request({
        url: "tinhthanh/don-vi-pccc/" + id,
        method: "get",
    });
}
