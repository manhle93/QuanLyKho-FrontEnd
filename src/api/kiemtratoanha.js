import request from "@/utils/request";

export function index(params) {
  return request({
    url: "kiemtratoanha",
    method: "get",
    params
  });
}
export function getTrangThai() {
  return request({
    url: "trangthaikiemtra",
    method: "get",
  });
}
export function deleteKiemTraToaNha(id) {
  return request({
    url: "kiemtratoanha/" + id,
    method: "delete",
    id
  });
}
