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

export function nhapKho(id, data) {
  return request({
    url: "nhapkho/" + id,
    method: "post",
    data
  });
}

export function xoaDonHang(id) {
  return request({
    url: "donhang/" + id,
    method: "delete",
  });
}

export function getSanPhamNhaCungCap(params) {
  return request({
    url: "sanphamnhacungcap",
    method: "get",
    params
  });
}

export function traHangNhaCungCap(data) {
  return request({
    url: "trahangnhacungcap",
    method: "post",
    data
  });
}

export function getDonTraHang(params) {
  return request({
    url: "trahangnhacungcap",
    method: "get",
    params
  });
}

export function xoaDonTraHang(id) {
  return request({
    url: "trahangnhacungcap/" + id,
    method: "delete",
  });
}

export function updateDonTraHang(id, data) {
  return request({
    url: "trahangnhacungcap/" + id,
    method: "put",
    data
  });
}

export function donHangNhapKho(id) {
  return request({
    url: "donhangnhacungcapnhapkho/" + id,
    method: "get",
  });
}