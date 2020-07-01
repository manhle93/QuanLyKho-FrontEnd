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