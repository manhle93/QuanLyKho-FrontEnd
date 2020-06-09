import request from '@/utils/request'

export function getDiemChay(params) {
    return request({
        url: "diemchay/list",
        method: "get",
        params
    });
}
export function getData(params) {
    return request({
        url: "diemchay",
        method: "get",
        params
    });
}

export function addDiemChay(data) {
    return request({
        url: "diemchay/add",
        method: "post",
        data
    });
}

export function updateDiemChay(id, data) {
    return request({
        url: '/diemchay/' + id + '/edit',
        method: 'put',
        data
    });
}

export function getDataDetail(id) {
    return request({
      url: "/diemchay/" + id,
      method: "get"
    });
  }

  export function getToaNha() {
    return request({
      url: "allbuilding",
      method: "get",
    });
  }

  export function download() {
    return request({
      url: "diemchay/export/excel",
      method: "get",
    });
  }
  export function cuocGoi(data) {
    return request({
      url: "diemchay/goidien",
      method: "post",
      data
    });
  }
