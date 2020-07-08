import { findDeviceById } from '@/api/myDevice';
const myDevice = {
  namespaced: true,
  state: {
    rowId: null,
    device: {},
    deviceType: {},
    orgnization: {}
  },
  mutations: {
    setRowId (state, rowId) {
      state.rowId = rowId;
    },
    setDetail (state, obj) {
      state.device = obj;
    },
    clearDetail (state) {
      state.device = {};
    },
    setType (state, obj) {
      state.deviceType = obj;
    },
    setOrgnization (state, obj) {
      state.orgnization = obj;
    }
  },
  actions: {
    setRowId ({ commit }, rowId) {
      commit('setRowId', rowId);
    },
    async findDeviceById ({ commit }, rowId) {
      const data = await findDeviceById({ id: rowId });
      if (data.code === 0) {
        commit('setDetail', data.data);
      }
    },
    setAndGetOrgnization ({ commit }, obj) {
      commit('Orgnization', obj);
      return obj;
    }
  }
};

export default myDevice;
