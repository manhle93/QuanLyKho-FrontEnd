import request from '@/utils/request'

export function addDonViPccc(data) {
    return request({
        url: '/donvipccc/add',
        method: 'post',
        data
    })
}

export function getDonViDetail(id) {
    return request({
        url: "/donvipccc/" + id,
        method: "get"
    });
}

export function getInfo(token) {
    return request({
        url: '/auth/me',
        method: 'post',
    })
}

export function logout() {
    return request({
        url: '/user/logout',
        method: 'post'
    })
}

export function getUser(params) {
    return request({
        url: "/user",
        method: "get",
        params
    });
}

export function addUser(data) {
    return request({
        url: "/user/add",
        method: "post",
        data
    });
}

export function editDonViPccc(id, data) {
    return request({
        url: "/donvipccc/" + id + "/edit",
        method: "put",
        data
    });
}

export function deleteDonViPccc(id, data) {
    return request({
        url: "/donvipccc/" + id + "/delete",
        method: "delete",
        data
    });
}

export function getDonViPccc(params) {
    return request({
        url: "donvipccc",
        method: "get",
        params
    });
}
export function getAllDonViPccc() {
    return request({
        url: "donvipccc/all",
        method: "get",
    });
}
export function userAvatar(id,data) {
    return request({
        url: "donvipcc/avatarupload/"+id,
        method: "post",
        data
    });
}

export function allDonViPcccOnMap() {
    return request({
        url: "dsdonvi",
        method: "get",
    });
}