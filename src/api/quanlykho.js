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