import Vue from 'vue';
import { login, logout, updatePass } from '@/api/user';
import { LOGIN_TIMEOUT } from '@/constant/constants';
import { USER_INFO } from '@/store/mutation-types';
import { eventListenerLoginTimeout } from '@/utils/eventListenerLoginTimeout';
const user = {
  state: {
    name: '',
    welcome: '',
    avatar: '/avatar2.jpg',
    roles: []
  },

  mutations: {
    SET_NAME: (state, { name, welcome }) => {
      state.name = name;
      state.welcome = welcome;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    }
  },

  actions: {
    // 登录
    Login ({ commit, dispatch }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then((response) => {
          if (response.code === 0) {
            const data = response.data;
            Vue.ss.set(USER_INFO, { name: data.name, role: data.role }, LOGIN_TIMEOUT);
            eventListenerLoginTimeout();
          }
          resolve(response);
        }).catch((error) => {
          reject(error);
        });
      });
    },

    UpdatePass ({ commit, dispatch }, obj) {
      return new Promise((resolve, reject) => {
        updatePass(obj).then((response) => {
          resolve(response);
        }).catch((error) => {
          reject(error);
        });
      });
    },

    // 登出
    Logout () {
      return new Promise((resolve) => {
        logout().then(() => {
          resolve();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }).catch(() => {
          resolve();
        }).finally(() => {
          Vue.ss.remove(USER_INFO);
        });
      });
    }

  }
};

export default user;
