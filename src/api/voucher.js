import request from "@/utils/request";

export function addVoucher(data) {
  return request({
    url: "voucher",
    method: "post",
    data
  });
}

export function voucher(params) {
  return request({
    url: "voucher",
    method: "get",
    params
  });
}

export function updateVoucher(id, data) {
  return request({
    url: "voucher/" + id,
    method: "put",
    data
  });
}
export function deleteVoucher(id) {
  return request({
    url: "voucher/" + id,
    method: "delete"
  });
}