import request from '@/utils/request'

export function addSanPham(data) {
  return request({
    url: "themdonhang",
    method: "post",
    data
  });
}

export function listDonHang(params) {
  return request({
    url: "danhsachdonhang",
    method: "get",
    params
  });
}

export function getDonHang(id) {
  return request({
    url: "donhang/" + id,
    method: "get",
  });
}

export function updateDonHang(id,data) {
  return request({
    url: "donhang/" + id,
    method: "put",
    data
  });
}

export function duyetDon(id) {
  return request({
    url: "duyetdon/" + id,
    method: "put",
  });
}

export function huyDon(id) {
  return request({
    url: "huydon/" + id,
    method: "put",
  });
}

export function nhapKho(id) {
  return request({
    url: "nhapkho/" + id,
    method: "post",
  });
}