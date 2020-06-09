import request from '@/utils/request'

export function getInfor() {
  return request({
    url: "infor",
    method: "get"
  });
}

export function editInfor(data) {
  return request({
    url: "infor",
    method: "post",
    data
  });
}

//đổi mật khẩu
export function changPassword(data) {
    return request({
      url: "changepass",
      method: "post",
      data
    });
  }
  //upload avatar
  export function uploadAvatar(data) {
    return request({
      url: "avatarupload",
      method: "post",
      headers: { "Content-Type": "multipart/form-data" },
      data
    });
  }
