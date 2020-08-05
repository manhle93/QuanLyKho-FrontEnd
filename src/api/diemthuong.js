import request from "@/utils/request";

export function addCauHinh(data) {
  return request({
    url: "diemthuong",
    method: "post",
    data
  });
}

export function getCauHinh(params) {
  return request({
    url: "diemthuong",
    method: "get",
    params
  });
}

export function updateCauhinh(id, data) {
  return request({
    url: "diemthuong/" + id,
    method: "put",
    data
  });
}

export function deleteCauhinh(id) {
  return request({
    url: "diemthuong/" + id,
    method: "delete"
  });
}
