import request from '@/utils/request'

export function addData(data) {
  return request({
    url: '/building/add',
    method: 'post',
    data
  })
}

export function addKiemtra(data) {
  return request({
    url: 'kiemtra/add',
    method: 'post',
    data
  })
}

export function editData(id, data) {
  return request({
    url: '/building/' + id + '/edit',
    method: 'put',
    data
  })
}

export function editktData(id, data) {
  return request({
    url: '/kiemtra/' + id + '/edit',
    method: 'put',
    data
  })
}
export function deleteData(id, data) {
  return request({
    url: '/building/' + id + '/delete',
    method: 'delete',
    data
  })
}

export function getListData(params) {
  return request({
    url: 'building',
    method: 'get',
    params
  })
}
export function getListMaTN(params) {
  return request({
    url: 'building',
    method: 'get',
    params
  })
}
export function getAllToaNha(params) {
  return request({
    url: 'allbuilding',
    method: 'get',
    params
  })
}
export function getDataDetail(id) {
  return request({
    url: '/building/' + id,
    method: 'get'
  })
}

export function getktDetail(id) {
  return request({
    url: '/kiemtra/' + id,
    method: 'get'
  })
}

export function getDonvi(params) {
  return request({
    url: '/donvipccc/list',
    method: 'get',
    params
  })
}
export function getDv(data) {
  return request({
    url: '/donvipccc/list/' + data,
    method: 'get'
  })
}

export function getToaNhaSearch(params) {
  return request({
    url: '/building',
    method: 'get',
    params
  })
}

export function removeFile(id, data) {
  return request({
    url: '/file/' + id + '/delete',
    method: 'delete',
    data
  })
}
export function getSearch(params) {
  return request({
    url: '/search',
    method: 'get',
    params
  })
}
export function addToaNhaDiemChay(data, id) {
  return request({
    url: '/building/diemchay/toanha/' + id,
    method: 'post',
    data
  })
}
export function getToaNhaTheoTinh(id, params) {
  return request({
    url: '/toanha/' + id,
    method: 'get',
    params
  })
}

export function uploadToaNha(data){
  return request({
    url: 'uploadtoanha',
    method: 'post',
    data
  })
}
export function addThayDoiPCCC(data){
  return request({
    url: 'thaydoipccc',
    method: 'post',
    data
  })
}
export function xoaThayDoiPCCC(id){
  return request({
    url: 'thaydoipccc/' + id,
    method: 'delete',
  })
}

export function updateThayDoiPCCC(data){
  return request({
    url: 'thaydoipccc',
    method: 'put',
    data
  })
}

export function addPcccCoSo(data){
  return request({
    url: 'pccccoso',
    method: 'post',
    data
  })
}

export function updatePcccCoSo(data){
  return request({
    url: 'pccccoso',
    method: 'put',
    data
  })
}

export function xoaPcccCoSo(id){
  return request({
    url: 'pccccoso/' + id,
    method: 'delete',
  })
}

export function addPhuongTien(data){
  return request({
    url: 'phuongtientoanha',
    method: 'post',
    data
  })
}

export function updatePhuongTien(data){
  return request({
    url: 'phuongtientoanha',
    method: 'put',
    data
  })
}

export function xoaPhuongTien(id){
  return request({
    url: 'phuongtientoanha/' + id,
    method: 'delete',
  })
}