import axios from 'axios';
import Vue from 'vue';
import store from '@/store';
import Message from 'ant-design-vue/es/message';
import { VueAxios } from './axios';

const isLocal = process.env.NODE_ENV === 'local';
let baseURL = '';
if (isLocal) {
  // 刘蒙
  // baseURL = 'http://192.168.1.149:9090/api';
  // baseURL = 'http://192.168.1.132:9090/api';
  // baseURL = 'http://192.168.1.57:9090/api';
  // baseURL = 'http://192.168.1.162:9090/api';
  // 赵贤程
  baseURL = 'https://192.168.1.78:9090/api';
  // 张红霞
  // baseURL = 'https://192.168.1.78:9090/api';
} else {
  baseURL = process.env.VUE_APP_API_BASE_URL;
}

const needLoadingApi = ['/board/findboardbyboardmap'];

const noNeedTipApi = ['/login'];
let requestNum = 0; // 网络请求个数
let loadingTimeout = null; // 网络请求loading延迟隐藏时间

// 创建 axios 实例
const service = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  withCredentials: true,
  method: 'get',
  baseURL, // api base_url
  timeout: 1000 * 60 // 请求超时时间
});

const hideLoading = () => {
  if (requestNum <= 0) {
    clearTimeout(loadingTimeout);
    loadingTimeout = setTimeout(() => {
      Vue.loading.hide();
    }, 600);
  }
};

const err = (error) => {
  let msg = '';
  if (error.response) {
    const { data, status } = error.response;
    if (status === 403) {
      msg = data.message;
    } else if (status === 401) {
      msg = data.msg;
      if (!store.state.app.hasShowGlobalAlert) {
        Vue.prototype.$info({
          content: '登陆已过期，请重新登陆',
          okText: '重新登录',
          onOk () {
            store.dispatch('Logout').then(() => {
              store.dispatch('showGlobalLoading');
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            });
          }
        });
        store.dispatch('toggleState', {
          hasShowGlobalAlert: true
        });
      }
    } else if (status === 404) {
      msg = '接口地址不存在';
    } else if (status === 500) {
      msg = '服务器内部错误';
    } else {
      msg = error.message;
    }
  } else {
    msg = '网络错误';
  }
  if (!noNeedTipApi.includes(error.config.url)) { // 不需要错误提示的接口才提示
    Message.error(msg);
  }

  if (needLoadingApi.includes(error.config.url) && requestNum > 0) {
    requestNum--;
    hideLoading();
  }

  return Promise.resolve({
    code: 100,
    msg
  });
};

service.interceptors.request.use((config) => {
  if (needLoadingApi.includes(config.url)) {
    requestNum++;
    Vue.loading.show({
      tip: '加载中......'
    });
  }
  return config;
}, err);

service.interceptors.response.use((response) => {
  if (needLoadingApi.includes(response.config.url) && requestNum > 0) {
    requestNum--;
    hideLoading();
  }
  return response.data;
}, err);

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service);
  }
};

export {
  installer as VueAxios,
  service as axios
};
