import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/';
import { VueAxios } from './utils/request';
import './mock';

import bootstrap from './core/bootstrap';
import './core/lazy_use';
import { eventListenerLoginTimeout } from '@/utils/eventListenerLoginTimeout';

import './permission';
import './utils/filter';
import './components/global.less';
import './components/iconfonts.css';
eventListenerLoginTimeout();

Vue.use(VueAxios);

new Vue({
  router,
  store,
  created: bootstrap,
  render: (h) => h(App)
}).$mount('#app');
