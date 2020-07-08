import { getAllDepList } from '@/api/system';
const state = {
  systemDeplist: []
};
const mutations = {
  SET_DEPLIST: (state, systemDeplist) => {
    state.systemDeplist = systemDeplist;
  }
};

const actions = {
  getAllDepList ({ commit }, params) {
    return new Promise((resolve, reject) => {
      getAllDepList(params).then((response) => {
        if (response.code === 0) {
          console.log(response);
          commit('SET_DEPLIST', response.data);
        } else {
          resolve({
            type: response.code,
            msg: response.msg
          });
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
