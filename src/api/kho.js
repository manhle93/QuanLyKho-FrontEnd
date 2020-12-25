import request from '@/utils/request'

export function getKho(params) {
  return request({
    url: "kho",
    methods: 'get',
    params
  })
}


export function editKho(id, data) {
  return request({
      url: '/kho/' + id,
      method: 'put',
      data
  })
}

export function xoaKho(id) {
  return request({
      url: '/kho/' + id,
      method: 'delete',
  })
}

export function addKho(data) {
  return request({
      url: 'kho',
      method: 'post',
      data
  })
}

export function getSanPhamTonKho(params) {
  return request({
      url: 'sanphamtonkho',
      method: 'get',
      params
  })
}

export function addKiemKho(data) {
  return request({
      url: 'kiemkho',
      method: 'post',
      data
  })
}

export function getKiemKho(params) {
  return request({
      url: 'kiemkho',
      method: 'get',
      params
  })
}

export function getChiTiet(id) {
  return request({
      url: 'kiemkho/' + id,
      method: 'get',
  })
}

export function kiemKho(id, data) {
  return request({
      url: 'kiemkho/' + id,
      method: 'put',
      data
  })
}

export function pheDuyet(id,data) {
  return request({
      url: 'duyetkiemkho/' + id,
      method: 'put',
      data
  })
}
export function huyBo(id) {
  return request({
      url: 'huykiemkho/' + id,
      method: 'put',
  })
}

export function xoaKiemKho(id) {
  return request({
      url: 'kiemkho/' + id,
      method: 'delete',
  })
}

export function getNhanVien() {
  return request({
      url: 'nhanvien',
      method: 'get',
  })
}

export function addXuatHuy(data) {
  return request({
      url: 'xuathuy',
      method: 'post',
      data
  })
}

export function getXuatHuy(params) {
  return request({
      url: 'xuathuy',
      method: 'get',
      params
  })
}

export function chiTietXuatHuy(id) {
  return request({
      url: 'xuathuy/' + id,
      method: 'put',
  })
}

export function downloadNhapKho(params) {
  return request({
      url: 'bcnhapkho',
      method: 'get',
      params,
      responseType: "blob"
  })
}