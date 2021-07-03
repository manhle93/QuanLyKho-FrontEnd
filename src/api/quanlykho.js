import request from '@/utils/request'

export function getPhieuNhap(params) {
  return request({
    url: "phieunhap",
    method: "get",
    params
  });
}

export function hangTrongKho(params) {
  return request({
    url: "tonkho",
    method: "get",
    params
  });
}

export function nhapKhoNgoai(data) {
  return request({
    url: "nhapkhongoai",
    method: "post",
    data
  });
}


export function getNhapKhoTam(params) {
  return request({
    url: "getnhapkhotam",
    method: "get",
    params
  });
}

export function nhapKhoTam(data) {
  return request({
    url: "nhapkhotam",
    method: "post",
    data
  });
}

export function chotKhoTam(id,data) {
  return request({
    url: "chotkhotam/" + id,
    method: "put",
    data
  });
}

export function huyKhoTam(id,data) {
  return request({
    url: "huykhotam/" + id,
    method: "put",
    data
  });
}