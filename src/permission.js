import Vue from 'vue';
import router from './router';
import store from './store';

import NProgress from 'nprogress'; // progress bar
import '@/components/NProgress/nprogress.less'; // progress bar custom style
import { setDocumentTitle, domTitle } from '@/utils/domUtil';
import { USER_INFO } from '@/store/mutation-types';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['login']; // no redirect whitelist
const defaultRoutePath = '/zall/home';

router.beforeEach((to, from, next) => {
  NProgress.start(); // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`));
  const ss = Vue.prototype.$ss;
  const userInfo = ss.get(USER_INFO);
  if (userInfo) {
    if (to.path === '/user/login') {
      next({ path: defaultRoutePath });
      NProgress.done();
    } else {
      if (!store.getters.hasAddRoutes) {
        const roles = [userInfo.role];
        store.dispatch('GenerateRoutes', { roles }).then((res) => {
          store.dispatch('toggleState', {
            hasAddRoutes: true
          });
          // 根据roles权限生成可访问的路由表
          // 动态添加可访问路由表
          router.addRoutes(res);
          next(to);
        });
      } else {
        next();
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } });
      NProgress.done(); // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});
