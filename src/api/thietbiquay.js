import request from "@/utils/request";

export function getThietBiQuay(params) {
  return request({
    url: "thietbiquay",
    methods: "get",
    params
  });
}
export function deleteData(id, data) {
  return request({
    url: "thietbiquay/delete/" + id,
    method: "delete",
    data
  });
}

export function editData(id, data) {
  return request({
    url: "thietbiquay/"+ id+"/edit" ,
    method: "put",
    data
  });
}
export function addData(data) {
  return request({
    url: "thietbiquay/add",
    method: "post",
    data
  });
}

export function getDataDetail(id) {
  return request({
    url: "/thietbiquay/" + id,
    method: "get"
  });
}
