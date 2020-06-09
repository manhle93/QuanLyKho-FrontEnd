import request from '@/utils/request'

export function getDonViHoTro(params) {
  return request({
    url: "donvihotro",
    method: "get",
    params
  });
}
export function addDonViHoTro(data) {
  return request({
    url: "donvihotro",
    method: "post",
    data
  });
}
export function editDonViHoTro(id, params) {
  return request({
    url: "donvihotro/" + id,
    method: "put",
    params
  });
}
export function deleteDonViHoTro(id, params) {
  return request({
    url: "donvihotro/" + id,
    method: "delete",
    params
  });
}
export function showChiTiet(id) {
  return request({
    url: "donvihotro/" + id,
    method: "get",
  });
}
export function getLoaiDonVi() {
  return request({
    url: "loaidonvihotro",
    method: "get",
  });
}
export function uploadDonViHoTro(data) {
  return request({
    url: "uploaddonvihotro",
    method: "post",
    data
  });
}
