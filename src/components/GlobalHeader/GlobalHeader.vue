<template>
  <transition name="showHeader">
    <div class="header-animat">
        <a-layout-header
          class="ant-header-fixedHeader"
          style="position: fixed; top: 0px; width: 100%;padding: 0;">
          <a-row type="flex" style="width: 100%;" justify="space-between" align="middle">
            <logo />
            <user-menu v-if="!showUserMenu"></user-menu>
          </a-row>
        </a-layout-header>
    </div>
  </transition>
</template>

<script>
import { Layout } from 'ant-design-vue';
import UserMenu from '../tools/UserMenu';
import Logo from '../tools/Logo';

export default {
  name: 'GlobalHeader',
  components: {
    UserMenu,
    Logo,
    'a-layout-header': Layout.Header
  },
  computed: {
    showUserMenu () {
      return this.$route.name === 'login';
    }
  }
};
</script>

<style lang="less">
@import '../index.less';

.header-animat{
  position: relative;
  z-index: @ant-global-header-zindex;
  // box-shadow: 5px 5px 5px #245893;
}
.showHeader-enter-active {
  transition: all 0.25s ease;
}
.showHeader-leave-active {
  transition: all 0.5s ease;
}
.showHeader-enter, .showHeader-leave-to {
  opacity: 0;
}
</style>
