import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';

// default router permission control
import permission from './modules/permission';
import myDevice from './modules/my-device';
import system from './modules/system';
import instrumentpanel from './modules/instrumentpanel';

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    system,
    myDevice,
    instrumentpanel
  },
  state: {},
  mutations: {
  },
  actions: {
  },
  getters
});
