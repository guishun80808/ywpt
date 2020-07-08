const getters = {
  device: (state) => state.app.device,
  theme: (state) => state.app.theme,
  color: (state) => state.app.color,
  hasAddRoutes: (state) => state.app.hasAddRoutes,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  nickname: (state) => state.user.name,
  welcome: (state) => state.user.welcome,
  roles: (state) => state.user.roles,
  userInfo: (state) => state.user.info,
  addRouters: (state) => state.permission.addRouters,
  multiTab: (state) => state.app.multiTab,
  lang: (state) => state.i18n.lang,
  systemDeplist: (state) => state.system.systemDeplist,
  getDevice (state) {
    return state.myDevice.device;
  },
  getType: (state) => state.myDevice.deviceType,
  getOrgnList: (state) => state.myDevice.orgnization
};

export default getters;
