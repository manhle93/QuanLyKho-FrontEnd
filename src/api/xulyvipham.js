import request from '@/utils/request'

export function getNhomHanhVi() {
  return request({
    url: 'nhomhanhvi',
    method: 'get',
  })
}

export function addXuLyViPham(data) {
  return request({
    url: 'xulyvipham',
    method: 'post',
    data
  })
}

export function getXuLyViPham(params) {
  return request({
    url: 'xulyvipham',
    method: 'get',
    params
  })
}

export function showXuLyViPham(id) {
  return request({
    url: 'xulyvipham/' + id,
    method: 'get',
  })
}

export function updateXuLyViPham(id, data) {
  return request({
    url: 'xulyvipham/' + id,
    method: 'put',
    data
  })
}
export function deleteXuLyViPham(id) {
  return request({
    url: 'xulyvipham/' + id,
    method: 'delete',
  })
}