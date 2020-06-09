import request from '@/utils/request'

export function getChucVu() {
    return request({
        url: 'chucvu',
        method: 'get',
    })
}
export function getCapBac() {
    return request({
        url: 'capbac',
        method: 'get',
    })
}