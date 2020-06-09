import request from '@/utils/request'

export function addThamDinhPheDuyet(data) {
    return request({
        url: 'thamdinhpheduyet',
        method: 'post',
        data
    })
}

export function getThamDinhPheDuyet(params) {
    return request({
        url: 'thamdinhpheduyet',
        method: 'get',
        params
    })
}
export function showThamDinhPheDuyet(id) {
    return request({
        url: 'thamdinhpheduyet/' + id,
        method: 'get',       
    })
}

export function updateThamDinhPheDuyet(id, data) {
    return request({
        url: 'thamdinhpheduyet/' + id,
        method: 'put',      
        data 
    })
}

export function deleteThamDinhPheDuyet(id) {
    return request({
        url: 'thamdinhpheduyet/' + id,
        method: 'delete',      
    })
}