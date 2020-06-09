import request from '@/utils/request'

export function getDiemLayNuoc(params) {
  return request({
    url: "diemlaynuoc",
    method: "get",
    params
  });
}
export function addDiemLayNuoc(data) {
  return request({
    url: "diemlaynuoc",
    method: "post",
    data
  });
}
export function editDiemLayNuoc(id, data) {
  return request({
    url: "diemlaynuoc/"+id,
    method: "put",
    data
  });
}
export function deleteDiemLayNuoc(id, params) {
  return request({
    url: "diemlaynuoc/" + id,
    method: "delete",
    params
  });
}
export function showChiTiet(id) {
  return request({
    url: "diemlaynuoc/" + id,
    method: "get",
  });
}

export function uploadDiemlayNuoc(data) {
  return request({
    url: "uploaddiemlaynuoc",
    method: "post",
    data,
    timeout: 60 * 60 * 1000
  });
}
