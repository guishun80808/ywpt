import Vue from 'vue';
import store from '@/store/index';
import router from '@/router';
import { USER_INFO } from '@/store/mutation-types';

let time = null;
export function eventListenerLoginTimeout () {
  // console.warn('前端检查登陆过期定时器')
  time = setTimeout(async () => {
    const userInfo = Vue.ss.get(USER_INFO);
    if (!userInfo) {
      const { currentRoute } = router;
      if (currentRoute.name !== 'login') {
        await store.dispatch('Logout');
      }
      clearTimeout(time);
      time = null;
    } else {
      eventListenerLoginTimeout();
    }
  }, 5000);
}
