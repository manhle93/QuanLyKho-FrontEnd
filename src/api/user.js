import request from "@/utils/request";

export function login(data) {
    return request({
        url: "/auth/login",
        method: "post",
        data
    });
}

export function getInfo(token) {
    return request({
        url: "/auth/me",
        method: "get"
    });
}
export function getKhachHang(id) {
    return request({
        url: "khachhang/" + id,
        method: "get"
    });
}
export function getInfor() {
    return request({
        url: "infor",
        method: "get"
    });
}
export function editInfor(data) {
    return request({
        url: "infor",
        method: "post",
        data
    });
}
export function changPassword(data) {
    return request({
        url: "changepass",
        method: "post",
        data
    });
}

export function uploadAvatar(data) {
    return request({
        url: "avatarupload",
        method: "post",
        data
    });
}
export function logout() {
    return request({
        url: "/auth/logout",
        method: "post"
    });
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

export function editUser(id, data) {
    return request({
        url: "/user/" + id + "/edit",
        method: "put",
        data
    });
}
export function userAvatar(id, data) {
  return request({
    url: "avatarupload/" + id,
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    data
  });
}

export function deleteUser(id, data) {
    return request({
        url: "/user/" + id + "/delete",
        method: "delete",
        data
    });
}

export function getRole(params) {
    return request({
        url: "system/roles",
        method: "get",
        params
    });
}
export function getMenus() {
    return request({
        url: "role-menu/list-menu",
        method: "get",
    });
}
export function getMenuRole() {
    return request({
        url: "role-menu/menu",
        method: "get",

    });
}
export function getRoleMenu() {
    return request({
        url: "role-menu/role",
        method: "get",

    });
}
export function addMenuToRole(id, data) {
    return request({
        url: "role-menu/" + id,
        method: "post",
        data
    });
}
export function quenMatKhau(data) {
    return request({
        url: "reset-password",
        method: "post",
        data
    });
}
export function resetPasswork(data) {
    return request({
        url: "create-password",
        method: "put",
        data
    });
}
export function getLichSuDangNhap(params) {
    return request({
        url: "lichsudangnhap",
        method: "get",
        params
    });
}

export function getLichSuHoatDong(params) {
    return request({
        url: "lichsuhoatdong",
        method: "get",
        params
    });
}

export function getCaptcha() {
    return request({
        url: "refreshcaptcha",
        method: "get",
    });
}

export function checkUserCaptcha(params) {
    return request({
        url: "checkusercaptcha",
        method: "get",
        params
    });
}