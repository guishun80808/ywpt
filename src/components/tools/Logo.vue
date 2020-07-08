<template>
  <div @click="clickLogo" ref="logo" class="logo" :style="{width: `${!showFucMenu ? 130: 100}px`}">
    <img src="~@/assets/logo-default.png" style="width: auto; height: 55px;">
    <span v-show="!showFucMenu" class="arrow-right"></span>

    <div class="ant-modal-mask" @click="onClose" v-show="visibleMenu" style="background: transparent;z-index: 10000;">
      <div class="main-menu">
        <home @click="onClose" />
      </div>
    </div>
  </div>
</template>

<script>
import Home from '@/views/home/home';
export default {
  name: 'Logo',
  components: {
    Home
  },
  data () {
    return {
      visibleMenu: false
    };
  },
  computed: {
    showFucMenu () {
      return this.$route.name === 'zallHome' || this.$route.name === 'login';
    }
  },
  methods: {
    clickLogo (e) {
      if (this.showFucMenu) {
        return;
      }
      if (!this.isHome) {
        this.onClose(e);
      }
    },
    onClose (e) {
      e.stopPropagation();
      this.visibleMenu = !this.visibleMenu;
    }
  }
};
</script>
<style scoped lang="less">
  @import url(~@/assets/style/less/theme-color.less);

  .logo{
    display:flex;
    align-items: center;
    cursor: pointer;
    height: 55px;
    justify-content: flex-end;
    padding-right: 10px;
    &:hover {
      background: #2362aa;
    }
  }
  .arrow-right {
    background: url(~@/assets/open-icon.png) 0 0 no-repeat;
    width: 13px;
    height: 14px;
    cursor: pointer;
    margin: 0 10px;
  }

  .main-menu {
    position:fixed;
    z-index: 10001;
    top: 55px;
    background: @header-hover-func-menu-bg !important;
    width: 100%;
    left: 0;
    min-height: 200px;
    line-height: 25px;
    padding: 30px;
  }
</style>
