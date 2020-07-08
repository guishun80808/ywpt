import { axios } from '@/utils/request';

function login (parameter) {
  return axios({
    url: '/login',
    method: 'post',
    data: parameter
  });
}

// 修改密码
function updatePass (parameter) {
  return axios({
    url: '/modifypass',
    method: 'post',
    data: parameter
  });
}

// 登出
function logout () {
  return axios({
    url: '/logout'
  });
}

export {
  login,
  updatePass,
  logout
};
