import request from '@/utils/request'

export function getQuanHuyen(params) {
  return request({
    url: "quanhuyen",
    method: "get",
    params
  });
}
export function addQuanHuyen(params) {
  return request({
    url: "quanhuyen",
    method: "post",
    params
  });
}
export function editQuanHuyen(id, data) {
  return request({
    url: "quanhuyen/"+ id,
    method: "put",
    data
  });
}
export function deleteQuanHuyen(id, params) {
  return request({
    url: "quanhuyen/" + id,
    method: "delete",
    params
  });
}
export function getQuanHuyenTheoTinh(params) {
  return request({
    url: "quanhuyentheotinh",
    method: "get",
    params
  });
}