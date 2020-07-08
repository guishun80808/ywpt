import Vue from 'vue';
import VueStorage from 'vue-ls';
import { WebStorage } from 'vue-ls/src/storage/WebStorage';
import config from '@/config/defaultSettings';

// base library
import '@/core/lazy_lib/components_use';

// ext library
Vue.use(VueStorage, config.storageOptions);

/** vue-ls只能install一次，所以要想使用sessionStorage就只能将其放在Vue的原型链中 */
const ss = new WebStorage(window.sessionStorage);
ss.setOptions(config.sessionOptions);
ss.install = function (v, options) {
  v.ss = ss;
  Object.defineProperty(Vue.prototype, '$ss', {
    get () {
      return ss;
    }
  });
};
Vue.use(ss);

process.env.NODE_ENV !== 'production' && console.warn('[antd-pro] NOTICE: Antd use lazy-load.');
