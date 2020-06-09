import request from '@/utils/request'

export function getDanCu(params) {
    return request({
      url: "dancu",
      method: "get",
      params
    });
  }
  export function editDanCu(id, data) {
    return request({
      url: "dancu/" + id,
      method: "put",
      data
    });
  }
  export function addDanCu(data) {
    return request({
      url: "dancu/add",
      method: "post",
      data
    });
  }

  export function deleteData(id,data) {
    return request({
      url: "dancu/delete/"+id,
      method: "delete",
      data
    });
  }

  export function getToaNha(params) {
    return request({
      url: "allbuilding",
      method: "get",
      params
    });
  }

 export function getSearch1(params){
       return request({
        url: "/search1",
        method: "get",
        params
    });
 }
